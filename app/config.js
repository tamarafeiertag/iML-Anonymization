angular.module('iMLApp.config', [])

  .constant(
    'appConfig', {
      'APP_NAME': 'iML',
      'APP_VERSION': '1.0'
    })

  .constant(
    'anonymizationConfig', {
      'REMOTE_URL': 'http://berndmalle.com/anonymization/adults',
      'REMOTE_TARGET': 'education', //TODO: how to handle that?
      'INPUT_FILE': './assets/00_sample_data_UI_prototype/original_data_500_rows.csv',
      'TRIM': '\\s+',
      'TRIM_MOD': 'g',
      'SEPARATOR': ',',
      'SEP_MOD': '',
      'TARGET_COLUMN': 'education-num', //TODO: how to handle that?
      'AVERAGE_OUTPUT_RANGES': false,
      'NR_DRAWS': 300,
      'RANDOM_DRAWS': false,  //must be false if center should not be picked from data points that might be anonymized
      'EDGE_MIN': 3,
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