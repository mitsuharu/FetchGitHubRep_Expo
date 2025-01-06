module.exports = {
  root: true,
  extends: ['expo', 'prettier'],
  plugins: [],
  parserOptions: {
    project: 'tsconfig.json',
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: 'tsconfig.json',
      },
    },
  },
  rules: {
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-require-imports': 'off',
  },
}
