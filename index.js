var colors = require('colors');

(async () => {
    await require('./lib/setup')()
    await require('./lib/setLogo')()
    await require('./lib/getCookies')()
    await require('./lib/getCategories')()
})();