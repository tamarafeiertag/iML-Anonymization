'use strict';

angular.module('iMLApp.interactive-learning.interactive-learning-service', [])

  .factory('Util', function() {
    return {
      randomBetween: function(min, max) {
        var ret = Math.random() * max;
        while(ret + min > max)
          ret = Math.random() * max;
        return ret + min;
      },
      shuffle: function(a) {
        for (let i = a.length; i; i--) {
          let j = Math.floor(Math.random() * i);
          [a[i - 1], a[j]] = [a[j], a[i - 1]];
        }
        return a;
      },
      generateRandomNumbers: function(max, nrOfNumbers) {
        var r = [];
        var m = max;
        for(let i = 0; i < nrOfNumbers-1; i++) {
          r[i] = this.randomBetween(0, m);
          m -= r[i]
        }
        r[nrOfNumbers-1] = m;
        return this.shuffle(r);
      }
    }
  })

  .factory('ILService', function (Util, $resource, $q, anonymizationConfig) {
    //use $resource later for retrieval from webservice

    let dataResource = $resource('assets/testdata/marital-status-k2.json');
    let data = dataResource.query();

    console.log("AnonymizationJS:");
    console.dir($A);

    console.log("GraphiniusJS:");
    console.dir($G);

    let basename = "assets/00_sample_data_UI_prototype";
    let filename_originalData = "original_data_500_rows.csv";

    let TARGETS = [
      "target_education-num",
      "target_marital-status",
      "target_income"
    ];

    let csvIn = new $A.IO.CSVIN($A.config.adults);
    //console.log("CSV Reader: ");
    //console.log(csvIn);

    let url = basename + "/" + filename_originalData;
    let output = basename + "/output";

    //console.log("config:");
    //console.dir(config);

    // Specify Generalization hierarchy files
    let gen_base = 'assets/genHierarchies/',
      workclass_file = gen_base + 'workclassGH.json',
      sex_file = gen_base + 'sexGH.json',
      race_file = gen_base + 'raceGH.json',
      marital_file = gen_base + 'marital-statusGH.json',
      nat_country_file = gen_base + 'native-countryGH.json',
      relationship_file = gen_base + 'relationshipGH.json',
      occupation_file = gen_base + 'occupationGH.json',
      income_file = gen_base + 'incomeGH.json';

    return {
      getTestdata: function (callback) {
        let TestdataResource = $resource('assets/testdata/testdatarecords.json');
        TestdataResource.get(callback);
      },
      getMaritalStatusK2: function () {
        return data.$promise;
      },

      createSan: function(config, gen_base) {
        let san = new $A.algorithms.Sangreea("testus", config);


        // Inspect the internal graph => should be empty
        console.log("Graph Stats BEFORE Instantiation:");
        console.log(san._graph.getStats());

        // Uff, this feels like 2012 at the latest....
        $.ajaxSetup({
          async: false
        });

        // Load Generalization hierarchies
        [workclass_file, nat_country_file, sex_file, race_file, marital_file,
          relationship_file, occupation_file, income_file].forEach( function(file) {
          var json = $.getJSON(file).responseText;
          //console.log(json);
          let strgh = new $A.genHierarchy.Category(json);
          san.setCatHierarchy(strgh._name, strgh);
        });

        return san;
      },

      getWeightsArray: function(custom_weights) {

        let weights = [];
        weights.push(custom_weights.range['age']);
        weights.push(0.0); //space for education-num
        weights.push(custom_weights.range['hours-per-week']);
        weights.push(custom_weights.categorical['workclass']);
        weights.push(custom_weights.categorical['native-country']);
        weights.push(custom_weights.categorical['sex']);
        weights.push(custom_weights.categorical['race']);
        weights.push(custom_weights.categorical['relationship']);
        weights.push(custom_weights.categorical['occupation']);
        weights.push(custom_weights.categorical['income']);
        weights.push(custom_weights.categorical['marital-status']);

        return weights;
      },

      /**
       * Retrieves the data records from original csv that have not been anonymized
       */
      getNotAnonymizedRecords: function () {
        let deferred = $q.defer();

        csvIn.readCSVFromURL(url, function(csv) {
          let records = [];
          let headers = csv[0].split(", ");
          let anonymizedRecordsCount = config.NR_DRAWS;

          for (let recordIdx = 1; recordIdx <= (500-anonymizedRecordsCount); recordIdx++) {
            let record = csv[anonymizedRecordsCount + recordIdx].split(", ");
            records[recordIdx-1] = {};
            for (let i = 0; i < headers.length; i++) {
              records[recordIdx-1][headers[i]] = record[i];
            }
          }

          //TODO: order records / data point randomly

          //console.log("nodes: ", records);

          deferred.resolve(records);
        });

        return deferred.promise;
      },

      /**
       *
       */
      calculateRandomClusters: function(nrOfDraws, k) {
        let config = anonymizationConfig;

        config.NR_DRAWS = nrOfDraws;
        config.K_FACTOR = k;

          /*
          let randWeights = Util.generateRandomNumbers(1, 10);

          let random_weights = {
            'categorical': {
              'workclass': randWeights[0],
              'native-country': randWeights[1],
              'sex': randWeights[2],
              'race': randWeights[3],
              'relationship': randWeights[4],
              'occupation': randWeights[5],
              'income': randWeights[6],
              'marital-status': randWeights[7]
            },
            'range': {
              'age': randWeights[8],
              'hours-per-week': randWeights[9]
            }
          };
           config.GEN_WEIGHT_VECTORS['custom_weights'] = random_weights;
        */

          config.VECTOR = 'equal';

        //console.log("random weights:");
        //console.dir(random_weights);

        let san = this.createSan(config, gen_base);

        let deferred = $q.defer();

        // Remotely read the original data and anonymize
        csvIn.readCSVFromURL(url, function(csv) {
          san.instantiateGraph(csv, false );
          // Inspect the internal graph again => should be populated now
          //console.log("Graph Stats AFTER Instantiation:");
          //console.log(san._graph.getStats());

          // let's run the whole anonymization inside the browser
          san.anonymizeGraph();

          // let's take a look at the clusters
          //console.log("Clusteres:");
          //console.dir(san._clusters);

          deferred.resolve([san._clusters, random_weights]);
        });

        return deferred.promise;
      },

      getCase: function(nrOfDraws, k) {
        console.log("In case");

        let deferred = $q.defer();

        let promise_randomWeightClusters1 = this.calculateRandomClusters(nrOfDraws, k);

        promise_randomWeightClusters1.then(function (values) {

          console.log("IN promose r")
          let clusters1 = values[0][0];
          let weights1 = values[0][1];
          let clusters2 = values[1][0];
          let weights2 = values[1][1];

          let rIdx1 = Math.floor(Util.randomBetween(0, nrOfDraws/k));
          let rand, rIdx2;

          let cluster1 = clusters1[rIdx1];

          while((rand = Math.floor(Util.randomBetween(0, nrOfDraws/k))) === rIdx10);
          let cluster2 = clusters1[rand];
          rIdx2 = rand;

          while((rand = Math.floor(Util.randomBetween(0, nrOfDraws/k))) === rIdx1 || rIdx2 === rand);
          let dataPoint = Object.values(clusters1[rand].nodes)[0];

          console.dir(clusters1);
          console.dir(clusters2);

          cluster1.weights = weights1;
          cluster2.weights = weights1;

          deferred.resolve([dataPoint, cluster1, cluster2]);

        }, function(reason) {              //error
          console.log("ILCTrl " + "[error] retrieving of anonymized clusters and centers failed: ", reason);
        });

        return deferred.promise;
      },

      getCases: function(nrOfCases, nrOfDraws, k) {
        let deferred = $q.defer();

        let cases;
        let promise = this.getCase(nrOfDraws, k);


        promise.then(function(data) {
          console.log("Promise cases", data);

          cases = data;
          deferred.resolve(cases);
          console.log("cases ", cases);
        });

        return deferred.promise;
      },

      getAnonymizedRecords: function () {
        let san = this.createSan(config, gen_base);

        let deferred = $q.defer();

        // Remotely read the original data and anonymize
        csvIn.readCSVFromURL(url, function(csv) {
          //console.log("File URL ANON: " + url);
          //console.log("File length ANON in total rows:");
          //console.log(csv.length);
          //console.log("Headers:");
          //console.log(csv[0]);
          //console.log(csv[1]);

          san.instantiateGraph(csv, false );
          // Inspect the internal graph again => should be populated now
          console.log("Graph Stats AFTER Instantiation:");
          console.log(san._graph.getStats());

          // let's run the whole anonymization inside the browser
          san.anonymizeGraph();

          // let's take a look at the clusters
          console.log("Clusteres:");
          console.dir(san._clusters);

          sampleCostCalculation(san);
          deferred.resolve(san._clusters);
        });

        //san.outputAnonymizedCSV(output);


        function sampleCostCalculation(san) {
          // Compute costs between some Cluster and some node
          let cluster = selectRandomCluster(san._clusters);
          let node = san._graph.getRandomNode();

          function selectRandomCluster(clusters) {
            return clusters[Math.floor(Math.random()*clusters.length)];
          }

          console.log("\n Computing cost of generalization between cluster and node:");
          console.log(cluster);
          console.log(node);
          console.log("Cost: " + san.calculateGIL(cluster, node));
        }

        return deferred.promise;
      }
    }
  });
