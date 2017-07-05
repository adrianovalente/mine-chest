const resourcesManager = require('./resources-manager')

switch (process.argv[2]) {
  case 'upload': resourcesManager.uploadResources().then(console.log); break
  case 'download': resourcesManager.setupResources().then(console.log); break
  
  default: throw new Error(`unknown command: ${process.argv[2]}`)
}

