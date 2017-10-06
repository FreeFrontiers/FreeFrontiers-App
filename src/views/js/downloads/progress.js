'use strict'

;(async () => {
  let status = {
    downloadSpeed: true,
    downloaded: true
  }
  function updateDownloadSpeed () {
    if (document.querySelectorAll('[data-downloadspeed]').length > 0 && status.downloadSpeed) {
      status.downloadSpeed = false
      document.querySelectorAll('[data-downloadspeed]').forEach(el => {
        el.innerText = window.tr.get(el.dataset.value).downloadSpeed.toFixed(2) + ' kB/s down / ' + window.tr.get(el.dataset.value).uploadSpeed.toFixed(2) + ' kB/s up'
      })
      document.querySelectorAll('[data-progress]').forEach(el => {
        el.value = window.tr.get(el.dataset.value).progress
      })
      status.downloadSpeed = true
    }
  }
  function updateDownloaded () {
    if (document.querySelectorAll('[data-downloaded]').length > 0 && status.downloaded) {
      status.downloaded = false
      document.querySelectorAll('[data-downloaded]').forEach(el => {
        let torrent = window.tr.get(el.dataset.value)
        el.innerText = Number(torrent.downloaded / 1048576).toFixed(2) + '/' + Number(torrent.length / 1048576).toFixed(2) + ' MB'
        el.setAttribute('title', torrent.downloaded.toString() + ' out of ' + torrent.length.toString() + ' KB')
      })
      status.downloaded = true
    }
  }
  updateDownloadSpeed()
  updateDownloaded()
  setInterval(() => updateDownloadSpeed(), 1000)
  setInterval(() => updateDownloaded(), 1000)
})()
