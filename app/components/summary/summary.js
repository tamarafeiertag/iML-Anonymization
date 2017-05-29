'use strict';

angular.module('iMLApp.summary', [])

  .controller('SummaryCtrl', function ($q, $scope, SlidersService, ILService, SLService, ServerCom, DataSendService, appConstants) {

      $scope.weights = SlidersService.getWeightVectors();

      let NR_RESULTS = undefined;
      let current_results = 0;


      $q.all([ILService.getCSVStringWithFinalWeightsPromise(appConstants.WEIGHT_VECTOR_USER),
        ILService.getCSVStringWithFinalWeightsPromise(appConstants.WEIGHT_VECTOR_IML)]).then((values) => {
        console.log("Both promises returned", values);
        DataSendService.sendAnonymizationData(values[0], values[1]);
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
          let result_obj = data.overall_results;
          console.log(result_obj);

          //document.querySelector("#results_json").innerHTML = JSON.stringify(result_obj, undefined, 2);
          document.querySelector("#imgAlgo1").innerHTML = '<img src="' + result_obj.plotURL + '" alt="algorithm img" />';
          //document.querySelector("#progress-bar-outer").style = "display: none;";
          //document.querySelector("#progress-update").style = "display: none;";
      });

    }
  );
