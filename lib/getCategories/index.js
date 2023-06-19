const { default: axios } = require('axios')
const cheerio = require('cheerio')
const {v4: uuidv4} = require('uuid')
const editJsonFile = require('edit-json-file')


var ENV = require('../../env.json')
const AsciiTable = require('ascii-table/ascii-table')

module.exports = async () => {
    console.log("")
    console.log("[-] Extraction of categories".blue)
    
    try {
        var res = await axios.request({
            method: 'GET',
            url: ENV.apiEndpoint.main,
        })
    
        var $ = cheerio.load(res.data)

        var categoryPromises = [];
    
        $('.navigation-node').each((i, el) => {
            var name = $(el).find('a').text().trim()
            var url = $(el).find('a').attr().href
    
            var blacklist = ENV.blackList
    
            var isBlacklisted = blacklist.some(blacklistedPart => url.includes(blacklistedPart))

            if(isBlacklisted || url == "#"){
                return
            } else {
                var categoryPromise = axios.request({
                    method: 'GET',
                    url: ENV.apiEndpoint.main + url,
                }).then((Res) => {
                    var $_ = cheerio.load(Res.data)
                    if($_(".universe").length > 0){
                        $_(".universe-block").each((i, el) => {
                            global.categories.push({
                                name: $(el).find('.universe-block__heading').text().trim(),
                                url: $(el).find('.universe-block__head').attr().href,
                                uuid: uuidv4()
                            })
                        })
                    }else{
                        global.categories.push({
                            name: name,
                            url: url,
                            uuid: uuidv4()
                        })
                    }
                }).catch((err) => {
                    console.log("[!] Error while extracting categories".red)
                    process.exit(1)
                });

                categoryPromises.push(categoryPromise);
            }
        });

        await Promise.all(categoryPromises);

        var table = new AsciiTable('Categories')
            .setHeading("name", "uuid")
        global.categories.forEach(category => {
            table.addRow(category.name, category.uuid)
        })
        console.log("[+] Categories extracted".green)
        console.log("")
        console.log(table.toString().gray)

        var DB = editJsonFile(`${__dirname}/../data/categories.json`)
        DB.append("categories", global.categories)
        DB.save()

    } catch(err){
        console.log("[!] Error while extracting categories".red)
        process.exit(1)
    }
}
