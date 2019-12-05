const path = require('path')

const BIN_DIRECTORY_NAME = 'bin'
const BIN_PATH = path.join(__dirname, '../..', BIN_DIRECTORY_NAME)
const RESOURCES_PATH = path.join(__dirname, '../../resources')

module.exports = {
  HTTP_PORT: process.env.HTTP_PORT || 8080,
  BIN_DIRECTORY_NAME,
  RESOURCES_PATH,
  BIN_PATH,
  SERVER_FILE_NAME: 'minecraft_server.jar',
  TMP_FILE_PATH: '/tmp/resources.zip',
  MINECRAFT_SERVER_URL: 'https://launcher.mojang.com/v1/objects/3dc3d84a581f14691199cf6831b71ed1296a9fdf/server.jar'
}
