const childProcess = require('child_process')

const snapshot = require('./infra/snapshot')
const { GameStatus, setStatus } = require('./business/status')
const {
  SERVER_FILE_NAME,
  BIN_PATH
} = require('./infra/config')

module.exports = {
  startServer
}

async function startServer () {
  await setStatus(GameStatus.SNAPSHOT_RESTORE)

  Promise.resolve()
    .then(() => snapshot.restore())
    .then(async () => {
      console.log('Starting server...')
      await setStatus(GameStatus.STARTING)
      const game = childProcess.spawn(
        'java',
        ['-Xmx1024M', '-Xms1024M', '-jar', `${BIN_PATH}/${SERVER_FILE_NAME}`, 'nogui'], {
          cwd: BIN_PATH, stdio: ['pipe', 'pipe', 'pipe']
        })

      game.stdout.on('data', onData)
      game.stderr.on('data', onData)
    })

    .catch(console.error)
}

function onData (a) {
  const data = String(a)

  if (/Done.* For help, type/i.test(data)) {
    setStatus(GameStatus.RUNNING)
  }
  console.log('data:', String(data))
}
