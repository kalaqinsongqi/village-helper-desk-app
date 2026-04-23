const { app, BrowserWindow } = require('electron')
const { spawn } = require('child_process')
const path = require('path')
const http = require('http')

const isDev = !app.isPackaged
let backendProcess = null

function startBackend() {
  if (isDev) return Promise.resolve()

  const serverPath = path.join(process.resourcesPath, 'server', 'backend.exe')
  const serverCwd = path.join(process.resourcesPath, 'server')

  backendProcess = spawn(serverPath, [], {
    cwd: serverCwd,
    windowsHide: true,
  })

  backendProcess.stdout?.on('data', (data) => {
    console.log('[backend]', data.toString().trim())
  })

  backendProcess.stderr?.on('data', (data) => {
    console.error('[backend err]', data.toString().trim())
  })

  backendProcess.on('exit', (code) => {
    console.log(`[backend] exited with code ${code}`)
  })

  // 等待后端就绪
  return new Promise((resolve) => {
    let attempts = 0
    const check = () => {
      attempts++
      http
        .get('http://127.0.0.1:8000/health', (res) => {
          if (res.statusCode === 200) {
            console.log('[backend] ready')
            resolve()
          } else if (attempts < 30) {
            setTimeout(check, 500)
          } else {
            resolve() // 超时也继续
          }
        })
        .on('error', () => {
          if (attempts < 30) {
            setTimeout(check, 500)
          } else {
            resolve()
          }
        })
    }
    setTimeout(check, 1000)
  })
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hiddenInset',
    show: false,
  })

  if (isDev) {
    win.loadURL('http://127.0.0.1:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  win.once('ready-to-show', () => {
    win.show()
  })
}

app.whenReady().then(async () => {
  try {
    await startBackend()
  } catch (err) {
    console.error('Failed to start backend:', err)
  }
  createWindow()
})

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill()
    backendProcess = null
  }
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill()
    backendProcess = null
  }
})
