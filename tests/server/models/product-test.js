const Promise = require('bluebird');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-things'))
const db = require('../../../server/db');
const Product = db.model('product');
const Category = db.model('category');

describe('Review model', function () {

  beforeEach('Sync DB', function () {

    return db.sync({ force: true })
  });

  describe('Methods', function () {

    var greatCar, goodCar, badCar, greatPhone;
    describe ('getSimilar', function () {
      beforeEach(function () {
        let categories = [
          {name: 'Cars', metaCategory: 'Vehicles'},
          {name: 'Phones', metaCategory: 'Electronics'},
        ]
        let creatingCategories = categories.map(function(catObj){
          return Category.create(catObj)
        })
        return Promise.all(creatingCategories)
          .spread((carCategory, phoneCategory) => {
            let carOne = Product.create({
              title: 'Model T',
              description: 'Great car',
              specs: '{"material":"various metals","weight":"200g","quality":"swag"}',
              price: 3000,
              quantity: 5,
              releaseDate: '1908',
              imageUrl: 'http://assets.blog.hemmings.com/wp-content/uploads/2011/03/model-t.jpg'
            })

            let carTwo = Product.create({
              title: 'Phantom',
              description: 'Good car',
              specs: '{"material":"titanium","weight":"1000g","quality":"swag"}',
              price: 100000,
              quantity: 2,
              releaseDate: '1951',
              imageUrl: 'http://gtspirit.com/wp-content/uploads/2015/04/Rolls-Royce-Phantom-Limelight-Collection-1.jpg'
            });
            let carThree = Product.create({
              title: 'Toyota Tercel',
              description: 'Bad car',
              specs: '{"material":"aluminum","weight":"1000g","quality":"notSwag"}',
              price: 20,
              quantity: 2,
              releaseDate: '1981',
              imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Toyota_Tercel_sedan_--_09-07-2009.jpg'
            });
            let phone = Product.create({
              title: 'Raz0r',
              description: 'best phone',
              specs: '{"material":"vibranium","weight":"2g","quality":"swagAsHell"}',
              price: 20,
              quantity: 2,
              releaseDate: '2005',
              imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/37/RAZR_V3i_opened.JPG'
            })
            return Promise.all([carOne, carTwo, carThree, phone])
              .spread((car1, car2, car3, phone1) => {
                greatCar = car1;
                goodCar = car2;
                badCar = car3;
                greatPhone = phone1;
                // adds 'Car' category to cars through Product.belongsToMany('category') association
                return Promise.all([car1.addCategory([carCategory, phoneCategory]), car2.addCategory(carCategory), car3.addCategory(carCategory), phone1.addCategory(phoneCategory)]
                );
            })
          })
      })

      it('never gets itself', function (done) {
        greatCar.getSimilar()
          .then(similarProducts => {
            expect(similarProducts).to.not.contain.a.thing.with.property('title', greatCar.title);
            done();
          })
          .catch(err => {
            console.error(err);
          })
      })

      it('never gets products that it doesn\'t share a category with', function (done) {
        goodCar.getSimilar()
          .then(similarProducts => {
              expect(similarProducts).to.not.contain.a.thing.with.property('title', greatPhone.title);
              done();
          })
          .catch(err => {
            console.error(err);
          })
      })

      it('gets the correct similar products', function (done) {
        greatCar.getSimilar()
          .then(similarProducts => {
            expect(similarProducts).to.have.lengthOf(3);
            expect(similarProducts).to.contain.a.thing.with.property('title', badCar.title);
            expect(similarProducts).to.contain.a.thing.with.property('title', goodCar.title);
            expect(similarProducts).to.contain.a.thing.with.property('title', greatPhone.title);
            done();
          })
          .catch(err => {
            console.error(err);
          })
      })

    })
  })
})
