var ENV = require('../../env.json')
var fs = require('fs')

module.exports = async () => {
    console.clear()
    global.larkJourney = null
    global.categories = []
    global.products = []
    await fs.writeFileSync(`${__dirname}/../data/categories.json`, JSON.stringify({}, null, 4))
    await fs.writeFileSync(`${__dirname}/../data/products.json`, JSON.stringify({}, null, 4))
}