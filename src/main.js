'use strict'

const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// const {autoUpdater} = require('electron')
// autoUpdater.addListener('update-available', (event) => {
// })
// autoUpdater.addListener('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateURL) => {
// })
// autoUpdater.addListener('error', (error) => {
// })
// autoUpdater.addListener('checking-for-update', (event) => {
// })
// autoUpdater.addListener('update-not-available', (event) => {
// })

const path = require('path')
const url = require('url')
require('./lib/electron-pug')({pretty: true})
require('electron-debug')({enabled: true})
const menu = new electron.Menu()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    minHeight: 600,
    minWidth: 800,
    title: 'FreeFrontiers'
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/views/layout.pug'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  let wc = mainWindow.webContents
  wc.on('will-navigate', (e, url) => {
    if (url !== wc.getURL()) {
      e.preventDefault()
      electron.shell.openExternal(url)
    }
  })

  menu.append(new electron.MenuItem({
    label: 'Toggle Console',
    accelerator: 'CmdOrCtrl+Alt+I',
    click: () => { mainWindow.webContents.openDevTools() }
  }))
  mainWindow.on('unresponsive', () => {
    // mainw
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
