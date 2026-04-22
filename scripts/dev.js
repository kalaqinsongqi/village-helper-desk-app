const { spawn } = require('child_process')
const http = require('http')

function startVite() {
  return spawn('npx', ['vite'], {
    stdio: 'inherit',
    shell: true,
  })
}

function waitForVite(callback) {
  const check = () => {
    http
      .get('http://127.0.0.1:5173', (res) => {
        if (res.statusCode === 200) {
          console.log('[dev] Vite dev server is ready')
          callback()
        } else {
          setTimeout(check, 500)
        }
      })
      .on('error', () => {
        setTimeout(check, 500)
      })
  }
  check()
}

function startElectron() {
  return spawn('npx', ['electron', '.'], {
    stdio: 'inherit',
    shell: true,
  })
}

const vite = startVite()

waitForVite(() => {
  const electron = startElectron()

  electron.on('close', (code) => {
    vite.kill()
    process.exit(code)
  })
})

process.on('SIGINT', () => {
  vite.kill()
  process.exit(0)
})
