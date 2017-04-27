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
          m -= r[i];
        }
        r[nrOfNumbers-1] = m;
        return this.shuffle(r);
      }
    };
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
        console.log("SaNGreeA Algorithm:");
        console.log(san);


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
      calculateRandomClusters: function(nrOfAdditionalDraws, fixedIndex, k) {

        // get global config data of config.js
        let config = anonymizationConfig;
        config.NR_DRAWS = nrOfAdditionalDraws + 1;
        config.K_FACTOR = k;

        let san = this.createSan(config, gen_base);
        let deferred = $q.defer();

        // Remotely read the original data and anonymize
        csvIn.readCSVFromURL(url, function(csv) {

          let randNrs = [];
          while(randNrs.length < nrOfAdditionalDraws){
              let randomnumber = Math.ceil(Math.random()*csv.length);
              if(randNrs.indexOf(randomnumber) > -1 || randomnumber === fixedIndex || randomnumber === 0) continue;
              randNrs[randNrs.length] = randomnumber;
          }

          let shortCSV = [];

          shortCSV.push(csv[0]);
          shortCSV.push(csv[fixedIndex]);
          for(let a in randNrs)
            shortCSV.push(csv[randNrs[a]]);

          console.log("shortCSV", shortCSV);
          san.instantiateGraph(shortCSV, false );
          // Inspect the internal graph again => should be populated now
          //console.log("Graph Stats AFTER Instantiation:");
          //console.log(san._graph.getStats());

          // let's run the whole anonymization inside the browser
          san.anonymizeGraph();

          // let's take a look at the clusters
          //console.log("Clusteres:");
          //console.dir(san._clusters);

          deferred.resolve([san._clusters, anonymizationConfig.GEN_WEIGHT_VECTORS.equal_weights]);
        });

        return deferred.promise;
      },

      getCase: function(nrOfDraws, k) {

        let deferred = $q.defer();

        /*
            generate two random clusters
            cluster1[0] and cluster2[0] is the header.. age, ...
            cluster1[1] and cluster2[1]is the fixed element (element in the middle)
            cluster1[2-20] and cluster2[2-20] are random elements of the 500element csv file
         */
        let promise_randomWeightClusters1 = this.calculateRandomClusters(nrOfDraws - 1, 1, k);
        let promise_randomWeightClusters2 = this.calculateRandomClusters(nrOfDraws - 1, 1, k);

        function findEqualDataPoints(clusters1, clusters2) {
          let ret_vals = [];

          let combined_cluster_string = []

          //build map of cluster1 index and both node values as string for comparison
          for(let cl1_idx in clusters1)
          {
            combined_cluster_string[cl1_idx] = []
            for(let cli1_node_idx in clusters1[cl1_idx].nodes)
            {
              combined_cluster_string[cl1_idx].push(JSON.stringify(clusters1[cl1_idx].nodes[cli1_node_idx]));
            }
          }

          //search for the duplicate element in clusters1 and clusters2
          // TODO seems to be in both in the first cluster the first element!!!
          for(let cl2_idx in clusters2)
          {
            for(let cli2_node_idx in clusters2[cl2_idx].nodes)
            {
              for(let cl1_idx in combined_cluster_string)
              {
                for(let cli1_node_idx in combined_cluster_string[cl1_idx])
                {
                  if(combined_cluster_string[cl1_idx][cli1_node_idx] === JSON.stringify(clusters2[cl2_idx].nodes[cli2_node_idx]))
                  {
                    console.log("found")
                    ret_vals.dataPoint = JSON.parse(combined_cluster_string[cl1_idx][cli1_node_idx])
                    ret_vals.cluster1 = clusters1[cl1_idx]
                    ret_vals.cluster2 = clusters2[cl2_idx]
                    return ret_vals;
                  }
                }
              }
            }
          }

          console.log("NOTHING FOUND???")
        }

        $q.all([promise_randomWeightClusters1, promise_randomWeightClusters2]).then(function (values) {

          let clusters1 = values[0][0];
          let weights1 = values[0][1];
          let clusters2 = values[1][0];
          let weights2 = values[1][1];

          var ret_vals = findEqualDataPoints(clusters1, clusters2)

          ret_vals.cluster1.weights = weights1;
          ret_vals.cluster2.weights = weights2;

          deferred.resolve([ret_vals.dataPoint, ret_vals.cluster1, ret_vals.cluster2]);

        }, function(reason) {              //error
          console.log("ILCTrl " + "[error] retrieving of anonymized clusters and centers failed: ", reason);
        });

        return deferred.promise;
      },

      getCases: function(nrOfCases, nrOfDraws, k) {
        let deferred = $q.defer();

        let cases;
        let promises = [];

        for (let i = 0; i < nrOfCases; i++) {
          let promise = this.getCase(nrOfDraws, k);
          promises.push(promise);
        }

        $q.all(promises).then(function(data) {
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
