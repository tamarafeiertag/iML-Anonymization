'use strict';

angular.module('iMLApp.interactive-learning.interactive-learning-service', [])

  .factory('ILService', function ($resource) {
    //use $resource later for retrieval from webservice

    let dataResource = $resource('assets/testdata/marital-status-k2.json');
    let data = dataResource.query();

    return {
      getTestdata: function (callback) {
        let TestdataResource = $resource('assets/testdata/testdatarecords.json');
        TestdataResource.get(callback);
      },
      getMaritalStatusK2: function () {
        return data.$promise;
      },
      getAnonymizationRecords: function () {

        console.log("AnonymizationJS:");
        console.dir($A);

        console.log("GraphiniusJS:");
        console.dir($G);

        let basename = "assets/00_sample_data_UI_prototype";

        let TARGETS = [
          "target_education-num",
          "target_marital-status",
          "target_income"
        ];

        let filename = "original_data_500_rows.csv";
        let anonym_file = "adults_anonymized_k3_equal.csv";

        let csvIn = new $A.IO.CSVIN($A.config.adults);
        console.log("CSV Reader: ");
        console.log(csvIn);


        let url = basename + "/" + TARGETS[0] + "/" + filename;

        // Instantiate a SaNGreeA object
        // NOTE: The config should be instantiated by the User Interface,
        // the internal $A.config... was only for testing!
        let config = $A.config.adults;

        // of course we can overwrite the settings locally
        config.NR_DRAWS = 500; // max for this file...
        config.K_FACTOR = 7;

        let san = new $A.algorithms.Sangreea("testus", config);
        console.log("SaNGreeA Algorithm:");
        console.log(san);


        // Inspect the internal graph => should be empty
        console.log("Graph Stats BEFORE Instantiation:");
        console.log(san._graph.getStats());


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

        // Uff, this feels like 2012 at the latest....
        $.ajaxSetup({
          async: false
        });

        // Load Generalization hierarchies



        // Remotely read the original data and anonymize
        csvIn.readCSVFromURL(url, function(csv) {
          console.log("File URL ANON: " + url);
          console.log("File length ANON in total rows:");
          console.log(csv.length);
          console.log("Headers:")
          console.log(csv[0]);
          console.log(csv[1]);

          san.instantiateGraph(csv, false );
          // Inspect the internal graph again => should be populated now
          console.log("Graph Stats AFTER Instantiation:");
          console.log(san._graph.getStats());

          // let's run the whole anonymization inside the browser
          san.anonymizeGraph();

          // let's take a look at the clusters
          console.dir(san._clusters);

          sampleCostCalculation(san);
        });


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



      }
    }
  });
