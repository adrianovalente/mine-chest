const childProcess = require('child_process')

module.exports = execCommand

function execCommand (command) {
  console.log(command)
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (err, stdout, stderr) => {
      console.log({
        err, stdout, stderr
      })
      //      if (!err && !stdout && stderr) err = new Error(stderr)
      if (err) return reject(err)

      console.log(stdout)
      resolve(stdout)
    })
  })
}
