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

  .factory('ILService', function (Util, $resource, $q, anonymizationConfig, algoConfig) {
    //use $resource later for retrieval from webservice
    //let dataResource = $resource('assets/testdata/marital-status-k2.json');
    //let data = dataResource.query();

    let basename = algoConfig.basename;
    let filename_originalData = algoConfig.originalData;

    let csvIn = new $A.IO.CSVIN($A.config.adults);
    //console.log("CSV Reader: ");
    //console.log(csvIn);

    let url = basename + "/" + filename_originalData;
    let output = basename + "/output";

    //console.log("config:");
    //console.dir(config);

    // Specify Generalization hierarchy files
    let gen_base = algoConfig.gen_base,
      workclass_file = gen_base + 'workclassGH.json',
      sex_file = gen_base + 'sexGH.json',
      race_file = gen_base + 'raceGH.json',
      marital_file = gen_base + 'marital-statusGH.json',
      nat_country_file = gen_base + 'native-countryGH.json',
      relationship_file = gen_base + 'relationshipGH.json',
      occupation_file = gen_base + 'occupationGH.json',
      income_file = gen_base + 'incomeGH.json';

    return {
      createSan: function(config) {
        let defer = $q.defer();

        setTimeout(function() {
            let san = new $A.algorithms.Sangreea("sangreea", config);
            //console.log("SaNGreeA Algorithm:");
            //console.log(san);

            // Inspect the internal graph => should be empty
            //console.log("Graph Stats BEFORE Instantiation:");
            //console.log(san._graph.getStats());

            $.ajaxSetup({
                async: false
            });

            // Load Generalization hierarchies
            [workclass_file, nat_country_file, sex_file, race_file, marital_file,
                relationship_file, occupation_file, income_file].forEach(function (file) {
                var json = $.getJSON(file).responseText;
                //console.log(json);
                let strgh = new $A.genHierarchy.Category(json);
                san.setCatHierarchy(strgh._name, strgh);
            });

            defer.resolve(san);
        }, 0);

        return defer.promise;

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
       * deprecated
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
       * One case is a triple of cluster1 (top), center datapoint and cluster2 (bottom)
       * @param k factor
       * @param nrOfCases number of cases to be retrieved
       */
      getCases: function(k, nrOfCases) {
        let deferred = $q.defer();

        let cases;
        let promises = [];

        for (let i = 0; i < nrOfCases; i++) {
          let promise = this.getCase(k);
          promises.push(promise);
        }

        $q.all(promises).then(function(data) {
          cases = data;
          deferred.resolve(cases);
        });

        return deferred.promise;
      },

      getCase: function(k) {

        let deferred = $q.defer();

        /*
            generate two random clusters
            cluster1[0] and cluster2[0] is the header.. age, ...
            cluster1[1] and cluster2[1]is the fixed element (element in the middle)
            cluster1[2-20] and cluster2[2-20] are random elements of the 500element csv file
         */

        // generate the random data point sample index (used for both clusters)
        let fixedIndex = Math.ceil(Math.random() * algoConfig.originalDataCSVLength);
        let promise_randomWeightClusters1 = this.calculateRandomClusters(k, fixedIndex);
        let promise_randomWeightClusters2 = this.calculateRandomClusters(k, fixedIndex);

        $q.all([promise_randomWeightClusters1, promise_randomWeightClusters2]).then(function (values) {
          let clusters1 = values[0][0]; //randomWeightClusters1 clusters
          let weights1 = values[0][1];  //randomWeightClusters1 weights
          let clusters2 = values[1][0]; //randomWeightClusters2 clusters
          let weights2 = values[1][1];  //randomWeightClusters2 weights, same as cluster1's
          let san1 = values[0][2];      //randomWeightClusters1 san
          let san2 = values[1][2];      //randomWeightClusters2 san

          // since we have our fixed same data point element at the first index, it can be found
          // in both cluster arrays in the first cluster in the first node (due to anonymization implementation)
          let cluster_obj ={};
          cluster_obj.cluster1 = clusters1[0];  //we only need one/first cluster
          cluster_obj.cluster2 = clusters2[0];  //we only need one/first cluster
          cluster_obj.dataPoint = clusters1[0].nodes[0]; //our fixed node is always the first

          if(JSON.stringify(cluster_obj.cluster1.nodes[0]) !== JSON.stringify(cluster_obj.cluster2.nodes[0]))
            alert("fail");

          cluster_obj.weights = weights1;
          cluster_obj.cluster1.cost = san1.calculateGIL(cluster_obj.cluster1, cluster_obj.dataPoint);
          cluster_obj.cluster2.cost = san2.calculateGIL(cluster_obj.cluster2, cluster_obj.dataPoint);

          // calculate the level of the features
          function getLevelOfCategoryNodeCluster(san, Cl) {
            let cl_entry_levels = [];
            for (var feat in san._cat_hierarchies) {
              var cat_gh = san.getCatHierarchy(feat);
              var Cl_feat;
              if(Cl.gen_feat)
                Cl_feat = Cl.gen_feat[feat];
              else if(Cl._features)
                Cl_feat = Cl._features[feat];
              else
                alert("fail")

              var Cl_level = cat_gh.getLevelEntry(Cl_feat);
              cl_entry_levels[feat] = Cl_level;
            }
            return cl_entry_levels;
          }
          // calculate the extended ranges of the features
          function getRangesOfNodeCluster(san, Cl) {
            let cl_entry_levels = [];
            for (var feat in san._cont_hierarchies) {
              var Cl_feat;
              if(Cl.gen_ranges)
                cl_entry_levels[feat] = Cl.gen_ranges[feat][1] - Cl.gen_ranges[feat][0];
              else if(Cl._features)
                cl_entry_levels[feat] = Cl._features[feat][1] - Cl._features[feat][0];
              else
                alert("fail")
            }
            return cl_entry_levels;
          }

          //get levels of anonymization cluster1 and cluster2 and original datapoint
          cluster_obj.cluster1_cat_level = getLevelOfCategoryNodeCluster(san1, cluster_obj.cluster1);
          cluster_obj.cluster2_cat_level = getLevelOfCategoryNodeCluster(san2, cluster_obj.cluster2);
          cluster_obj.datapoint_cat_level = getLevelOfCategoryNodeCluster(san1, cluster_obj.dataPoint);

          //get range of modified value
          cluster_obj.cluster1_cont_range = getRangesOfNodeCluster(san1, cluster_obj.cluster1);
          cluster_obj.cluster2_cont_range = getRangesOfNodeCluster(san2, cluster_obj.cluster2);

          //before: [cluster_obj.dataPoint, cluster_obj.cluster1, cluster_obj.cluster2]
          deferred.resolve(cluster_obj);

        }, function(reason) {              //error
          console.log("ILCTrl " + "[error] retrieving of anonymized clusters and centers failed: ", reason);
        });

        return deferred.promise;
      },

      /**
       *  Draws nrOfAdditonalDraws + one fixed datarow from csv and calculates the SAN Graph with this small dataset
       *  The first node of the first cluster will be the one with fixedIndex
       */
      calculateRandomClusters: function(k, fixedIndex) {

        // get global config data of config.js
        let config = anonymizationConfig;
        config.NR_DRAWS = algoConfig.nrOfDrawsMultiplier * k + 1;
        config.K_FACTOR = k;

        let defer = $q.defer();
        //this returns a promise, as we call a return in then block
        this.createSan(config).then(function(san) {

            // Remotely read the original data and anonymize
          csvIn.readCSVFromURL(url, function (csv) {
              let randNrs = [];
              while (randNrs.length < config.NR_DRAWS - 1) {
                  let randomnumber = Math.ceil(Math.random() * algoConfig.originalDataCSVLength);
                  if (randNrs.indexOf(randomnumber) > -1 || randomnumber === fixedIndex || randomnumber === 0)
                      continue;
                  randNrs[randNrs.length] = randomnumber;
              }

              let shortCSV = [];

              shortCSV.push(csv[0]);      // header
              shortCSV.push(csv[fixedIndex]);
              for (let a in randNrs)
                  shortCSV.push(csv[randNrs[a]]);
              //console.log("shortCSV", shortCSV);

              san.instantiateGraph(shortCSV, false);

              // Inspect the internal graph again => should be populated now
              //console.log("Graph Stats AFTER Instantiation:");
              //console.log(san._graph.getStats());

              // let's run the whole anonymization inside the browser
              san.anonymizeGraph();

              defer.resolve( [san._clusters, anonymizationConfig.GEN_WEIGHT_VECTORS[anonymizationConfig.VECTOR], san]);
          });

        });

        return defer.promise;

      },

      saveUserDecisionsAndCalculateNewWeights: function (userDecisions) {
        //console.log("calculating new weights for: ", userDecisions);

        let sum_of_levels = {};
        let sum_of_ranges = {};

        //Calculate mean of range and cat
        userDecisions.forEach((dec) => {
          console.log(dec);
          for (let level in dec.cat_level) {
              if (!dec.cat_level.hasOwnProperty(level))
                  continue;
              if(sum_of_levels[level] === undefined)
                  sum_of_levels[level] = 0;
              //                                                mean                normalize (always the same number)
              sum_of_levels[level] += dec.cat_level[level] / algoConfig.nrOfCases / dec.datapoint_cat_level[level];

          }

          for (let range in dec.cont_range) {
              if (!dec.cont_range.hasOwnProperty(range))
                  continue;

              if(sum_of_ranges[range] === undefined)
                  sum_of_ranges[range] = 0;

              //max is used to avoid to go beneath 0
              //we calculate the amount of anonymization, but we need the importance, thus 1 -
              sum_of_ranges[range] += (1 - Math.min(dec.cont_range[range] / dec.dataPoint._features[range], 1)) / algoConfig.nrOfCases ;

          }
        });

        let total_sum = 0;
        for(let l in sum_of_levels) {
          if(!sum_of_levels.hasOwnProperty(l))
            continue;

          total_sum += sum_of_levels[l];
        }

          for(let l in sum_of_ranges) {
              if(!sum_of_ranges.hasOwnProperty(l))
                  continue;

              total_sum += sum_of_ranges[l];
          }

        //normalize to a sum of 1 (for weight vectors)
        for (let level in sum_of_levels) {
          if (!sum_of_levels.hasOwnProperty(level))
            continue;
          sum_of_levels[level] /= total_sum;
        }
        for (let range in sum_of_ranges) {
          if (!sum_of_ranges.hasOwnProperty(range))
            continue;
          sum_of_ranges[range] /= total_sum;
        }
        //console.log("norm1: ", sum_of_levels, sum_of_ranges);

        let new_weights = {categorical:{}, range:{}};
        let old_weights = anonymizationConfig['GEN_WEIGHT_VECTORS'][anonymizationConfig.VECTOR];

        // calculate differences to old weights
        for (let weight in old_weights['categorical']) {
          if (!old_weights['categorical'].hasOwnProperty(weight))
            continue;
          sum_of_levels[weight] -= old_weights['categorical'][weight];
          new_weights['categorical'][weight] = old_weights['categorical'][weight]
            + (sum_of_levels[weight]/(algoConfig.maxKFactor - algoConfig.startKFactor));
        }
        for (let weight in old_weights['range']) {
          if (!old_weights['range'].hasOwnProperty(weight))
            continue;
          sum_of_ranges[weight] -= old_weights['range'][weight];
          new_weights['range'][weight] = old_weights['range'][weight]
            + (sum_of_ranges[weight]/(algoConfig.maxKFactor - algoConfig.startKFactor));
        }

        anonymizationConfig['GEN_WEIGHT_VECTORS']['weights'] = new_weights;
        anonymizationConfig['VECTOR'] = 'weights';

        console.log("our new weights are: ", new_weights);
      },

      //deprecated
      getAnonymizedRecords: function () {
        let san = this.createSan(config);

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
