const fs = require('fs')
const path = require('path')

const RESOURCES_DIRECTORY_NAME = 'bin'
const RESOURCES_PATH = path.join(__dirname, '..', RESOURCES_DIRECTORY_NAME)

console.log({ RESOURCES_PATH })

module.exports = {
  RESOURCES_DIRECTORY_NAME,
  RESOURCES_PATH,
  SERVER_FILE_NAME: 'minecraft_server.jar',
  TMP_FILE_PATH : '/tmp/resources.zip',
  MINECRAFT_SERVER_URL : 'https://launcher.mojang.com/v1/objects/3dc3d84a581f14691199cf6831b71ed1296a9fdf/server.jar'
}
