const {ipcRenderer} = require('electron');
const closeBtn = document.querySelector('.close');

closeBtn.addEventListener('click', function () {
  ipcRenderer.send('close-main-window');
});
