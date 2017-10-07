'use strict'

// This file is required by the index file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
;(async () => {
  console.time('DOMCONTENTLOADED')
  window.addEventListener('DOMContentLoaded', () => {
    console.timeEnd('DOMCONTENTLOADED')
    console.time('Done loading')
    let url = 'https://www.freefrontiers.net'
    console.time('snek')
    const snek = require('snekfetch')
    console.timeEnd('snek')
    console.time('Moment')
    const moment = require('moment')
    console.timeEnd('Moment')
    console.time('fs')
    const fs = require('fs')
    console.timeEnd('fs')
    console.time('path')
    const path = require('path')
    console.timeEnd('path')
    console.time('lf')
    const lf = require('./db.js').db
    console.timeEnd('lf')
    console.time('views')
    const views = require('./module/views.js')
    console.timeEnd('views')
    console.time('webtorrent')
    const Webtorrent = require('webtorrent')
    console.timeEnd('webtorrent')
    console.time('client')
    const client = new Webtorrent()
    console.timeEnd('client')
    window.tr = client
    console.time('settings db.js')
    const settings = require('./db.js').settings
    console.timeEnd('settings db.js')

    console.time('lf => articleuploads')
    lf.getItem('articleuploads').then(res => {
      if (res && res.length > 0) {
        res.forEach(obj => {
          try {
            let path = obj.torrentFilePath
            client.add(path)
          } catch (e) {
            console.error(e)
          }
        })
      }
    }).catch(e => console.error(e))
    console.timeEnd('lf => articleuploads')

    console.time('lf => articledownloads')
    lf.getItem('articledownloads').then(res => {
      if (res && res.length > 0) {
        res.forEach(obj => {
          /* if (obj.status === 'download') {
  
          } */
          try {
            let path = obj.torrentFilePath
            client.add(path)
          } catch (e) {
            console.error(e)
          }
        })
      }
    }).catch(e => console.error(e))
    console.timeEnd('lf => articledownloads')

    window.active = {
      content: '',
      contentContent: '',
      events: {}
    }
    let active = window.active

    document.querySelector('nav.navbar.is-dark.is-unselectable').classList.remove('is-hidden')
    document.querySelector('nav.navbar.is-dark.is-unselectable').classList.add('animated')
    document.querySelector('nav.navbar.is-dark.is-unselectable').classList.add('fadeInDown')

    let $topDiv = document.getElementById('top')
    let $contentDiv = document.getElementById('content')
    let $bottomDiv = document.getElementById('bottom')

    console.time("document.querySelectorAll('a.navbar-item[data-target]').forEach")
    document.querySelectorAll('a.navbar-item[data-target]').forEach(element => {
      // let $target = document.getElementById(element.dataset.target)
      // if ($target) {
      //   let mouseover = element.addEventListener('mouseover', (event) => {
      //     $target.classList.remove('is-hidden')
      //   })
      //   let mouseout = element.addEventListener('mouseout', (event) => {
      //     $target.classList.add('is-hidden')
      //   })
      //   active.events.push(mouseover, mouseout)
      // }
      element.addEventListener('click', (event) => {
        document.querySelectorAll('a.navbar-item[data-target]').forEach(element => {
          element.classList.remove('is-active')
        })
        element.classList.add('is-active')
        switchToView(element.dataset.target)
      })
      // active.events.push(click)
    })
    console.timeEnd("document.querySelectorAll('a.navbar-item[data-target]').forEach")

    function clickEvent ($evt) {
      if ($evt.currentTarget.classList.contains('toggle') && active.contentContent === 'articlenew') {
        let $target = document.getElementById($evt.currentTarget.dataset.target)
        document.querySelectorAll('.toggle[data-target]').forEach(element => {
          element.parentElement.classList.remove('is-active')
        })
        document.getElementById('editview').classList.add('is-hidden')
        document.getElementById('previewview').classList.add('is-hidden')
        $evt.currentTarget.parentElement.classList.add('is-active')
        $target.classList.toggle('is-hidden')
      } else if ($evt.currentTarget.tagName === 'BUTTON' && $evt.currentTarget.classList.contains('delete')) {
        let $target = document.getElementById($evt.currentTarget.dataset.target)
        $target.classList.toggle('is-hidden')
      } else if ($evt.currentTarget.parentElement.classList.contains('modal')) {
        let $target = document.getElementById($evt.currentTarget.dataset.target)
        $target.classList.toggle('is-active')
      } else {
        if ($evt.currentTarget.parentElement.tagName === 'LI') {
          document.querySelector('[data-target="' + active.contentContent + '"]').parentElement.classList.remove('is-active')
          $evt.currentTarget.parentElement.classList.add('is-active')
        }
        let $target = document.getElementById($evt.currentTarget.dataset.target)
        if ($target) { // Check if exists within document.
          $target.classList.toggle('is-hidden')
          $target.scrollIntoView()
        } else switchToView($evt.currentTarget.dataset.target, $evt.currentTarget.dataset.value || null)
      }
    }

    function reattachContentEventListeners () {
      document.querySelectorAll('[data-target]:not(.navbar-item)').forEach(element => {
        element.removeEventListener('click', clickEvent)
        element.addEventListener('click', clickEvent)
      })
    }

    function switchToView (selected = 'home', message = 'Error', force = false) {
      let enabledTheme = document.getElementById('darktheme') ? 'dark' : 'default'
      let divPromise = new Promise((resolve, reject) => {
        if (selected === active.content && !force) return resolve()
        if (selected === active.contentContent && !force) return resolve()
        if (selected.startsWith('article')) { // #Article
          if (selected.startsWith('articledrafts')) {
            switch (selected) {
              case 'articledraftsedit':
                document.querySelector('#contentcontent').innerHTML = '<div class="loader"></div>' // For loading
                lf.getItem('articledrafts').then(res => {
                  switchToView('articlenew', res[Number(message)])
                }).catch(e => reject(e))
                break
              case 'articledraftsremove':
                lf.getItem('articledrafts').then(res => {
                  res.splice(Number(message), 1)
                  // res = res.splice(Number(message))
                  lf.setItem('articledrafts', res).then(() => {
                    switchToView('articledrafts', null, true)
                  }).catch(e => reject(e))
                }).catch(e => reject(e))
                break
              default:
                // active.contentContent = 'articledownloads'
                document.querySelector('#contentcontent').innerHTML = '<div class="loader"></div>' // For loading
                lf.getItem('articledrafts').then(res => {
                  document.querySelector('#contentcontent').innerHTML = views.article.drafts({data: res})
                  date()
                  resolve()
                }).catch(e => reject(e))
                break
            }
          } else if (selected.startsWith('articleuploads')) {
            switch (selected) {
              case 'articleuploadsremove':
                // TODO
                document.querySelector('#contentcontent').innerHTML = '<div class="loader"></div>' // For loading
                lf.getItem('articleuploads').then(res => {
                  let torrent = res[Number(message)]
                  client.remove(torrent.hash, (err) => {
                    if (err) return reject(err)
                    res.splice(Number(message), 1)
                    lf.setItem('articleuploads', res).then(() => switchToView('articleuploads', null, true))
                  })
                }).catch(e => reject(e))
                break
              case 'articleuploadsedit':
                // TODO
                document.querySelector('#contentcontent').innerHTML = '<div class="loader"></div>' // For loading
                resolve()
                break
              default:
                active.contentContent = 'articleuploads'
                document.querySelector('#contentcontent').innerHTML = '<div class="loader"></div>' // For loading
                lf.getItem('articleuploads').then(res => {
                  document.querySelector('#contentcontent').innerHTML = views.article.uploads({data: res})
                  loadScripts(active.contentContent)
                  resolve()
                }).catch(e => reject(e))
                break
            }
          } else if (selected.startsWith('articledownloads')) {
            switch (selected) {
              case 'articledownloadsadd':
                // message is a magneturi
                if (typeof message === 'string') {
                  switchToView('popuparticle', 'Please wait...')
                  let downloadsDir = path.join(__dirname, '..', 'downloads')
                  if (!fs.existsSync(downloadsDir)) {
                    console.log('Initializing downloads directory.')
                    fs.mkdirSync(downloadsDir)
                  }
                  client.add(message, (torrent) => {
                    fs.writeFile(path.join(__dirname, '..', 'downloads', torrent.infoHash + '.torrent'), torrent.torrentFile, () => {
                      let metadata = torrent.files.find((file) => {
                        return file.name.endsWith('article.json')
                      })
                      if (metadata) {
                        metadata.getBuffer((err, buffer) => {
                          if (err) return console.error(err)
                          let articleFile = JSON.parse(buffer.toString())
                          let article = {
                            title: articleFile.title,
                            author: articleFile.author,
                            uri: message,
                            torrentFilePath: path.join(__dirname, '..', 'downloads', torrent.infoHash + '.torrent'),
                            size: torrent.length,
                            hash: torrent.infoHash,
                            downloaded: Date.now()
                          }
                          lf.getItem('articledownloads').then(res => {
                            res.push(article)
                            lf.setItem('articledownloads', res).then(() => {
                              removePopup()
                              switchToView('articledownloads', null, true)
                            }).catch(e => console.error(e))
                          }).catch(e => reject(e))
                        })
                      } else {
                        console.log('Torrent did not contain article.json. Removing...')
                        torrent.destroy((e) => {
                          if (e) return console.error(e)
                          console.error('Removed torrent.')
                        })
                      }
                    })
                  })
                }
                break
              case 'articledownloadsremove':
                // TODO
                document.querySelector('#contentcontent').innerHTML = '<div class="loader"></div>' // For loading
                lf.getItem('articledownloads').then(res => {
                  let torrent = res[Number(message)]
                  client.remove(torrent.hash, (err) => {
                    if (err) return reject(err)
                    res.splice(Number(message), 1)
                    lf.setItem('articleuploads', res).then(() => switchToView('articleuploads', null, true))
                  })
                }).catch(e => reject(e))
                break
              case 'articledownloadssettings':
                // TODO
                document.querySelector('#contentcontent').innerHTML = '<div class="loader"></div>' // For loading
                resolve()
                break
              default:
                active.contentContent = 'articledownloads'
                document.querySelector('#contentcontent').innerHTML = '<div class="loader"></div>' // For loading
                lf.getItem('articledownloads').then(res => {
                  document.querySelector('#contentcontent').innerHTML = views.article.library({data: res})
                  loadScripts(active.contentContent)
                  resolve()
                }).catch(e => reject(e))
                break
            }
          } else {
            switch (selected) {
              case 'articleview':
                active.content = ''
                active.contentContent = ''
                $contentDiv.innerHTML = '<div class="loader"></div>' // For loading
                /** GET ARTICLE ID / URL
                  * RETRIEVE ARTICLE FROM WEBSITE
                  * LOAD SCRIPTS
                  */
                let showArticle = (details) => {
                  let magnet
                  if (typeof details === 'object') magnet = decodeURIComponent(details.magnet).replace(/&amp;/g, '&')
                  else magnet = decodeURIComponent(details).replace(/&amp;/g, '&')
                  let viewArticle = (torrent) => {
                    window.selectedArticle = magnet
                    if (torrent) {
                      let metadata = torrent.files.find((file) => {
                        return file.name.endsWith('article.json')
                      })
                      if (metadata) {
                        metadata.getBuffer((err, buffer) => {
                          if (err) return console.error(err)
                          let articleFile = JSON.parse(buffer.toString())
                          $contentDiv.innerHTML = views.article.view({article: typeof details === 'object' ? details : articleFile})

                          torrent.on('warning', msg => onWarning(msg))
                          torrent.on('error', msg => onError(msg))
                          torrent.on('download', bytes => onDownload(bytes))
                          torrent.on('upload', bytes => onUpload(bytes))

                          console.log(message)
                          document.getElementById('commentbtn').addEventListener('click', () => {
                            if (document.getElementById('commentbtn').disabled) return
                            if (details && message.startsWith('https://www.freefrontiers.net')) {
                              switchToView('popuparticle', 'Verifying...', true)
                              lf.getItem('details').then(res => {
                                if (res.username) {
                                  let details = {
                                    comment: document.querySelector('[name="commentbody"]').value
                                  }
                                  if (details.comment.length < 2000 && details.comment.length > 6) {
                                    let commentsUrl = message.split('/')[message.split('/').length - 1].split('?')[0]
                                    console.log(commentsUrl)
                                    lf.getItem('cookie').then(cookie => {
                                      snek.post(url + '/comments/' + commentsUrl + '/app').set('Cookie', cookie).send(details).then(res => {
                                        let body = res.body
                                        console.log(body)
                                        if (body.status === '200') {
                                          removePopup()
                                          switchToView('articleview', message, true)
                                        }
                                      }).catch(e => {
                                        switchToView('popuparticle', 'Something went wrong. Check console. (F12)', true)
                                        console.error(e)
                                      })
                                    }).catch(e => {
                                      switchToView('popuparticle', 'Something went wrong. Check console. (F12)', true)
                                      console.error(e)
                                    })
                                  } else {
                                    switchToView('popuparticle', 'Comment limit is 7-1999 characters.', true)
                                  }
                                }
                              }).catch(e => {
                                switchToView('popuparticle', 'Something went wrong. Check console. (F12)', true)
                                console.error(e)
                              })
                            } else {
                              switchToView('popuparticle', 'It seems you have accessed the article through offline mode. Comments cannot be reached at this stage of the app time otherwise check console (F12) for errors.', true)
                            }
                          })
                          loadScripts('articleview')
                          date()
                          resolve()
                        })
                      }
                    }
                  }
                  function onWarning (msg) {
                    console.warn(msg)
                  }
                  function onError (msg) {
                    console.error(msg)
                  }
                  function onDownload (bytes) {
                    console.log('Download', bytes)
                    document.getElementById('progress').innerText = 'Progress ' + Number(active.events.torrent.progress * 100).toFixed(2) + '%'
                    document.getElementById('downloaded').innerText = 'Downloaded ' + Number(active.events.torrent.downloaded / 1048576).toFixed(2) + ' MB (' + bytes + ' KB/s)'
                  }
                  function onUpload (bytes) {
                    console.log('Upload', bytes)
                    document.getElementById('uploaded').innerText = 'Uploaded ' + Number(active.events.torrent.downloaded / 1048576).toFixed(2) + ' MB (' + bytes + ' KB/s)'
                  }
                  let lookForTorrent = active.events.torrent
                  if (lookForTorrent) {
                    let found
                    lf.getItem('articledownloads').then(res => {
                      if (res) {
                        res.forEach(el => {
                          if (el.hash === lookForTorrent.infoHash) found = true
                        })
                      }
                      lf.getItem('articleuploads').then(res => {
                        if (res) {
                          res.forEach(el => {
                            if (el.hash === lookForTorrent.infoHash) found = true
                          })
                        }
                        if (found) {
                          lookForTorrent.removeListener('warning', onWarning)
                          lookForTorrent.removeListener('error', onWarning)
                          lookForTorrent.removeListener('download', onWarning)
                          lookForTorrent.removeListener('upload', onWarning)
                        }
                        if (!found) {
                          lookForTorrent.removeAllListeners()
                        }
                        console.log(found)
                      }).catch(e => reject(e))
                    }).catch(e => reject(e))
                  }
                  let tempTorr = client.add(magnet, (torrent) => {
                    viewArticle(torrent)
                  }).on('error', (e) => {
                    if (e.message.startsWith('Cannot add duplicate torrent')) {
                      let torrent = client.get(tempTorr.infoHash)
                      viewArticle(torrent)
                    } else {
                      console.log(e, message)
                    }
                  }).once('noPeers', (msg) => {
                    client.remove(magnet, () => {
                      switchToView('popuparticle', 'Unable to find any peers. Article uploader must be offline or nobody is seeding.', true)
                    })
                  })
                  active.events.torrent = tempTorr
                }
                if (message.startsWith('https://www.freefrontiers.net/')) {
                  let dank = message.split('/')[message.split('/').length - 1].split('?')[0]
                  snek.get(url + '/article/' + dank + '?json').then(res => {
                    let details = res.body
                    if (details) {
                      showArticle(details.article)
                    }
                  }).catch(e => reject(e))
                } else {
                  let article
                  if (typeof message === 'string') message = decodeURIComponent(message).replace(/&amp;/g, '&')
                  else if (typeof message === 'object') {
                    article = {
                      magnetURI: decodeURIComponent(message.magnet).replace(/&amp;/g, '&'),
                      url: message.url,
                      author: message.author,
                      description: message.description,
                      title: message.title
                    }
                    message = decodeURIComponent(message.magnet).replace(/&amp;/g, '&')
                  }
                  article ? showArticle(article) : showArticle(message)
                }
                break
              case 'articlenew':
                lf.getItem('details').then(account => {
                  if (!account) return switchToView('popuparticle', 'Please login to write an article.')
                  active.contentContent = 'articlenew'
                  $contentDiv.innerHTML = views.article.editor({theme: enabledTheme, data: message || null})
                  loadScripts(active.contentContent)
                  function files () {
                    let array = []
                    let names = []
                    let filesToDraft = []
                    document.querySelectorAll('[data-file]').forEach((el) => {
                      array.push(el.dataset.path)
                      names.push(el.dataset.file)
                      filesToDraft.push({name: el.dataset.file, path: el.dataset.path, type: el.dataset.type})
                    })
                    return {path: array, names: names, draft: filesToDraft}
                  }
                  document.getElementById('reset').addEventListener('click', ($evt) => {
                    document.forms['articlenew'].elements['title'].value = ''
                    document.forms['articlenew'].elements['description'].value = ''
                    document.forms['articlenew'].elements['tags'].value = ''
                    document.forms['articlenew'].elements['content'].value = ''
                    document.querySelectorAll('[data-file]').forEach(el => {
                      el.outerHTML = ''
                    })
                    document.querySelectorAll('#preview .column.is-narrow').forEach(el => {
                      el.outerHTML = ''
                    })
                  })
                  document.getElementById('draft').addEventListener('click', ($evt) => {
                    let article = {
                      title: document.forms['articlenew'].elements['title'].value,
                      description: document.forms['articlenew'].elements['description'].value,
                      tags: document.forms['articlenew'].elements['tags'].value,
                      content: document.forms['articlenew'].elements['content'].value,
                      attachments: document.querySelectorAll('[data-file]').length > 0 ? files() : null
                    }
                    let errorMsg = ``
                    if (article.title.length <= 0) {
                      errorMsg += `<p>Please provide a title for the draft.</p>`
                    }
                    if (errorMsg.length > 1) {
                      switchToView('popuparticle', {title: 'Error', body: errorMsg})
                    } else {
                      switchToView('popuparticle', 'Drafting...')
                      lf.getItem('articledrafts').then(res => {
                        res.push({
                          title: article.title,
                          description: article.description,
                          tags: article.tags,
                          content: article.content,
                          attachments: files().draft,
                          created: Date.now()
                        })
                        lf.setItem('articledrafts', res).then(() => {
                          removePopup()
                          switchToView('article', null, true)
                        }).catch(e => {
                          switchToView('popuparticle', 'Error! Check console. (F12)')
                          console.error(e)
                        })
                      }).catch(e => {
                        switchToView('popuparticle', 'Error! Check console. (F12)')
                        console.error(e)
                      })
                    }
                  })
                  document.getElementById('publish').addEventListener('click', ($evt) => {
                    let article = {
                      title: document.forms['articlenew'].elements['title'].value,
                      description: document.forms['articlenew'].elements['description'].value,
                      tags: document.forms['articlenew'].elements['tags'].value,
                      content: document.forms['articlenew'].elements['content'].value,
                      attachments: document.querySelectorAll('[data-file]').length > 0 ? files() : null
                    }
                    let articleVerifiers = {
                      title: article.title.length > 6 && article.title.length < 32,
                      description: article.description.length > 0 && article.description.length < 280,
                      content: article.content.length > 50,
                      tags: article.tags.split(',').length > 2 && article.tags.split(',').length < 12
                    }
                    let errorMsg = ``
                    if (!articleVerifiers.title) {
                      errorMsg += `<p>Title must be over 6 characters and below 32 characters</p>`
                    }
                    if (!articleVerifiers.description) {
                      errorMsg += `<p>Make sure you have a description below 280 characters.</p>`
                    }
                    if (!articleVerifiers.content) {
                      errorMsg += `<p>Content must be over 50 characters.</p>`
                    }
                    if (!articleVerifiers.tags) {
                      errorMsg += `<p>You must have a minimum of 3 tags, with a comma as a delimiter, and max 12 tags.</p>`
                    }
                    if (errorMsg.length > 1) {
                      switchToView('popuparticle', {title: 'Error', body: errorMsg})
                    } else {
                      switchToView('popuparticle', 'Creating torrent...')
                      let articleDirName = Date.now().toString()
                      let uploadsDir = path.join(__dirname, '..', 'uploads')
                      let articleDir = path.join(__dirname, '..', 'uploads', articleDirName)
                      let articleFilePath = path.join(__dirname, '..', 'uploads', articleDirName, 'article.json')
                      let metadataFile = path.join(__dirname, '..', 'uploads', articleDirName, 'metadata.nfo')
                      if (!fs.existsSync(uploadsDir)) {
                        console.log('Initializing uploads directory.')
                        fs.mkdirSync(uploadsDir)
                      }
                      fs.mkdirSync(articleDir)
                      let articleFile = {
                        content: article.content,
                        description: article.description,
                        title: article.title,
                        attachments: files().names,
                        author: account.username,
                        created: Date.now()
                      }
                      fs.writeFile(articleFilePath, JSON.stringify(articleFile, null, 2), (e) => {
                        if (e) return console.error(e)
                        fs.writeFile(metadataFile, `FreeFrontiers Article\n\nTitle: ${article.title}\nDescription: ${article.description}\nAttachments: ${article.attachments ? article.attachments.length : 'none'}\nAuthor: ${account.username}\nCreated: ${Date(articleFile.created)}`, (e) => {
                          if (e) return console.error(e)
                          let files = []
                          if (article.attachments) files.push(article.attachments.path)
                          files.push(articleFilePath, metadataFile)
                          client.seed(files, {name: articleDirName}, (torrent) => {
                            fs.writeFile(path.join(__dirname, '..', 'uploads', torrent.infoHash + '.torrent'), torrent.torrentFile, () => {
                              lf.getItem('cookie').then(cookie => {
                                switchToView('popuparticle', 'Contacting server...')
                                snek.post(url + '/article/new').set('Cookie', cookie).send({
                                  title: articleFile.title,
                                  description: articleFile.description,
                                  tags: article.tags,
                                  uri: decodeURIComponent(torrent.magnetURI).replace(/&amp;/g, '&'),
                                  hash: torrent.infoHash,
                                  size: torrent.length,
                                  content: article.content,
                                  attachments: article.attachments.names
                                }).then(res => {
                                  console.log(res.body)
                                  if (res.body.status === '200' && !res.body.error) {
                                    let uploadedArticle = {
                                      title: article.title,
                                      created: Number(articleDirName),
                                      torrentPath: torrent.path,
                                      size: torrent.length,
                                      hash: torrent.infoHash,
                                      torrentFilePath: path.join(__dirname, '..', 'uploads', torrent.infoHash + '.torrent'),
                                      uri: decodeURIComponent(torrent.magnetURI).replace(/&amp;/g, '&'),
                                      url: res.body.url
                                    }
                                    lf.getItem('articleuploads').then(res => {
                                      res.push(uploadedArticle)
                                      lf.setItem('articleuploads', res).then(() => {
                                        removePopup()
                                        switchToView('article', null, true)
                                      }).catch(e => console.error(e))
                                    }).catch(e => console.error(e))
                                  } else {
                                    client.remove(torrent.hash, (err) => {
                                      if (err) {
                                        console.error(err)
                                        switchToView('popuparticle', {title: 'Error', body: err})
                                      }
                                      switchToView('popuparticle', {title: 'Error', body: res.body.error})
                                    })
                                  }
                                  // RES SHOULD BE BODY.URL(string) AND/OR BODY.STATUS(number)
                                }).catch(e => {
                                  console.error(e)
                                  switchToView('popuparticle', 'Something went wrong. Check console. (F12)')
                                })
                              }).catch(e => console.error(e))
                            })
                          })
                        })
                      })
                    }
                  })
                  resolve()
                }).catch(e => console.error(e))
                break
              default:
                active.content = 'article'
                active.contentContent = ''
                $contentDiv.innerHTML = views.article.index(/* Locals */)
                switchToView('articleuploads')
                resolve()
                break
            }
          }
        } else if (selected.startsWith('video')) { // Video
          switch (selected) {
            default:
              active.content = 'video'
              active.contentContent = ''
              $contentDiv.innerHTML = views.video.index(/* Locals */)
              resolve()
              break
          }
        } else if (selected.startsWith('setting')) { // Setting
          switch (selected) {
            case 'settingregister':
              active.content = 'settingregister'
              active.contentContent = ''
              $contentDiv.innerHTML = views.setting.register(/* Locals */)
              document.getElementById('registeranonymous').addEventListener('click', ($evt) => {
                switchToView('popuparticle', 'Registering anonymously & logging you in...')
                snek.post(url + '/register/app').send({type: 0}).then(res => {
                  console.log(res)
                  let details = res.body
                  if (details.status === '200') {
                    console.log(details)
                    let cookie = res.headers['set-cookie']
                    let cookiePromise = cookie ? lf.setItem('cookie', cookie[0]) : null
                    let detailsPromise = lf.setItem('details', {username: details.id})
                    Promise.all([cookiePromise, detailsPromise]).then(values => {
                      removePopup()
                      switchToView('setting', null, true)
                      console.log(values)
                    }).catch(e => {
                      removePopup()
                      console.error('Something went wrong.', e)
                      document.getElementById('errormessage').innerText = e
                      document.getElementById('error').classList.remove('is-hidden')
                    })
                  } else {
                    removePopup()
                    console.error('Something went wrong.', details)
                    document.getElementById('errormessage').innerText = details.error
                    document.getElementById('error').classList.remove('is-hidden')
                  }
                }).catch(e => {
                  removePopup()
                  console.error('Something went wrong.', e)
                  document.getElementById('errormessage').innerText = e
                  document.getElementById('error').classList.remove('is-hidden')
                })
              })
              document.forms['register'].elements['username'].addEventListener('keyup', ($evt) => {
                $evt.srcElement.value = $evt.srcElement.value.toLowerCase()
              })
              document.getElementById('submit').addEventListener('click', ($evt) => {
                let registerDetails = {
                  name: document.forms['register'].elements['fullname'].value,
                  username: document.forms['register'].elements['username'].value,
                  password: document.forms['register'].elements['password'].value,
                  confirmPassword: document.forms['register'].elements['confirmPassword'].value,
                  email: document.forms['register'].elements['email'].value,
                  type: 1
                }
                let registerVerifiers = {
                  name: registerDetails.name.length > 0,
                  username: /^[\w]{1,32}$/.test(registerDetails.username),
                  password: registerDetails.password.length > 0,
                  confirmPassword: registerDetails.confirmPassword === registerDetails.password,
                  email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(registerDetails.email)
                }
                let errorMsg = ``
                if (!registerVerifiers.name) {
                  errorMsg += `<p>Please enter a name.</p>`
                }
                if (!registerVerifiers.username) {
                  errorMsg += `<p>Please enter a lowercase username below, and/or, 32 characters with no special characters or back spaces.</p>`
                }
                if (!registerVerifiers.password) {
                  errorMsg += `<p>Please enter a password.</p>`
                }
                if (!registerVerifiers.confirmPassword) {
                  errorMsg += `<p>Passwords entered didn't match.</p>`
                }
                if (!registerVerifiers.email) {
                  errorMsg += `<p>That email is not an RFC 5322 official standard email.</p>`
                }
                if (errorMsg.length > 1) {
                  switchToView('popuparticle', {title: 'Error', body: errorMsg})
                } else {
                  switchToView('popuparticle', 'Registering...')
                  snek.post(url + '/register/app').send(registerDetails).then(res => {
                    let data = res.body
                    if (data.status === '200') {
                      switchToView('popuparticle', {title: data.message, body: 'Please verify your email and login.'})
                      switchToView('setting', null, true)
                    } else {
                      removePopup()
                      console.error('Something went wrong.', data)
                      document.getElementById('errormessage').innerText = data.error
                      document.getElementById('error').classList.remove('is-hidden')
                    }
                  }).catch(e => {
                    removePopup()
                    console.error('Something went wrong.', e)
                    document.getElementById('errormessage').innerText = e
                    document.getElementById('error').classList.remove('is-hidden')
                  })
                }
              })
              resolve()
              break
            case 'settingaccount':
              active.contentContent = 'settingaccount'
              document.querySelector('#contentcontent').innerHTML = '<div class="loader"></div>' // For loading
              lf.getItem('details').then(res => {
                document.querySelector('#contentcontent').innerHTML = views.setting.account({details: res})
                if (res.name) {
                  document.getElementById('submit').addEventListener('click', ($evt) => {
                    switchToView('popuparticle', 'This has yet to be implemented.')
                    let details = {
                      name: document.forms['account'].elements['name'].value,
                      email: document.forms['account'].elements['email'].value,
                      password: document.forms['account'].elements['password'].value
                    }
                    // removePopup()
                    console.log(details)
                    // Send new data to server.
                  })
                }
                document.getElementById('logout').addEventListener('click', ($evt) => {
                  switchToView('popuparticle', 'Logging out...')
                  let removeCookie = lf.removeItem('cookie')
                  let removeDetails = lf.removeItem('details')
                  Promise.all([removeCookie, removeDetails]).then((results) => {
                    removePopup()
                    switchToView('setting', null, true)
                  }).catch(e => {
                    removePopup()
                    console.error(e)
                    document.getElementById('errormessage').innerText = e
                    document.getElementById('error').classList.remove('is-hidden')
                  })
                })
                resolve()
              }).catch(e => reject(e))
              break
            case 'settingapplication':
              active.contentContent = 'settingapplication'
              document.querySelector('#contentcontent').innerHTML = '<div class="loader"></div>' // For loading
              lf.getItem('settings').then(res => {
                document.querySelector('#contentcontent').innerHTML = views.setting.application({settings: res})
                document.getElementById('save').addEventListener('click', ($evt) => {
                  switchToView('popuparticle', 'Saving...', true)
                  let details = {
                    theme: document.forms['application'].elements['theme'] ? document.forms['application'].elements['theme'].selectedIndex : settings.defaultSettings.theme,
                    uploadbandwidth: document.forms['application'].elements['uploadbandwidth'] ? document.forms['application'].elements['uploadbandwidth'].value : settings.defaultSettings.uploadbandwidth,
                    downloadbandwidth: document.forms['application'].elements['downloadbandwidth'] ? document.forms['application'].elements['downloadbandwidth'].value : settings.defaultSettings.downloadbandwidth,
                    seedarticle: document.forms['application'].elements['seedarticle'] ? document.forms['application'].elements['seedarticle'].checked : settings.defaultSettings.seedarticle,
                    downloadarticle: document.forms['application'].elements['downloadarticle'] ? document.forms['application'].elements['downloadarticle'].checked : settings.defaultSettings.downloadarticle,
                    backgroundmining: document.forms['application'].elements['backgroundmining'] ? document.forms['application'].elements['backgroundmining'].checked : settings.defaultSettings.backgroundmining,
                    cpuusage: document.forms['application'].elements['cpuusage'] ? document.forms['application'].elements['cpuusage'].selectedIndex : settings.defaultSettings.cpuusage
                  }
                  lf.setItem('settings', details).then(() => {
                    removePopup()
                    switchToView('settingapplication', null, true)
                  }).catch(e => {
                    removePopup()
                    console.error('Something went wrong.', e)
                    document.getElementById('errormessage').innerText = e
                    document.getElementById('error').classList.remove('is-hidden')
                  })
                })
                document.getElementById('reset').addEventListener('click', ($evt) => {
                  switchToView('popuparticle', 'Resetting...', true)
                  lf.setItem('settings', settings.defaultSettings).then(() => {
                    removePopup()
                    switchToView('settingapplication', null, true)
                  }).catch(e => {
                    removePopup()
                    console.error('Something went wrong.', e, true)
                    document.getElementById('errormessage').innerText = e
                    document.getElementById('error').classList.remove('is-hidden')
                  })
                })
                resolve()
              }).catch(e => reject(e))
              break
            default:
              active.content = 'setting'
              active.contentContent = ''
              let locals
              $contentDiv.innerHTML = '<div class="loader"></div>' // For loading          
              lf.getItem('details').then(res => {
                if (res) {
                  locals = { user: res, loggedIn: true }
                } else {
                  locals = { loggedIn: false }
                }
                $contentDiv.innerHTML = views.setting.index(locals)
                if (!locals.loggedIn) {
                  document.getElementById('login').addEventListener('click', ($evt) => {
                    let details = {
                      username: document.getElementById('username').value,
                      password: document.getElementById('password').value,
                      rememberme: document.getElementById('rememberme').value
                    }
                    if (details.username.length > 0 && details.password.length > 0) {
                      snek.post(url + '/login/app').send(details).then(res => {
                        let data = res.body
                        console.log(res)
                        if (data.status === '200') {
                          let cookie = res.headers['set-cookie']
                          let details = res.body.details
                          let cookiePromise = lf.setItem('cookie', cookie[0])
                          let detailsPromise = lf.setItem('details', details)
                          Promise.all([cookiePromise, detailsPromise]).then(values => {
                            switchToView('setting', null, true)
                            console.log(values)
                          }).catch(e => {
                            console.error('Something went wrong.', e)
                            document.getElementById('errormessage').innerText = e
                            document.getElementById('error').classList.remove('is-hidden')
                          })
                        } else {
                          console.error('Something went wrong.', data)
                          document.getElementById('errormessage').innerText = (data.message
                            ? data.message
                            : data.error) + '\nStatus code: ' + data.status
                          document.getElementById('error').classList.remove('is-hidden')
                        }
                      })
                    } else {
                      document.getElementById('errormessage').innerText = 'Both fields are required.'
                      document.getElementById('error').classList.remove('is-hidden')
                    }
                  })
                  resolve()
                } else {
                  switchToView('settingaccount')
                  resolve()
                }
              }).catch(e => {
                $contentDiv.innerHTML = views.error({error: e})
              })
              break
          }
        } else if (selected.startsWith('popup')) {
          if (selected.startsWith('popuparticle')) {
            switch (selected) {
              case 'popuparticleshare':
                message = decodeURIComponent(message).replace(/&amp;/g, '&')
                $bottomDiv.innerHTML = views.modal({message: message})
                resolve()
                break
              case 'popuparticleadd':
                $bottomDiv.innerHTML = views.modal({message: {title: 'Download via magnet', body: '<input id="popupuri" class="input" type="text" placeholder="magnet:">', action: 'Add'}})
                document.getElementById('modalfunction').addEventListener('click', ($evt) => {
                  let uri = document.getElementById('popupuri').value
                  switchToView('articledownloadsadd', uri, true)
                })
                resolve()
                break
              default:
                $bottomDiv.innerHTML = views.modal({message: message})
                resolve()
                break
            }
          }
        } else { // Home
          switch (selected) {
            case 'homeraw':
              active.contentContent = 'homeraw'
              document.querySelector('#contentcontent').innerHTML = '<div class="loader"></div>'
              snek.get(url + '/feed/raw/search').then(res => {
                let data = res.body
                console.log(data)
                if (active.contentContent === 'homeraw') {
                  document.querySelector('#contentcontent').innerHTML = views.home.raw({data: data.results})
                  date()
                  resolve()
                }
              }).catch(e => {
                console.error(e)
                document.querySelector('#contentcontent').innerHTML = views.home.raw({data: []})
                resolve()
              })
              break
            // case 'homecommunity':
            //   active.contentContent = 'homecommunity'
            //   document.querySelector('#contentcontent').innerHTML = '<div class="loader"></div>'
            //   snek.get(url + '/feed/community/search').then(res => {
            //     let data = res.body
            //     if (active.contentContent === 'homecommunity') {
            //       document.querySelector('#contentcontent').innerHTML = views.home.community({data: data.results})
            //       resolve()
            //     }
            //   }).catch(e => {
            //     console.error(e)
            //     document.querySelector('#contentcontent').innerHTML = views.home.community({data: []})
            //     resolve()
            //   })
            //   break
            default:
              active.content = 'home'
              $contentDiv.innerHTML = views.home.index(/* Locals */)
              switchToView('homeraw')
              break
          }
        }
      })
      divPromise.then(() => {
        theme()
        reattachContentEventListeners()
        initFeathersIcon()
      }).catch(e => {
        console.error(e)
        $contentDiv.innerHTML = views.error({error: e})
      })
    }
    function removePopup () {
      $bottomDiv.innerHTML = ''
    }
    function loadScripts (selected) {
      if (selected === 'articlenew') {
        if (!document.getElementById('sLoadCodeMirror') && !document.getElementById('sCodeMirror') && !document.getElementById('sCodeMirrorMarkdown')) {
          setTimeout(() => {
            let sCodeMirror = document.createElement('script')
            sCodeMirror.src = './js/editor/codemirror.js'
            sCodeMirror.id = 'sCodeMirror'
            $contentDiv.appendChild(sCodeMirror)
            setTimeout(() => {
              let sCodeMirrorMarkdown = document.createElement('script')
              sCodeMirrorMarkdown.src = './js/editor/markdown.js'
              sCodeMirrorMarkdown.id = 'sCodeMirrorMarkdown'
              $contentDiv.appendChild(sCodeMirrorMarkdown)
              setTimeout(() => {
                let sLoadCodeMirror = document.createElement('script')
                sLoadCodeMirror.src = './js/editor/writeArticle.js'
                sLoadCodeMirror.id = 'sWriteArticle'
                $contentDiv.appendChild(sLoadCodeMirror)
              }, 100)
            }, 100)
          }, 100)
        }
      } else if (selected === 'articleuploads') {
        if (!document.getElementById('sLoadUploadProgressTracker')) {
          setTimeout(() => {
            let sLoadUploadProgressTracker = document.createElement('script')
            sLoadUploadProgressTracker.src = './js/uploads/progress.js'
            sLoadUploadProgressTracker.id = 'sLoadUploadProgressTracker'
            document.getElementById('contentcontent').appendChild(sLoadUploadProgressTracker)
          }, 100)
        }
      } else if (selected === 'articledownloads') {
        if (!document.getElementById('sLoadDownloadProgressTracker')) {
          setTimeout(() => {
            let sLoadDownloadProgressTracker = document.createElement('script')
            sLoadDownloadProgressTracker.src = './js/downloads/progress.js'
            sLoadDownloadProgressTracker.id = 'sLoadDownloadProgressTracker'
            document.getElementById('contentcontent').appendChild(sLoadDownloadProgressTracker)
          }, 100)
        }
      } else if (selected === 'articleview') {
        if (!document.getElementById('sLoadArticle')) {
          setTimeout(() => {
            let sLoadArticle = document.createElement('script')
            sLoadArticle.src = './js/view/view.js'
            sLoadArticle.id = 'sLoadArticle'
            $contentDiv.appendChild(sLoadArticle)
          }, 100)
        }
      }
    }

    function theme () {
      lf.getItem('settings').then(res => {
        if (res && res.theme === 1) {
          if (!document.getElementById('darktheme')) {
            let link = document.createElement('link')
            link.href = './css/betadark.css'
            link.rel = 'stylesheet'
            link.id = 'darktheme'
            $topDiv.appendChild(link)
          }
        } else if (document.getElementById('darktheme')) {
          $topDiv.removeChild(document.getElementById('darktheme'))
        }
      }).catch(e => {
        $contentDiv.innerHTML = views.error({error: e})
      })
    }

    function initFeathersIcon () {
      document.querySelectorAll('i[data-feather]').forEach(element => {
        if (window.feather) element.outerHTML = toSvg(element)
      })
    }

    function toSvg (element, options) {
      if (window.feather) {
        return window.feather.toSvg(options
          ? options.feather
          : element.dataset.feather, {
          width: options
            ? options.size || 24
            : element.dataset.size || 24,
          height: options
            ? options.size || 24
            : element.dataset.size || 24,
          viewBox: options
            ? options.viewBox || '0 0 24 24'
            : element.dataset.viewbox || '0 0 24 24'
        }
        )
      }
    }

    function date () {
      document.querySelectorAll('.date').forEach(element => {
        if (/^[0-9]+$/.test(element.innerText)) {
          element.innerText = ' ' + moment(Number(element.innerText)).fromNow()
        } else if (element.classList.contains('fromNow')) {
          element.innerText = ' ' + moment(element.innerText).fromNow()
        } else {
          element.innerText = moment(element.innerText).format('MMMM Do YYYY, h:mm a')
        }
      })
    }
    // Open window
    switchToView()
    console.timeEnd('Done loading')
  })
})()
