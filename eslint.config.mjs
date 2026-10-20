import neostandard from 'neostandard'

export default [
  ...neostandard({ env: ['browser'] }),
  { ignores: ['webapp/script.js', 'data/'] }
]
