angular.module('iMLApp.config', [])

  .constant(
    'appConfig', {
      'APP_NAME': 'iML',
      'APP_VERSION': '1.0'
    })

  .constant(
    'appConstants', {
      'GROUP_TOKEN': 'cafebabe',
      'WEIGHT_VECTOR_USER': 'user',
      'WEIGHT_VECTOR_IML': 'weights',
    })

  .constant(
    'algoConfig', {
      nrOfDrawsMultiplier: 10,  //nrOfDraws needs to be in relation to k in order to result in good random clusters
      originalData: "original_data_500_rows.csv",
      originalDataCSVLength: 501,
      basename: "assets/00_sample_data_UI_prototype",
      targets: [
        "target_education-num",
        "target_marital-status",
        "target_income"
      ],
      gen_base: 'assets/genHierarchies/',
      nrOfCases: 5,  //number of triples per k factor
      startKFactor: 2,
      maxKFactor: 7,
      finalCSVStringKFactor: 7,
      finalCSVNrDraws: 500
    }
  )

  .constant(
    'anonymizationConfig', {
      'REMOTE_URL': 'http://berndmalle.com/anonymization/adults',
      'REMOTE_TARGET': 'education',
      'INPUT_FILE': './assets/00_sample_data_UI_prototype/original_data_500_rows.csv',
      'TRIM': '\\s+',
      'TRIM_MOD': 'g',
      'SEPARATOR': ',',
      'SEP_MOD': '',
      'TARGET_COLUMN': 'education-num',
      'AVERAGE_OUTPUT_RANGES': false,
      'NR_DRAWS': 500,
      'RANDOM_DRAWS': false,  //must be false if center should not be picked from data points that might be anonymized
      'EDGE_MIN': 2,
      'EDGE_MAX': 10,
      'K_FACTOR': 2,
      'ALPHA': 1,
      'BETA': 0,
      'GEN_WEIGHT_VECTORS': {
        'equal_weights': {
          'categorical': {
            'workclass': 1/10.0,
            'native-country': 1/10.0,
            'sex': 1/10.0,
            'race': 1/10.0,
            'relationship': 1/10.0,
            'occupation': 1/10.0,
            'income': 1/10.0,
            'marital-status': 1/10.0
          },
          'range': {
            'age': 1/10.0,
            'hours-per-week': 1/10.0
          }
        }
      },
      'VECTOR': 'equal_weights'
    });