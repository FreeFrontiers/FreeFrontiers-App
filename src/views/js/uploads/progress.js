'use strict'

;(async () => {
  let status = {
    uploadSpeed: true,
    uploaded: true
  }
  function updateUploadSpeed () {
    if (document.querySelectorAll('[data-uploadspeed]').length > 0 && status.uploadSpeed) {
      status.uploadSpeed = false
      document.querySelectorAll('[data-uploadspeed]').forEach(el => {
        el.innerText = window.tr.get(el.dataset.value).uploadSpeed + ' kB/s'
      })
      status.uploadSpeed = true
    }
  }
  function updateUploaded () {
    if (document.querySelectorAll('[data-uploaded]').length > 0 && status.uploaded) {
      status.uploaded = false
      document.querySelectorAll('[data-uploaded]').forEach(el => {
        let torrent = window.tr.get(el.dataset.value).uploaded
        el.innerText = 'Uploaded: ' + Number(torrent / 1048576).toFixed(2) + ' MB'
        el.setAttribute('title', torrent.toString() + ' KB')
      })
      status.uploaded = true
    }
  }
  updateUploadSpeed()
  updateUploaded()
  setInterval(() => updateUploadSpeed(), 1000)
  setInterval(() => updateUploaded(), 1000)
})()
