const { default: axios } = require('axios')
const cheerio = require('cheerio')
const {v4: uuidv4} = require('uuid')

var ENV = require('../../env.json')

module.exports = async () => {
    console.log("")
    console.log("[-] Recovery of categories".blue)
    
    var res = await axios.request({
        method: 'GET',
        url: ENV.apiEndpoint.main,
    })

    var $ = cheerio.load(res.data)
    var categories = []

    $('.navigation-node').each((i, el) => {
        var name = $(el).find('a').text().trim()
        var url = $(el).find('a').attr().href
        var uuid = uuidv4()

        var blacklist = [
            "/boutique/",
            "/petits-prix-grandes-economies/",
            "/bientot-l-ete/",
            "/produits-auchan/"
        ]

        var isBlacklisted = blacklist.some(blacklistedPart => url.includes(blacklistedPart))

        
    })
}