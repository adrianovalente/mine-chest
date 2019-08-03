// const gameController = require('./game-controller')
const snapshot = require('./infra/snapshot')

;(async function main () {
  switch (process.argv[2]) {
    case 'upload-snapshot': return snapshot.upload()
    case 'restore-snapshot': return snapshot.restore()

    default: throw new Error(`Unknown command`)
  }
  //  return gameController.startServer()
})()
