const { execFileSync } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')

function expandPath(value) {
  if (!value) return value
  return value.startsWith('~/') ? path.join(os.homedir(), value.slice(2)) : value
}

function getFlightctlBin({ fallbackToPath = false } = {}) {
  const configured = process.env.CYPRESS_FLIGHTCTL_BIN
  if (configured) return expandPath(configured)

  const builtBinary = path.join(os.homedir(), 'flightctl', 'bin', 'flightctl')
  return fallbackToPath && !fs.existsSync(builtBinary) ? 'flightctl' : builtBinary
}

function runFlightctl(args, options = {}) {
  return execFileSync(getFlightctlBin(), args, {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    timeout: 30000,
    ...options,
  })
}

module.exports = { expandPath, getFlightctlBin, runFlightctl }
