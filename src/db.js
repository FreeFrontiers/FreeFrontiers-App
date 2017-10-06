'use strict'

const lf = require('localforage')

let db = lf.createInstance({
  name: 'FreeFrontiers',
  version: 1.0,
  storeName: 'ff_local', // Should be alphanumeric, with underscores.
  description: 'FreeFrontiers local storage.'
})

db.setItem('running', true)

let defaultSettings = {
  theme: 0,
  uploadbandwidth: '512',
  downloadbandwidth: '1024',
  seedarticle: true,
  downloadarticle: true,
  backgroundmining: true,
  cpuusage: 1
}
let defaultArticleDrafts = [
  {
    title: 'This is an example drafted article.',
    description: 'This is an example drafted article description.',
    content: '## Header 1\nThis is an example drafted article content.',
    attachments: null,
    tags: 'example, article, tags',
    created: Date.now()
  },
  {
    title: 'This is an example drafted article two.',
    description: 'This is an example drafted article description.',
    content: '## Header 1\nThis is an example drafted article content.',
    attachments: null,
    tags: 'example, article, tags, two',
    created: Date.now()
  }
]

let settingsPromise = db.getItem('settings')
let articleDraftsPromise = db.getItem('articledrafts')
let articleDownloads = db.getItem('articledownloads')
let articleUploads = db.getItem('articleuploads')

Promise.all([settingsPromise, articleDraftsPromise, articleDownloads, articleUploads]).then(results => {
  console.log(results)
  if (!results[0]) {
    db.setItem('settings', defaultSettings).then(res => console.log('Initialising default settings.')).catch(e => console.log(e))
  } else console.log('Loading settings.')
  if (!results[1]) {
    db.setItem('articledrafts', defaultArticleDrafts).then(res => console.log('Initialising default draft.')).catch(e => console.log(e))
  } else console.log('Loading drafts.')
  if (!results[2]) {
    db.setItem('articledownloads', []).then(res => console.log('Initialising article downloads array.')).catch(e => console.log(e))
  } else console.log('Loading downloaded articles.')
  if (!results[3]) {
    db.setItem('articleuploads', []).then(res => console.log('Initialising article uploads array.')).catch(e => console.log(e))
  } else console.log('Loading uploaded articles.')
}).catch(e => console.log(e))

module.exports = {db, settings: {defaultSettings, defaultArticleDrafts}}
