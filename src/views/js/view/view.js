'use strict'

;(async () => {
  let markdownIt = require('markdown-it')
  let markdownit = markdownIt()

  let torrent = window.tr.get(window.selectedArticle)
  let article = torrent.files.find((file) => {
    return file.name.endsWith('article.json')
  })
  let images = function () {
    let files = []
    torrent.files.forEach((file) => {
      let imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp']
      for (const item of imageExtensions) {
        if (file.name.endsWith(item)) {
          file.mimetype = 'image/' + item.slice(1)
          files.push(file)
        }
      }
    })
    return files
  }
  let videos = function () {
    let files = []
    torrent.files.forEach((file) => {
      let videoExtensions = ['.mp4', '.webm', '.ogv', '.ogg']
      for (const item of videoExtensions) {
        if (file.name.endsWith(item)) {
          if (item === '.ogg') {
            file.mimetype = 'application/' + item.slice(1)
          } else file.mimetype = 'video/' + item.slice(1)
          files.push(file)
        }
      }
    })
    return files
  }
  let foundAttachments = images().concat(videos())
  if (article) {
    article.getBuffer((err, buffer) => {
      if (err) return console.error(err)
      let articleFile = JSON.parse(buffer.toString())
      let articleHTML = markdownit.render(articleFile.content)
      for (let i = 0; i < foundAttachments.length; i++) {
        let regex = new RegExp('Attachment:' + i, 'g')
        articleHTML = articleHTML.replace(regex, '" data-attachment="' + i)
      }
      // Preload document
      document.getElementById('articlecontent').innerHTML = articleHTML
      if (articleFile.attachments && articleFile.attachments.length > 0) {
        for (let i = 0; i < articleFile.attachments.length; i++) {
          let fileName = articleFile.attachments[i]
          for (let index = 0; index < foundAttachments.length; index++) {
            let element = foundAttachments[index]
            if (element.name === fileName) {
              if (element.mimetype.startsWith('image')) {
                element.getBlobURL((err, url) => {
                  if (err) return console.error(err)
                  document.querySelectorAll('[data-attachment="' + i + '"]').forEach(el => {
                    el.src = url
                  })
                })
              } else if (element.mimetype.startsWith('video') || element.mimetype.startsWith('application/ogg')) {
                element.getBlobURL((err, url) => {
                  if (err) return console.error(err)
                  document.querySelectorAll('[data-attachment="' + i + '"]').forEach(el => {
                    el.src = url
                  })
                })
              }
            }
          }
        }
      }
    })
  }
  console.log(foundAttachments)
})()
