const { default: axios } = require("axios")
const ENV = require("../../env.json")
const editJsonFile = require("edit-json-file")
const AsciiTable = require("ascii-table/ascii-table")

const DB = editJsonFile(`${__dirname}/../data/products.json`)

module.exports = async () => {
    try{
        var startTime = new Date().getTime()
        var Total = 0
        for (let i = 0; i < global.categories.length; i++) {
            console.log("")
            console.log(`[-] Extraction of products from ${global.categories[i].name.toLowerCase()}`.blue)
    
            var res = await axios.get(`${ENV.apiEndpoint.main}${global.categories[i].url}`)
            var $ = require('cheerio').load(res.data)
    
            maxPage = $('.pagination-links__container').children().last().text()
            if (maxPage > ENV.settings.maxPages) {
                maxPage = ENV.settings.maxPages
            }
    
            var total = 0
            
            for (let j = 1; j <= maxPage; j++) {
                var Res = await axios.get(`${ENV.apiEndpoint.main}${global.categories[i].url}?page=${j}`, {
                    headers: {
                        'Cookie': "lark-journey=" + global.larkJourney
                    }
                })
                var $_ = require('cheerio').load(Res.data)
                $_(".product-thumbnail").each(async (index, element) => {
                    var product = {
                        name: $_(element).find(".product-thumbnail__description").text().replace($(element).find('[itemprop="brand"]').text(), "").trim(),
                        brand: $(element).find('[itemprop="brand"]').text(),
                        price: $(element).find('.product-price').text().replace("€", "").replace(",", ".").trim(),
                        categorie: global.categories[i].name,
                    }
    
                    global.products.push(product)
                    await total++
                    await Total++
                })
    
                DB.append("products", global.products)
                DB.save()
                global.products = []
    
                process.stdout.clearLine(0);
                process.stdout.cursorTo(0);
                process.stdout.write(`[-] Page: ${j}/${maxPage} - ${Math.round(100 - ((j*100)/maxPage))}% left - ${total} products extracted`.blue);

                if(j == maxPage && i == global.categories.length - 1){
                    var endTime = new Date().getTime()
                    var timeDiff = endTime - startTime
                    console.log("")
                    console.log("")
                    console.log(`[+] Extraction of products finished`.green)
                    console.log("")
                    var seconds = Math.round(timeDiff / 1000)
                    console.log(new AsciiTable("Extraction Summary").addRow("Total products extracted", Total).addRow("Total time", `${seconds} sec`).addRow("Average time per product", `${Math.round(seconds*1000 / Total)} ms`).toString().grey)
                    process.exit()
                }
            }
            console.log("")
        }
    }catch{
        console.log("")
        console.log(`[!] Error while extracting products`.red)
        console.log("")
    }

}