const AsciiTable = require('ascii-table/ascii-table');
var express = require('express');
var app = express();
var localtunnel = require('localtunnel');
const cors = require('cors');
var ENV = require('../../env.json')
//module.exports = async () => {
    console.log('[-] Starting the Express Server'.blue)

    app.use(cors())

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        next();
    });

    app.get("/search", (req,res)=>{
        var query = req.query.q
        var page = req.query.page

        if(!query || !page){
            return res.send({
                status: 400,
                message: "Bad Request"
            }).status(400)
        }

        var products = require('../data/products.json').products[0]
        var maxPerPage = 20 

        products.filter((product)=>{
            console.log(product)
        })
        
    })

    app.get('/auchancrawler', (req, res) => {
        return res.send({
            status: 200,
            message: "auchancrawler"
        })
    })

    var PORT = ENV.PORT_EXPRESS
    app.listen(PORT, async () => {
        console.log("")
        console.log('[+] Express Server started'.green)
        console.log("")
        console.log('[-] Starting localtunnel'.blue)
        // const url = await await localtunnel({ port: PORT });
        console.log('[+] Localtunnel started'.green)
        console.log("")
       // console.log(new AsciiTable('Localtunnel URL').addRow(url.url).toString().green)
    })
// }