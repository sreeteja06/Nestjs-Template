module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'error',
        '@typescript-eslint/no-explicit-any': 'warn',
        'no-await-in-loop': 'warn',
        'no-console': 'warn',
        'no-loss-of-precision': 'error',
        'no-promise-executor-return': 'error',
        'no-template-curly-in-string': 'warn',
        'no-unreachable-loop': 'warn',
        'no-unsafe-optional-chaining': 'error',
        'require-atomic-updates': 'error',
        'array-callback-return': 'error',
        'block-scoped-var': 'error',
        'class-methods-use-this': 'warn',
        complexity: 'warn',
        curly: 'warn',
        'default-case': 'warn',
        'default-case-last': 'warn',
        'dot-notation': 'warn',
        eqeqeq: 'error',
        'grouped-accessor-pairs': 'warn',
        'guard-for-in': 'error',
        'max-classes-per-file': 'warn',
        'no-constructor-return': 'warn',
        'no-div-regex': 'error',
        'no-empty-function': ['warn', { allow: ['constructors'] }],
        'no-eval': 'error',
        'no-extend-native': 'warn',
        'no-extra-label': 'warn',
        'no-floating-decimal': 'warn',
        'no-implicit-coercion': ['warn', { allow: ['!!'] }],
        'no-implied-eval': 'error',
        'no-iterator': 'warn',
        'no-labels': 'warn',
        'no-lone-blocks': 'warn',
        'no-loop-func': 'error',
        'no-magic-numbers': [
            'warn',
            { ignoreArrayIndexes: true, ignore: [-1, 1, 0] },
        ],
        'no-new': 'warn',
        'no-new-func': 'warn',
        'no-new-wrappers': 'warn',
        'no-return-assign': 'warn',
        'no-return-await': 'warn',
        'no-self-compare': 'warn',
        'no-sequences': 'warn',
        'no-throw-literal': 'warn',
        'no-unused-expressions': 'warn',
        'no-useless-concat': 'warn',
        'no-useless-return': 'warn',
        'prefer-promise-reject-errors': 'error',
        radix: 'error',
        'no-duplicate-imports': 'warn',
        'init-declarations': 'warn',
        '@typescript-eslint/no-shadow': 'error',
        'no-use-before-define': 'error',
        'no-confusing-arrow': 'warn',
        'no-useless-rename': 'warn',
        'no-var': 'error',
        'object-shorthand': 'warn',
        'prefer-spread': 'warn',
        'prefer-destructuring': 'warn',
        'prefer-template': 'warn',
        camelcase: 'warn',
        '@typescript-eslint/member-ordering': 'warn',
        '@typescript-eslint/no-dynamic-delete': 'warn',
        '@typescript-eslint/no-unsafe-argument': 'warn',
        '@typescript-eslint/prefer-readonly': 'warn',
        '@typescript-eslint/prefer-reduce-type-parameter': 'warn',
        '@typescript-eslint/prefer-return-this-type': 'warn',
        '@typescript-eslint/prefer-string-starts-ends-with': 'error',
        '@typescript-eslint/promise-function-async': 'warn',
        '@typescript-eslint/restrict-plus-operands': 'warn',
        quotes: ['error', 'single'],
        'max-len': [
            'error',
            {
                code: 120,
                tabWidth: 4,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
            },
        ],
    },
};