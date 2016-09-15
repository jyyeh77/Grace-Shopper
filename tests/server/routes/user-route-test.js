/**
 * Created by jyyeh77 on 9/14/16.
 */
// run in CMD line with NODE_ENV='testing' mocha user-route-test.js!
const expect = require('chai').expect;
const Sequelize = require('sequelize');
const db = require('../../../server/db');
const supertest = require('supertest');
const chai = require('chai');
const Promise = require('bluebird');
const User = db.model('user');
const Order = db.model('order');
chai.use(require('chai-things'))
const app = require('../../../server/app')(db);
const agent = supertest.agent(app);

//could define function and objects here to better clarify what is happening in the function -- KHJH

describe('Users Route', function () {

  function toPlainObject (instance) {
    return instance.get({plain: true});
  }

  // runs once before all tests
  beforeEach('Sync DB', function () {
    return db.sync({force: true});
  })

  // seed database with test users
  beforeEach(function () {
    var users = [{
      email: 'testing@fsa.com',
      password: 'password'
    },
      {
        email: 'obama@gmail.com',
        password: 'potus'
      }]
    var creatingUsers = users.map(userObj => {
      return User.create(userObj);
    });
    return Promise.all(creatingUsers)
      .spread((user1, user2) => { //great use of let and fat arrow functions! -- KHJH
        let orders = [{
          status: 'Pending',
          products: [
            {
              title: "iRazor",
              description: "This may look like your granny's flip-phone, but inside it's running the latest iOS",
              specs: '{"screensize":"2 in.","weight":"95g","quality":"primo"}',
              price: 599.99,
              quantityOrdered: 1,
              releaseDate: '2003',
              imageUrl: 'http://i-cdn.phonearena.com/images/phones/4573-large/Motorola-RAZR-V3-0.jpg'
            },

            {
              title: "Rich Grandpa",
              description: "This may look like your grandfather's clock, but inside is a lot of unnecessary platinum, some bitcoins, and a quad-core processor",
              specs: '{"height":"4 ft","weight":"60kg","quality":"primo"}',
              price: 8000,
              quantityOrdered: 2,
              releaseDate: '1656',
              imageUrl: 'http://www.todayifoundout.com/wp-content/uploads/2012/09/grandfather-clock.jpg'
            }
          ]
        },
          {
            status: 'Pending',
            products: [
              {
                title: "Steampunk Watch Phone",
                description: "The internals of this steampunk watch phone combine the state-of-the-art components of the Apple watch AND iPhone 7",
                specs: '{"material":"various metals","weight":"200g","quality":"swag"}',
                price: 1500,
                quantityOrdered: 1,
                releaseDate: '1874',
                imageUrl: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/21b2fe19036859.562d3e03e799d.jpg'
              }
            ]
          },
          {
            status: 'Shipped',
            products: [
              {
                title: 'Model T',
                description: 'Great car',
                specs: '{"material":"various metals","weight":"200g","quality":"swag"}',
                price: 3000,
                quantityOrdered: 5,
                releaseDate: '1908' ,
                imageUrl: 'http://assets.blog.hemmings.com/wp-content/uploads/2011/03/model-t.jpg'
              },
              {
                title: 'Retro Tv',
                description: 'Old looking TV',
                specs: '{"material":"various metals","weight":"200g","quality":"swag"}',
                price: 200,
                quantityOrdered: 1,
                releaseDate: '1908',
                imageUrl: 'http://graphicdesign-blog.com/wp-content/uploads/2012/02/Serie_1_Retro_TV_Front.jpg'
              }
            ]
          }];

        orders.forEach(orderObj => {
          orderObj.products = orderObj.products.map(product => {
            return JSON.stringify(product);
          })
        })
        //
        var creatingOrders = orders.map(function(orderObj){
          return Order.create(orderObj)
        })

        return Promise.all(creatingOrders)
          .spread((order1, order2, order3) => {
            // attaches orders to users
            return Promise.all([user1.setOrders(order1), user1.setOrders(order2), user2.setOrders(order3)]);
          })
      })
  })

  describe('GET /api/users/:id', function () {

    it('responds with 200 on a page that exists', function (done) { //for admin use? Otherwise I would expect user/home and rely on req.user -- KHJH
      agent.get('/api/users/1').expect(200).end(function (err, res) {
        if (err) return done(err);
        expect(res.body.email).to.equal('testing@fsa.com');
        expect(res.body.password).to.exist;
        done()
      });
    });

    it('responds with 404 on page that does not exist', function (done) {
      agent.get('/api/users/5').expect(404).end(done);
    });

  })

  describe('GET /api/users/:id/orders', function () { //think about RESTful and descriptive routes. Orders in order.js. -- KHJH

    it('retrieves all orders for existing user', function (done) {
      agent.get('/api/users/1/orders').expect(200).end((err, res) => {
        if (err) return done(err);
        // test that orders gets included in user being sent back
        expect(res.body.orders).to.be.instanceof(Array);
        expect(res.body.orders).to.have.length(2)
        done();
      })
    })
  })

  describe('DELETE /api/users/:id', function () {

    it('deletes an user', function (done) {
      agent.delete('/api/users/1').expect(204).end((err, res) => {
        if (err) return done(err);
        User.findById(1) //gerat!! -- KHJH
          .then((deletedUser) => {
            expect(deletedUser).to.be.null;
            done()
          })
          .catch(done);
      })
    })
  })

  describe('PUT /api/users/:id', function () {

    it('updates an user', function (done) {
      agent
        .put('/api/users/1')
        .send({
        email: 'updatedBB@gmail.com'
      })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.email).to.equal('updatedBB@gmail.com');
          User.findById(1)
            .then(updatedUser => {
              expect(updatedUser).to.not.be.null;
              expect(res.body.email).to.eql(updatedUser.email);
              done();
            })
            .catch(done);
        })
    })
  })

})
