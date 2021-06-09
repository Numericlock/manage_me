'use strict'

import {
    app,
    protocol,
    BrowserWindow
} from 'electron'
import {
    createProtocol
} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {
    VUEJS_DEVTOOLS
} from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path');
const fs = require('fs');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {
        scheme: 'app',
        privileges: {
            secure: true,
            standard: true
        }
    }
])

function createWindow() {
    // Create the browser window.
    var info_path = path.join(app.getPath("userData"), "bounds-info.json");
    var bounds_info;
    win = new BrowserWindow({
        width: 500,
        height: 670,
        transparent: true,
        frame: false,
        //resizable: false, 
        webPreferences: {
            preload: path.join(__dirname, './preload.js'),
            enableRemoteModule: true,
            nodeIntegration: false,
            contextIsolation: false,
            //  devTools: false
        }
    })
    try {
        bounds_info = JSON.parse(fs.readFileSync(info_path, 'utf8'));
    } catch (e) {
        console.log(e);
        bounds_info = false;
    }
    if (bounds_info) {
        win.setPosition(bounds_info.x, bounds_info.y);
    }
    win.on('close', function () {
        fs.writeFileSync(info_path, JSON.stringify(win.getBounds()));
    });
    win.once('ready-to-show', () => {
        win.show()
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }

    win.on('closed', () => {
        win = null
    })
    win.setMenu(null);
}
// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    createWindow()
})
// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}
