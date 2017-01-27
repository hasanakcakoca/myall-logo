var closeBtn = document.querySelector('.close');

closeBtn.addEventListener('click', function () {
  ipcRenderer.send('close');
});
