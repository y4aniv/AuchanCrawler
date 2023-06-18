const { default: axios } = require("axios")
const { v4: uuidv4 } = require('uuid');

const ENV = require('../../env.json')

module.exports = async () => {
    console.log("[-] Recovery of cookies necessary for the extraction of information".blue)
    try {
        var uuid = uuidv4()
        var res = await axios.request({
            method: 'POST',
            maxBodyLength: Infinity,
            url: ENV.apiEndpoint.update,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
                'Cookie': `lark-session=${uuid}+${new Date().getTime()};valiuz-id=${uuid}`
            },
            data: `offeringContext.seller.id=${ENV.seller.offeringContext.seller.id}&offeringContext.channels%5B0%5D=${ENV.seller.offeringContext.channels}&offeringContext.address.zipcode=${ENV.seller.offeringContext.address.zipcode}&offeringContext.address.city=${ENV.seller.offeringContext.address.city}&offeringContext.address.country=${ENV.seller.offeringContext.address.country}&offeringContext.location.longitude=${ENV.seller.offeringContext.location.longitude}&offeringContext.location.latitude=${ENV.seller.offeringContext.location.latitude}&offeringContext.accuracy=${ENV.seller.offeringContext.accuracy}&offeringContext.express=${ENV.seller.offeringContext.express}&address.zipcode=${ENV.seller.address.zipcode}&address.city=${ENV.seller.address.city}&address.country=${ENV.seller.address.country}&location.latitude=${ENV.seller.location.latitude}&location.longitude=${ENV.seller.location.longitude}&accuracy=${ENV.seller.accuracy}&position=${ENV.seller.position}&journeyId=${ENV.seller.journeyId}`
        })
        global.larkJourney = res.data.id
        console.log(`[+] Cookies retrieved successfully`.green)
    }catch (err){
        console.log(`[-] Error while retrieving cookies (${err.response.status}: ${err.response.statusText})`.red)
        process.exit(1)
    }
}