# node-node-process-windows
###### Manage application windows via a Node API - set focus, cycle active windows and get active windows

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

- [Installation](#Installation)
    - [Supported Platforms](#Supported_Platforms)
- [Usage](#Usage)
- [Contributing](#Contributing)
- [License](#License)
- [Contact](#Contact)

## Installation

Requires Node 4+

```
    npm install node-process-windows
```

This module is __not supported__ in browsers.

### Supported Platforms

Currently, this module is supported on Windows, and has partial support (only active window) for macOS. It uses a .NET console app on Windows, and AppleScript on macOS.

Pull requests are welcome - it would be great to have more of this API work cross-platform.

## Usage

1) Get active processes

```javascript
    var processWindows = require("node-process-windows");

    var activeProcesses = processWindows.getProcesses(function(err, processes) {
        processes.forEach(function (p) {
            console.log("PID: " + p.pid.toString());
            console.log("MainWindowTitle: " + p.mainWindowTitle);
            console.log("ProcessName: " + p.processName);
        });
    });
```

2) Focus a window

```javascript
    var processWindows = require("node-process-windows");

    // Focus window by process...
    var activeProcesses = processWindows.getProcesses(function(err, processes) {
        var chromeProcesses = processes.filter(p => p.processName.indexOf("chrome") >= 0);

        // If there is a chrome process active, focus the first window
        if(chromeProcesses.length > 0) {
            processWindows.focusWindow(chromeProcesses[0]);
        }
    });

    // Or focus by name
    processWindows.focusWindow("chrome");
```

3) Get active window

```javascript
    var processWindows = require("node-process-windows");

    var currentActiveWindow = processWindows.getActiveWindow((err, processInfo) => {
        console.log("Active window title: " + processInfo.mainWindowTitle);
    });
```

## Contributing

Pull requests are welcome

## License

[MIT License]("LICENSE")

## Contact

Original author - extr0py@extropygames.com
