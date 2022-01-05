module.exports = {
  env: {
    browser: true,
    node: true, // for code in getStaticProps & get ServerSideProps
  },
  ignorePatterns: ['lib/**'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint/eslint-plugin', 'react-hooks', 'import'],
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
    'import/resolver': {
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
  root: true, // to stop looking in parent folders for .eslintrc.* files
  rules: {
    quotes: ['warn', 'single'],
    // 'operator-linebreak': ['warn', 'before'],
    semi: ['error', 'always'],
    'dot-notation': 'error', // require dod notation instead of object['property']
    eqeqeq: 'error', // require === in comparison instead of ==
    'guard-for-in': 'error', // require guards when looping over object keys which can be inherited
    'max-classes-per-file': ['error', 2],
    'no-bitwise': 'error',
    'no-console': 'error',
    'no-duplicate-imports': 'error',
    'no-else-return': 'error',
    'no-eval': 'error',
    'no-extra-bind': 'error',
    'no-implicit-coercion': 'error',
    'no-unsafe-negation': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-param-reassign': 'error',
    'no-return-await': 'error',
    'no-sequences': 'error',
    'no-template-curly-in-string': 'error',
    'no-throw-literal': 'error',
    'no-undef-init': 'error',
    'no-unneeded-ternary': 'error',
    'no-var': 'error',
    'one-var': ['warn', 'never'],
    'prefer-const': 'error',
    'prefer-object-spread': 'error',
    'spaced-comment': ['error', 'always'],
    yoda: 'error', // no yoda speaking in my team, we are dark side, we have cookies!

    // import plugin rules
    'import/first': 'error',
    'import/no-anonymous-default-export': ['error', { allowCallExpression: false }], // dissable annonymouse default exports
    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc' },
        'newlines-between': 'always',
        pathGroups: [{ pattern: '~/**', group: 'internal' }],
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
      },
    ],

    // react && react-hooks plugin rules
    'react/react-in-jsx-scope': 'off', // not needed as in next react is global
    'react/no-unknown-property': 'off',
    'react/jsx-curly-brace-presence': 'error',
    'react/prop-types': 'off',

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/array-type': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'], // to use only one way of defining types
    '@typescript-eslint/method-signature-style': ['error', 'property'], // use property type signature
    '@typescript-eslint/naming-convention': [
      'error',
      { selector: 'default', format: ['camelCase'] },
      { selector: 'memberLike', format: [], leadingUnderscore: 'allow' },
      { selector: 'variableLike', format: [], leadingUnderscore: 'allow' },
      { selector: 'typeLike', format: ['PascalCase'] },
    ],
    '@typescript-eslint/no-empty-interface': ['error', { allowSingleExtends: true }],
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/no-confusing-non-null-assertion': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true, varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-non-null-assertion': 'error',
  },
};
