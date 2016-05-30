const electron = require('electron');

const {app} = electron;
const {BrowserWindow} = electron;

/////////////////////////
// ----------------------
// Electron Setup Code 
// ----------------------
/////////////////////////

// Global window variable, this helps in preventing 
// the app to garbage collect and shutdown
let win;

/*
 * [createWindow Initialize the Windows and load the index files]
 * @return 
 */
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
      width: 1280, 
      height: 920,
      frame:false,
      resizable:false
    });

  win.loadURL(`file://${__dirname}/index.html`);
  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null;
  });
}

//Event Handlers
app.on('ready', createWindow);
app.on('window-all-closed', () => {

  // For MacOS, the app doesn't really closes, 
  // but goes to the app launcher
  if (process.platform !== 'darwin') {
    app.quit();
  }
  
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});