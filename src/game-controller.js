const childProcess = require('child_process')

const execCommand = require('./infra/command-executor')
const snapshot = require('./infra/snapshot')
const xnine = require('./infra/xnine')
const Status = require('./business/status')
const { GameStatus, setStatus } = Status
const {
  SERVER_FILE_NAME,
  BIN_PATH
} = require('./infra/config')

module.exports = {
  startServer,
  stopServer
}

let _game // eslint-ignore-line
const noop = () => {}

function gameChangeMessage (s) {
  if (s === GameStatus.STARTING) {
    return 'Servidor está ligando...'
  }

  if (s === GameStatus.RUNNING) {
    return 'Servidor rodando!'
  }
}

async function startServer ({ forceRestore } = {}) {
  Status.onChange(s => {
    const message = gameChangeMessage(s)

    if (s) {
      return xnine.reportMessage(message)
    }
  })

  await setStatus(GameStatus.SNAPSHOT_RESTORE)

  const thereIsAlreadyABackup = !!(await execCommand(`ls ${BIN_PATH}/${SERVER_FILE_NAME}`).catch(noop))
  const shouldRestoreBackup = forceRestore || !thereIsAlreadyABackup

  Promise.resolve()
    .then(shouldRestoreBackup ? () => snapshot.restore() : noop)
    .then(async () => {
      console.log('Starting server...')
      await setStatus(GameStatus.STARTING)
      _game = childProcess.spawn(
        'java',
        ['-Xmx1024M', '-Xms1024M', '-jar', `${BIN_PATH}/${SERVER_FILE_NAME}`, 'nogui'], {
          cwd: BIN_PATH, stdio: ['pipe', 'pipe', 'pipe']
        })

      _game.stdout.on('data', onData)
      _game.stderr.on('data', onData)
    })

    .catch(console.error)
}

async function stopServer () {
  if (!_game) {
    throw new Error('Server is not running!')
  }

  _game.kill('SIGINT')
  _game = undefined // Sorry for that 🌈
}

function onData (a) {
  const data = String(a)

  if (/joined the game/i.test(data)) {
    xnine.reportMessage(data)
  }

  if (/Done.* For help, type/i.test(data)) {
    setStatus(GameStatus.RUNNING)
  }

  if (/This crash report has been saved to/.test(data)) {
    setStatus(GameStatus.CRASHED)
    console.error('Game crashed, exiting in 2000 ms.')
    setTimeout(() => process.exit(1), 2000)
  }

  console.log('data:', String(data))
}
