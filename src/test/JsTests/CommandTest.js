const { spawn } = require("child_process");

Commander = function() {
    this.cmd = '';
}

Commander.prototype.exec = function(cmd){
    const Command = spawn(cmd);

    Command.stdout.on('data', data => {
        console.log(`stdout: ${data}`);
    });

    Command.stderr.on('data', data => {
        console.log(`stderr: ${data}`);
    });

    Command.on('error', (error) => {
        console.log(`error: ${error.message}`);
    });

    Command.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

module.exports = Commander
