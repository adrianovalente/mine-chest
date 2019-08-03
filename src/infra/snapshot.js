const execCommand = require('./command-executor')
const path = require('path')
const { ignoredFiles, commitedFiles } = require('./ignored-files')

const {
  SERVER_FILE_NAME,
  BIN_PATH,
  TMP_FILE_PATH,
  MINECRAFT_SERVER_URL,
  RESOURCES_PATH
} = require('./config')

module.exports.upload = async function upload () {
  const filesToIgnore = await (ignoredFiles().then(r => r.map(f => path.join(BIN_PATH, f))))

  return execCommand(`rm -f ${TMP_FILE_PATH}`)
    .then(() => execCommand(`zip -r ${TMP_FILE_PATH} bin -x ${filesToIgnore.map(file => '"' + file + '"').join(' ')}`))
    .then(() => execCommand(`aws s3 cp ${TMP_FILE_PATH} s3://mine-assets/${new Date().getTime()}.zip`))
}

module.exports.restore = async function restore (date) {
  const filesToCopy = await (commitedFiles().then(r => r.map(f => path.join(RESOURCES_PATH, f))))

  return execCommand(`rm -rf ${BIN_PATH}`)
    .then(() => execCommand(`aws s3 ls --recursive s3://mine-assets`))
    .then((backups) => backups.split('\n').filter(Boolean).map((line) => line.split(' ')[line.split(' ').length - 1]))
    .then((backups) => {
      if (!date) return backups.sort()[backups.length - 1]

      const chosenBackup = backups.filter((backup) => backup.indexOf(date) > -1)
      if (!chosenBackup.length) throw new Error(`Did not find backup with timestamp ${date}`)

      return chosenBackup[0]
    })
    .then((backup) => execCommand(`aws s3 cp s3://mine-assets/${backup} ${TMP_FILE_PATH}`))
    .then(() => execCommand(`unzip ${TMP_FILE_PATH} -d ${process.cwd()}`))
    .then(() => execCommand(`curl ${MINECRAFT_SERVER_URL} > ${BIN_PATH}/${SERVER_FILE_NAME}`))
    .then(() => Promise.all(filesToCopy.map(file => execCommand(`cp ${file} ${BIN_PATH}`))))
}
