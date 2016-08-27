var exec = require("child_process").exec;
var path = require("path");

var windowsFocusManagementBinary = path.join(__dirname, "windows-console-app", "windows-console-app", "bin", "Release", "windows-console-app.exe");

exec(windowsFocusManagementBinary, (error, stdout, stderr) => {
    if(error) {
        console.error(`exec error: ${error}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});
