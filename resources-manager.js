const AWS = require('aws-sdk')
const childProcess = require('child_process')

const config = require('./config')

const s3 = new AWS.S3()

module.exports = {
  uploadResources,
  setupResources
}

function uploadResources() {

  return execCommand(`rm ${config.RESOURCES_PATH}/minecraft_server.1.12.jar`)
    .then(() => execCommand(`zip -r ${config.TMP_FILE_PATH} ${config.RESOURCES_DIRECTORY_NAME}`))
    .then(() => execCommand(`aws s3 cp ${config.TMP_FILE_PATH} s3://mine-assets/${new Date().getTime()}.zip`))

}

function setupResources(date) {
  return execCommand(`rm -rf ${config.RESOURCES_PATH}`)
    .then(() => execCommand(`aws s3 ls --recursive s3://mine-assets`))
    .then((backups) => backups.split('\n').filter(Boolean).map((line) => line.split(' ')[line.split(' ').length - 1]))
    .then((backups) => {
      if (!date) return backups.sort()[backups.length - 1]

      const chosenBackup = backups.filter((backup) => backup.indexOf(date) > -1)
      if (!chosenBackup.length) throw new Error(`Did not find backup with timestamp ${date}`)

      return chosenBackup[0]
    })
    .then((backup) => execCommand(`aws s3 cp s3://mine-assets/${backup} ${config.TMP_FILE_PATH}`))
    .then(() => execCommand(`unzip ${config.TMP_FILE_PATH} -d ${process.cwd()}`))
    .then(() => execCommand(`curl ${config.MINECRAFT_SERVER_URL} > ${config.RESOURCES_PATH}/minecraft_server.1.12.jar`))

}

function execCommand(command) {
  console.log(command)
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (err, stdout, stderr) => {
      if (!err && !stdout && stderr) err = new Error(stderr)
      if (err) return reject(err)

      console.log(stdout)
      resolve(stdout)
    })
  })
}
