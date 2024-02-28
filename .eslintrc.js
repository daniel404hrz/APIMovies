module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:promise/recommended',
  ],
  extends: 'standard',
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module', // Importante para admitir la sintaxis de módulos
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
  }
}
