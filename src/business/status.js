const { yellow, bold } = require('kleur')
const GameStatus = {
  IDLE: 'idle',
  SETUP: 'setup',
  STARTING: 'starting',
  RUNNING: 'running',
  CRASHED: 'crashed',
  STOPPING: 'stopping',
  SNAPSHOT_RESTORE: 'restoring-snapshot',
  SNAPSHOT_UPLOAD: 'uploading-snapshot'
}

let _status = GameStatus.IDLE; // eslint-disable-line
let _handlers = [s => console.log(yellow(bold(`STATUS CHANGED: ${s}`)))]

module.exports.GameStatus = GameStatus
module.exports.onChange = handler => _handlers.push(handler)
module.exports.getStatus = () => _status
module.exports.setStatus = async function setState (status) {
  if (_status === status) return; // eslint-disable-line

  if (Object.values(GameStatus).indexOf(status) < 0) {
    throw new Error(`Invalid status ${status}, valid ones are: ${Object.values(GameStatus).join(', ')}`)
  }

  _handlers.forEach(f => f(status, _status))
  _status = status
}
