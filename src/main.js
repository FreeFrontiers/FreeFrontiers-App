'use strict'

const {BrowserWindow, app, Menu, shell, ipcMain, dialog} = require('electron')
const autoUpdater = require('electron-updater').autoUpdater

const path = require('path')
const url = require('url')
require('./lib/electron-pug')({pretty: true})
require('electron-debug')({enabled: true})

ipcMain.on('close-main-window', () => {
  mainWindow.close()
})

ipcMain.on('minimize-main-window', () => {
  mainWindow.minimize()
})

ipcMain.on('maximize-main-window', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize()
  } else mainWindow.maximize()
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    frame: false,
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
      shell.openExternal(url)
    }
  })

  // Create the Application's main menu
  let template = [{
    label: 'Application',
    submenu: [
      { label: 'Quit', accelerator: 'Command+Q', click: () => { app.quit() } },
      { label: 'Developer Console', accelerator: 'CmdOrCtrl+Alt+I', click: () => { wc.toggleDevTools() } },
      { label: 'Check for updates', click: () => { autoUpdater.checkForUpdates() } }
    ]}, {
    label: 'Edit',
    submenu: [
      { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
      { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
      { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
    ]}
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  mainWindow.on('unresponsive', () => {
    dialog.showMessageBox({
      type: 'info',
      message: 'Window is unresponsive, would you like to reload application?',
      buttons: ['Wait', 'Reload']
    }, onUnresponsiveHandle)
  })
  function onUnresponsiveHandle (number) {
    if (number === 0) return
    mainWindow.reload(true)
  }

  autoUpdater.checkForUpdates()
  autoUpdater.on('download-progress', (progressObj) => {
    wc.send('downloadUpdateProgress', progressObj)
  })

  autoUpdater.on('update-downloaded', (info) => {
    dialog.showMessageBox({
      type: 'info',
      message: 'Update is ready! Want to apply update?',
      buttons: ['No', 'Restart']
    }, onUpdateReadyHandle)
  })

  function onUpdateReadyHandle (number) {
    if (number === 0) return
    autoUpdater.quitAndInstall()
  }
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
