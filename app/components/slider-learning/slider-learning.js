angular.module('iMLApp.slider-learning', [])
.controller('SLCtrl', function ($scope, SurveyService) {

    $scope.columns = SurveyService.GetVisibleColumnNames();
    $scope.target_column = SurveyService.GetCurrent().target_column;

    if($scope.columns !== undefined) {
        $scope.columnString = $scope.columns.join(",");
    }

})
.service('SLService', function($q, anonymizationConfig, algoConfig, SurveyService, ILService, SlidersService) {
    return {
        getCSVStringWithFinalWeightsPromiseDEP: function () {

            let basename = algoConfig.basename;
            let filename_originalData = algoConfig.originalData;

            let csvIn = new $A.IO.CSVIN($A.config.adults);
            //console.log("CSV Reader: ");
            //console.log(csvIn);

            let CSVFileURL = basename + "/" + filename_originalData;
            let output = basename + "/output";

            // get global config data of config.js
            let config = anonymizationConfig;
            let k = algoConfig.finalCSVStringKFactor;
            config.NR_DRAWS = algoConfig.nrOfDrawsMultiplier * k + 1;
            config.K_FACTOR = k;
            config.TARGET_COLUMN = SurveyService.GetCurrent().target_column;
            config.REMOTE_TARGET = SurveyService.GetCurrent().remote_target;
            config.GEN_WEIGHT_VECTORS["user"] = SlidersService.getUserWeightsObject();
            config.VECTOR = "user";

            console.log("config", config);
            let defer = $q.defer();
            //this returns a promise, as we call a return in then block

            ILService.createSan(config).then(function (san) {

                // Remotely read the original data and anonymize
                csvIn.readCSVFromURL(CSVFileURL, function (csv) {
                    san.instantiateGraph(csv, false);
                    san.anonymizeGraph();
                    let result_string = san.constructAnonymizedCSV();
                    console.log("returning csv of ILservice");
                    defer.resolve(result_string);
                });

            });

            return defer.promise;
        }
    };
});

