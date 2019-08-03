const execCommand = require('./command-executor')
const {
  RESOURCES_PATH,
  SERVER_FILE_NAME
} = require('./config')

const commitedFiles = () => execCommand(`ls ${RESOURCES_PATH}`)
  .then(r => r.split('\n'))
  .then(r => r.filter(Boolean))

const ignoredFiles = () => commitedFiles()
  .then(r => r.concat([SERVER_FILE_NAME, '.DS_Store']))

module.exports = {
  commitedFiles,
  ignoredFiles
}
