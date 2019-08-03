const { yellow, bold } = require('kleur')
const childProcess = require('child_process')

const resourcesManager = require('./infra/resources-manager')
const {
  SERVER_FILE_NAME,
  BIN_PATH
} = require('./infra/config')

const GameStatus = {
  IDLE: 'idle',
  SETUP: 'setup',
  STARTING: 'starting',
  RUNNING: 'running',
  STOPPING: 'stopping'
}

var _status = GameStatus.IDLE; // eslint-disable-line

module.exports = {
  startServer,
  getStatus: () => _status
}

function startServer () {
  setStatus(GameStatus.SETUP)

  Promise.resolve()
    .then(() => resourcesManager.setupResources())
    .then(() => {
      console.log('Starting server...')
      setStatus(GameStatus.STARTING)
      const game = childProcess.spawn(
        'java',
        ['-Xmx1024M', '-Xms1024M', '-jar', `${BIN_PATH}/${SERVER_FILE_NAME}`, 'nogui'], {
          cwd: BIN_PATH, stdio: ['pipe', 'pipe', 'pipe']
        })

      game.stdout.on('data', onData)
      game.stderr.on('data', onData)
    })

    .catch(console.error)

  function onData (a) {
    const data = String(a)

    if (/Done.* For help, type/i.test(data)) {
      setStatus(GameStatus.RUNNING)
    }
    console.log('data:', String(data))
  }
}

function setStatus (status) {
  if (!Object.keys(GameStatus).filter((key) => GameStatus[key] === status).length) {
    throw new Error('Invalid status!')
  }

  _status = status
  console.log(yellow(bold(`STATUS CHANGED: ${status}`)))
}
