const pug = require('pug')
const path = require('path')

console.time('load views')
const views = {
  article: {
    index: pug.compileFile(path.join(__dirname, '../views/tabs/article.pug')),
    uploads: pug.compileFile(path.join(__dirname, '../views/tabs/article/uploads.pug')),
    library: pug.compileFile(path.join(__dirname, '../views/tabs/article/library.pug')),
    editor: pug.compileFile(path.join(__dirname, '../views/tabs/article/editor.pug')),
    drafts: pug.compileFile(path.join(__dirname, '../views/tabs/article/drafts.pug')),
    view: pug.compileFile(path.join(__dirname, '../views/tabs/article/view.pug'))
  },
  video: {
    index: pug.compileFile(path.join(__dirname, '../views/tabs/video.pug')),
    editor: null,
    view: null
  },
  setting: {
    index: pug.compileFile(path.join(__dirname, '../views/tabs/setting.pug')),
    register: pug.compileFile(path.join(__dirname, '../views/tabs/settings/register.pug')),
    application: pug.compileFile(path.join(__dirname, '../views/tabs/settings/application.pug')),
    account: pug.compileFile(path.join(__dirname, '../views/tabs/settings/account.pug'))
  },
  home: {
    index: pug.compileFile(path.join(__dirname, '../views/tabs/home.pug')),
    raw: pug.compileFile(path.join(__dirname, '../views/tabs/home/raw.pug'))
    // , community: pug.compileFile(path.join(__dirname, '../views/tabs/home/community.pug'))
  },
  error: pug.compileFile(path.join(__dirname, '../views/error.pug')),
  modal: pug.compileFile(path.join(__dirname, '../views/modal.pug'))
}
console.timeEnd('load views')

module.exports = views
