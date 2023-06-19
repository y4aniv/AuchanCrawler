const { spawn } = require('child_process');
const path = require('path');

module.exports = async () => {
    console.log('[-] Starting the React server'.blue)
    const serverPath = path.join(__dirname, '../../web/');

    const command = 'npm';
    const args = ['start'];

    const options = {
        stdio: "ignore",
        cwd: serverPath
    }

    const serverProcess = spawn(command, args, options);

    serverProcess.on('error', (err) => {
        console.log('[!] Error launching React server'.red);
    });

    serverProcess.on('exit', (code, signal) => {
    });
    
    console.log('[+] Server started'.green)
}