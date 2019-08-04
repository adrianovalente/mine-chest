const game = require('./game-controller')
const snapshot = require('./infra/snapshot')
const http = require('./infra/http')

;(async function main () {
  if (process.argv[2]) {
    switch (process.argv[2]) {
      case 'start-http-server': return http.start()
        .then(() => console.log('Server is listening!'))
      case 'upload-snapshot': return snapshot.upload()
      case 'restore-snapshot': return snapshot.restore()
      case 'start-mine-server': return game.startServer()

      default: throw new Error(`Unknown command`)
    }
  } else {
    return http.start()
      .then(() => game.startServer())
  }
})()
