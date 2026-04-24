const { app, BrowserWindow, dialog } = require('electron')
const { spawn } = require('child_process')
const path = require('path')
const http = require('http')
const fs = require('fs')

const isDev = !app.isPackaged
let backendProcess = null

// 日志文件，方便 Windows 上排查问题
const logDir = path.join(app.getPath('userData'), 'logs')
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true })
const logFile = path.join(logDir, 'app.log')

function log(...args) {
  const line = `[${new Date().toISOString()}] ${args.join(' ')}\n`
  console.log(...args)
  try { fs.appendFileSync(logFile, line) } catch {}
}

function startBackend() {
  if (isDev) return Promise.resolve(true)

  const serverPath = path.join(process.resourcesPath, 'server', 'backend.exe')
  const serverCwd = path.join(process.resourcesPath, 'server')

  // Windows Program Files 默认只读，把数据库复制到用户数据目录
  const userDataDir = app.getPath('userData')
  const userDbDir = path.join(userDataDir, 'data')
  const userDbPath = path.join(userDbDir, 'app.db')
  const bundledDbPath = path.join(serverCwd, 'data', 'app.db')

  if (!fs.existsSync(userDbDir)) fs.mkdirSync(userDbDir, { recursive: true })
  if (!fs.existsSync(userDbPath) && fs.existsSync(bundledDbPath)) {
    log('[main] copying db to userData:', userDbPath)
    fs.copyFileSync(bundledDbPath, userDbPath)
  }

  log('[main] serverPath:', serverPath)
  log('[main] serverCwd:', serverCwd)
  log('[main] server exists?', fs.existsSync(serverPath))
  log('[main] bundled db exists?', fs.existsSync(bundledDbPath))
  log('[main] user db exists?', fs.existsSync(userDbPath))

  const env = { ...process.env, DB_PATH: userDbPath }

  backendProcess = spawn(serverPath, [], {
    cwd: serverCwd,
    windowsHide: true,
    env,
  })

  log('[main] backend PID:', backendProcess.pid)

  backendProcess.stdout?.on('data', (data) => {
    log('[backend]', data.toString().trim())
  })

  backendProcess.stderr?.on('data', (data) => {
    log('[backend err]', data.toString().trim())
  })

  backendProcess.on('exit', (code, signal) => {
    log(`[backend] exited with code=${code} signal=${signal}`)
  })

  backendProcess.on('error', (err) => {
    log('[backend spawn error]', err.message)
  })

  // 等待后端就绪
  return new Promise((resolve) => {
    let attempts = 0
    const check = () => {
      attempts++
      http
        .get('http://127.0.0.1:8000/health', (res) => {
          if (res.statusCode === 200) {
            log('[backend] ready')
            resolve(true)
          } else if (attempts < 30) {
            setTimeout(check, 500)
          } else {
            log('[backend] health check timeout')
            resolve(false) // 超时标记为失败
          }
        })
        .on('error', (err) => {
          if (attempts < 30) {
            setTimeout(check, 500)
          } else {
            log('[backend] health check error:', err.message)
            resolve(false)
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
  const ok = await startBackend()
  if (!ok) {
    dialog.showErrorBox(
      '后端服务启动失败',
      '内置后端服务未能正常启动，请检查日志文件：\n' + logFile
    )
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
