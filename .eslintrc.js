module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "@typescript-eslint/interface-name-prefix": 0,  // コーディングスタイルと合わない上に影響範囲が大きすぎるのでこのままで良い
    // すぐに直すもの
    "@typescript-eslint/camelcase": 0, // 一部の変数の命名を変えるだけ
    "@typescript-eslint/prefer-for-of": 0, // ごく一部のfor文を書き換えるだけ
    "@typescript-eslint/no-namespace": 0, // ごく一部のモジュールを書き換えるだけ
    "@typescript-eslint/no-unused-vars": 0, // ごく一部の変数を変えるだけ
    "@typescript-eslint/explicit-member-accessibility": 0, // 範囲は大きいけれど、間違えたらコンパイルが落ちてくれるはずなので安心
    "@typescript-eslint/no-use-before-define": 0, // 範囲は大きいけれど、関数の順番を変えるだけなので安全にできるはず
    // 徐々に直すもの
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
  }
}
