module.exports = {
  root: true,
  extends: [
    '@react-native',
    'airbnb-typescript',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:import/react-native',
    'plugin:react-native/all',
    'prettier',
  ],
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
