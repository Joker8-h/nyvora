module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  settings: {
    react: {
      version: '18',
    },
    tailwindcss: {
      config: 'tailwind.config.ts',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {
        project: ['packages/*/tsconfig.json', 'apps/*/tsconfig.json'],
      },
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', 'packages/*/tsconfig.json', 'apps/*/tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'tailwindcss'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:tailwindcss/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/require-await': 'warn',
    '@typescript-eslint/no-floating-promises': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        pathGroups: [
          { pattern: '@nyvora/**', group: 'internal' },
        ],
        pathGroupsExcludedImportTypes: ['internal'],
        alphabetize: { order: 'asc' },
      },
    ],
    'tailwindcss/no-custom-classname': 'warn',
 
  },
  ignorePatterns: ['**/*.config.*', '**/*.stories.*', 'dist/**', 'build/**', '.next/**', 'node_modules/**'],
}