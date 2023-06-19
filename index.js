var colors = require('colors');

(async () => {
    await require('./lib/setup')()
    await require('./lib/setLogo')()
    await require('./lib/getCookies')()
    // await require('./lib/getCategories')()
    global.categories = [
        {
          name: 'Cafés',
          url: '/epicerie-sucree/cafes/ca-n0502',
          uuid: '115b2aa0-6cb7-4f74-925e-5c4803c43ac4'
        },
        {
          name: 'Petit déjeuner, thés, chocolats en poudre',
          url: '/epicerie-sucree/petit-dejeuner-thes-chocolats-en-poudre/ca-n0503',
          uuid: 'ee25490c-6918-492e-b1d1-1b83a587256f'
        },
        {
          name: 'Biscuits, gâteaux',
          url: '/epicerie-sucree/biscuits-gateaux/ca-n0505',
          uuid: '8ffd5dc2-781c-487c-bf5a-3b9452a41c87'
        },
        {
          name: 'Chocolats, confiseries',
          url: '/epicerie-sucree/chocolats-confiseries/ca-n0507',
          uuid: '8afc05d2-6903-4bdd-a341-7ef486e86cff'
        },
        {
          name: 'Desserts, sucres, farines, diététique',
          url: '/epicerie-sucree/desserts-sucres-farines-dietetique/ca-n0511',
          uuid: '5663fc13-9aee-4aa2-98d2-cf5fcee80912'
        },
        {
          name: 'Laits, petits-déjeuners de bébé',
          url: '/bebe/laits-petits-dejeuners-de-bebe/ca-n0801',
          uuid: '3fef5d20-59a4-4e25-a713-bd492265473d'
        },
      ]
    await require('./lib/getProducts')()
})();