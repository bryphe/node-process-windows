var exec = require("child_process").exec;
var path = require("path");

var windowsFocusManagementBinary = path.join(__dirname, "windows-console-app", "windows-console-app", "bin", "Release", "windows-console-app.exe");

var isWindows = process.platform === "win32";
var noop = function () { };

/**
 * Get list of processes that are currently running
 *
 * @param {function} callback
 */
function getProcesses(callback) {
    callback = callback || noop;

    if (!isWindows) {
        callback("Non-Windows platforms are currently not supported");
    }

    var mappingFunction = (processes) => {
        return processes.map(p => {
            return {
                pid: p.ProcessId,
                mainWindowTitle: p.MainWindowTitle || "",
                processName: p.ProcessName || ""
            };
        });
    };

    executeProcess("--processinfo", callback, mappingFunction);
}

/**
 * Focus a windows
 * Process can be a number (PID), name (process name or window title),
 * or a process object returning from getProcesses
 *
 * @param {number|string|ProcessInfo} process
 */
function focusWindow(process) {
    if (!isWindows) {
        throw "Non-windows platforms are currently not supported"
    }

    if (process === null)
        return;

    if (typeof process === "number") {
        executeProcess("--focus " + process.toString());
    } else if (typeof process === "string") {
        focusWindowByName(process);
    } else if (process.pid) {
        executeProcess("--focus " + process.pid.toString());
    }
}

/**
 * Get information about the currently active window
 *
 * @param {function} callback
 */
function getActiveWindow(callback) {
    callback = callback || noop;

    if (!isWindows) {
        callback("Non-windows platforms are currently not supported");
    }
}

/**
 * Helper method to focus a window by name
 */
function focusWindowByName(processName) {
    processName = processName.toLowerCase();

    getProcesses((err, result) => {
        var potentialResults = result.filter((p) => {
            var normalizedProcessName = p.processName.toLowerCase();
            var normalizedWindowName = p.mainWindowTitle.toLowerCase();

            return normalizedProcessName.indexOf(processName) >= 0
                || normalizedWindowName.indexOf(processName) >= 0;
        });

        if (potentialResults.length > 0) {
            executeProcess("--focus " + potentialResults[0].pid.toString());
        }
    });
}

/**
 * Helper method to execute the C# process that wraps the native focus / window APIs
 */
function executeProcess(arg, callback, mapper) {
    callback = callback || noop;

    exec(windowsFocusManagementBinary + " " + arg, (error, stdout, stderr) => {
        if (error) {
            callback(error, null);
            return;
        }

        if (stderr) {
            callback(stderr, null);
            return;
        }

        var returnObject = JSON.parse(stdout);

        if (returnObject.Error) {
            callback(returnObject.Error, null);
            return;
        }

        var ret = returnObject.Result;

        ret = mapper ? mapper(ret) : ret;
        callback(null, ret);
    });
}

module.exports = {
    getProcesses: getProcesses,
    focusWindow: focusWindow,
    getActiveWindow: getActiveWindow
}
