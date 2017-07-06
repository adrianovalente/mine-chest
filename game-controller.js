const GameStatus = {
  IDLE     : 'idle',
  SETUP    : 'setup',
  STARTING : 'starting',
  RUNNING  : 'running',
  STOPPING : 'stopping'
}

var _status = GameStatus.IDLE; // eslint-disable-line

module.exports = {
  getStatus = () => _status
}
