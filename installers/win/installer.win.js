const path = require('path');
const {version} = require('../../package.json');
const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller;

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch(error => {
    console.error(error.message || error);
    process.exit(1);
  });

function getInstallerConfig () {
  console.log('Creating Windows installer...');

  const rootPath = path.join('./');
  const appDirectory = path.join(rootPath, 'dist', 'imlogo-win32-x64');
  const outputDirectory = path.join(rootPath, 'release', 'win32-x64');

  return Promise.resolve({
    appDirectory,
    outputDirectory,
    noMsi: true,
    setupExe: `imlogo-${version}-setup.exe`,
    setupIcon: path.join(rootPath, 'resources', 'win', 'icon.ico'),
    iconUrl: 'https://raw.githubusercontent.com/kemalersin/myall-logo/master/resources/win/icon.ico'
  });
}
