const { app, BrowserWindow } = require("electron");

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      autoHideMenuBar: true,
    },
  });

  // mainWindow.setMenu(null);

  mainWindow.loadURL(`file://${__dirname}/index.html`);
});
