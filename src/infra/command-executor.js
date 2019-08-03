const childProcess = require('child_process')

module.exports = execCommand

function execCommand (command) {
  console.log(command)
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (err, stdout, stderr) => {
      if (err) return reject(err)

      console.log(stdout)
      resolve(stdout)
    })
  })
}
