module.exports = {
  root: true,
  extends: ['react-app', 'prettier'],
  plugins: ['import', 'react-hooks'],

  rules: {
    'react/jsx-key': ['error'],
    'react/jsx-handler-names': [
      'error',
      {
        eventHandlerPrefix: '_handle',
        eventHandlerPropPrefix: 'on',
        checkLocalVariables: true,
      },
    ],
    'react/jsx-no-duplicate-props': ['error'],
    'react/jsx-sort-props': [
      'error',
      {
        callbacksLast: true,
        reservedFirst: true,
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 0,
    'no-duplicate-imports': 'error',
    'no-console': 'warn',
    // 'sort-keys': 'error',
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true,
      },
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxEOF: 1,
      },
    ],
    'no-unused-vars': ['error'],

    'no-shadow': 'warn',
    'import/newline-after-import': ['error', { count: 1 }],
    'import/no-anonymous-default-export': 0,

    // 'import/prefer-default-export': 0,
    // 'import/no-extraneous-dependencies': 0,
  },
  // settings: {
  //   'import/resolver': {
  //     'eslint-import-resolver-custom-alias': {
  //       alias: {
  //         // '@src': './src/',
  //         '@assets': './src/assets',
  //         '@components': './src/components',
  //         '@constants': './src/constants',
  //         '@hooks': './src/hooks',
  //         '@containers': './src/containers',
  //         '@ducks': './src/ducks',
  //         '@services': './src/services',
  //         '@utils': './src/utils',
  //         '@storages': './src/storages',
  //         '@styles': './src/styles',
  //       },
  //       extensions: ['.js', '.tsx', '.svg'],
  //     },
  //   },
  // },
}
