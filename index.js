var exec = require('child_process').exec
var path = require('path')

var windowsFocusManagementBinary = path.join(__dirname, 'windows-console-app', 'windows-console-app', 'bin', 'Release', 'windows-console-app.exe')

const IS_WINDOWS = (process.platform === 'win32')
const FUNC_NOOP = function () { }
const ERROR_NOT_WINDOWS = new Error('Non-Windows platforms are currently not supported')

// Throw if not windows
function windowsCheck () {
  if (!IS_WINDOWS) throw ERROR_NOT_WINDOWS
}

// Get list of running processes
function getProcesses (callback) {
  windowsCheck()

  var mappingFunction = (processes) => {
    return processes.map(p => {
      return {
        pid: p.ProcessId,
        mainWindowTitle: p.MainWindowTitle || '',
        processName: p.ProcessName || ''
      }
    })
  }

  executeProcess('--processinfo', callback, mappingFunction)
}

// Focus window by id, string name or object
function focusWindow (process) {
  windowsCheck()

  if (process === null) { return }

  if (typeof process === 'number') {
    executeProcess('--focus ' + process.toString())
  } else if (typeof process === 'string') {
    focusWindowByName(process)
  } else if (process.pid) {
    executeProcess('--focus ' + process.pid.toString())
  }
}

/**
 * Get information about the currently active window
 *
 * @param {function} callback
 */
function getActiveWindow (callback) {
  windowsCheck()
}

/**
 * Helper method to focus a window by name
 */
function focusWindowByName (processName) {
  processName = processName.toLowerCase()

  getProcesses((err, result) => {
    if (err) {
      throw new Error('Failed to get processes')
    }

    var potentialResults = result.filter((p) => {
      var normalizedProcessName = p.processName.toLowerCase()
      var normalizedWindowName = p.mainWindowTitle.toLowerCase()

      return normalizedProcessName.indexOf(processName) >= 0 ||
                normalizedWindowName.indexOf(processName) >= 0
    })

    if (potentialResults.length > 0) {
      executeProcess('--focus ' + potentialResults[0].pid.toString())
    }
  })
}

/**
 * Helper method to execute the C# process that wraps the native focus / window APIs
 */
function executeProcess (arg, callback, mapper) {
  callback = callback || FUNC_NOOP

  exec(windowsFocusManagementBinary + ' ' + arg, (error, stdout, stderr) => {
    if (error) {
      callback(error, null)
      return
    }

    if (stderr) {
      callback(stderr, null)
      return
    }

    var returnObject = JSON.parse(stdout)

    if (returnObject.Error) {
      callback(returnObject.Error, null)
      return
    }

    var ret = returnObject.Result

    ret = mapper ? mapper(ret) : ret
    callback(null, ret)
  })
}

module.exports = {
  getProcesses: getProcesses,
  focusWindow: focusWindow,
  getActiveWindow: getActiveWindow
}
