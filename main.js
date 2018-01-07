const electron = require('electron')
const { app, BrowserWindow, Menu, ipcMain } = electron

const path = require('path')
const url = require('url')
const Store = require('./store.js');
const config = require('./config.js')
const Notification = require('electron-native-notification');

let win;

const store = new Store({
  configName: 'user-preferences',
  defaults: {
    windowBounds: {width: 560, height: 640}
  }
});

app.on('ready', () => {
  let { width, height } = store.get('windowBounds');

  win = new BrowserWindow({width, height});
  // win.webContents.openDevTools()
  win.on('resize', () => {
    let { width, height } = win.getBounds();
    store.set('windowBounds', {width, height});
  });

  // win.loadURL('file://' + path.join(__dirname, 'index.html'));
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.on('closed', () => win = null);

  electron.powerMonitor.on('on-ac', () => win.restore());
  electron.powerMonitor.on('on-battery', () => win.minimize());

  ipcMain.on('notification', (event, arg) => {
    // https://www.npmjs.com/package/electron-native-notification
    const notification = new Notification(arg.title, {body: arg.body});
    notification.addListener('error', (err) => {
      console.error('Error', err);
    });    
  });
  
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})








