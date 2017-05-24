const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const glob = require('glob')
const path = require('path')
const url = require('url')

const debug = /--debug/.test(process.argv[2])

if(debug){
  require('electron-reload')(__dirname, {
      electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
  });
}

let mainWindow

function init() {
    makeSingleInstance();
    loadMainProcess();

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', createWindow)

    // Quit when all windows are closed.
    app.on('window-all-closed', function() {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    app.on('activate', function() {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null) {
            createWindow()
        }
    })

}

// Create the browser window.
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    })
    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    if (debug) {
        mainWindow.webContents.openDevTools()
        mainWindow.maximize()
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance() {
    if (process.mas) return false

    return app.makeSingleInstance(function() {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })
}

// load main process
function loadMainProcess() {
    var files = glob.sync(path.join(__dirname, 'main-process/**/*.js'))
    files.forEach(function(file) {
        require(file)
    })
}

init();
