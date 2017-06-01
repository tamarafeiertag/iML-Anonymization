'use strict';

angular.module('iMLApp.summary', [])

  .controller('SummaryCtrl', function ($q, $scope, SlidersService, ILService, ServerCom, DataSendService, appConstants) {

      $scope.weights = SlidersService.getWeightVectors();

      let NR_RESULTS = undefined;
      let current_results = 0;


      $q.all([ILService.getCSVStringWithFinalWeightsPromise(appConstants.WEIGHT_VECTOR_USER),
        ILService.getCSVStringWithFinalWeightsPromise(appConstants.WEIGHT_VECTOR_IML)]).then(function (csvs) {
        console.log("Both promises returned", csvs);
        DataSendService.sendAnonymizationData(csvs[0], csvs[1]);
      });

      ServerCom.on('computationStarted', (data) => {
          console.log("Computation started signal received.");

          NR_RESULTS = data.nr_intermediary_results;
          console.log('Expecting ${NR_RESULTS} intermediary results.');

      });


      ServerCom.on('intermediaryComputed', (data) => {
          // console.log(data.result);
          let progress_width = ++current_results / NR_RESULTS;
          console.log('New progress bar width: ${progress_width}');
          //document.querySelector("#progress-bar-inner").style.width = '${progress_width*100}%';

          //let report_string = '<h3> Intermediate result from ${data.result.algorithm} (F1 Score): ${data.result.f1} </h3>';
          //document.querySelector("#progress-update").innerHTML = report_string;
      });


      ServerCom.on('computationCompleted', (data) => {
          console.log("SUCCESS result from server:");
          console.log(data);

          //document.querySelector("#results_json").innerHTML = JSON.stringify(result_obj, undefined, 2);
          document.querySelector("#imgAlgo1").innerHTML = '<img src="' + data.plotURL + '" alt="algorithm img" />';
          //document.querySelector("#progress-bar-outer").style = "display: none;";
          //document.querySelector("#progress-update").style = "display: none;";
      });

    }
  );
