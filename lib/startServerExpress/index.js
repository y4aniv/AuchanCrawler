const AsciiTable = require('ascii-table/ascii-table');
var express = require('express');
var app = express();
var ngrok = require('ngrok');
module.exports = async () => {
    console.log('[-] Starting the Express Server'.blue)

    app.use(require("cors")())

    app.get('/auchancrawler', (req, res)=>{
        return res.send({
            status: 200,
            message: "auchancrawler"
        })
    })
    app.listen(7223, async()=>{
        console.log('[+] Express Server started'.green)
        console.log("")
        console.log('[-] Starting ngrok'.blue)
        const url = await ngrok.connect(7253);
        console.log('[+] Ngrok started'.green)
        console.log("")
        console.log(new AsciiTable('Ngrok URL').addRow(url).toString().green)
    })
}