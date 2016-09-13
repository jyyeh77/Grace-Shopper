/*

 This seed file is only a placeholder. It should be expanded and altered
 to fit the development of your application.

 It uses the same file the server uses to establish
 the database connection:
 --- server/db/index.js

 The name of the database used is set in your environment files:
 --- server/env/*

 This seed file has a safety check to see if you already have users
 in the database. If you are developing multiple applications with the
 fsg scaffolding, keep in mind that fsg always uses the same database
 name in the environment files.

 */

var chalk = require('chalk');
var db = require('./server/db');
var User = db.model('user');
var Product = db.model('product');
var Review = db.model('review');
var Promise = require('sequelize').Promise;

var seedUsers = function () {

  var users = [
    {
      email: 'testing@fsa.com',
      password: 'password'
    },
    {
      email: 'obama@gmail.com',
      password: 'potus'
    },
    {
      email: 'j.soulfire77@gmail.com',
      password: 'FSA'
    },
    {
      email: 'kfuchs24@gmail.com',
      password: '123'
    },
    {
      email: 'j@osh.com',
      password: '2fly'
    },
    {
      email: 'd@an.com',
      password: '3fly'
    }
  ];

  var creatingUsers = users.map(function (userObj) {
    return User.create(userObj);
  });

  return Promise.all(creatingUsers);

};


var seedProducts = function () {
  var Clocks, Cars, Phones, Video;

  Category.findOne({where: {name: 'Clocks'}})
    .then(function (foundCategory) {
      Clocks = foundCategory;
    });
  Category.findOne({where: {name: 'Cars'}})
    .then(function (foundCategory) {
      Cars = foundCategory;
    });
  Category.findOne({where: {name: 'Phones'}})
    .then(function (foundCategory) {
      Phones = foundCategory;
    });
  Category.findOne({where: {name: 'Video'}})
    .then(function (foundCategory) {
      Video = foundCategory;
    });

  return Promise.all([
    Product.create({
      title: "iRazor",
      description: "This may look like your granny's flip-phone, but inside it's running the latest iOS",
      specs: '{"screensize":"2 in.","weight":"95g","quality":"primo"}',
      price: 599.99,
      quantity: 17,
      releaseDate: '2003',
      imageUrl: 'http://i-cdn.phonearena.com/images/phones/4573-large/Motorola-RAZR-V3-0.jpg'
    })
      .then(function (newProduct) {
        newProduct.addCategory(Phones);
      })
      .catch(function (err) {
        console.err(err);
      }),

    Product.create({
      title: "Rich Grandpa",
      description: "This may look like your grandfather's clock, but inside is a lot of unnecessary platinum, some bitcoins, and a quad-core processor",
      specs: '{"height":"4 ft","weight":"60kg","quality":"primo"}',
      price: 8000,
      quantity: 3,
      releaseDate: '1656',
      imageUrl: 'http://www.todayifoundout.com/wp-content/uploads/2012/09/grandfather-clock.jpg'
    })
      .then(function (newProduct) {
        newProduct.addCategory(Clocks);
      })
      .catch(function (err) {
        console.err(err);
      }),

    Product.create({
      title: "Steampunk Watch Phone",
      description: "The internals of this steampunk watch phone combine the state-of-the-art components of the Apple watch AND iPhone 7",
      specs: '{"material":"various metals","weight":"200g","quality":"swag"}',
      price: 1500,
      quantity: 12,
      releaseDate: '1874',
      imageUrl: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/21b2fe19036859.562d3e03e799d.jpg'
    })
      .then(function (newProduct) {
        newProduct.addCategory([Phones, Clocks]);
      })
      .catch(function (err) {
        console.err(err);
      }),

    Product.create({
      title: 'Retro Phone',
      description: 'This phone has a classic look.',
      specs: '{"material":"various metals","weight":"200g","quality":"swag"}',
      price: 80,
      quantity: 10,
      releaseDate: '1980',
      imageUrl: 'http://www.retroplanet.com/mm5/graphics/00000006/23914_main.jpg'
    })
      .then(function (newProduct) {
        newProduct.addCategory(Clocks);
      })
      .catch(function (err) {
        console.err(err);
      }),

    Product.create({
      title: 'Model T',
      description: 'Great car',
      specs: '{"material":"various metals","weight":"200g","quality":"swag"}',
      price: 3000,
      quantity: 5,
      releaseDate: '1908',
      imageUrl: 'http://assets.blog.hemmings.com/wp-content/uploads/2011/03/model-t.jpg'
    })
      .then(function (newProduct) {
        newProduct.addCategory(Cars);
      })
      .catch(function (err) {
        console.err(err);
      }),

    Product.create({
      title: 'Retro Tv',
      description: 'Old looking TV',
      specs: '{"material":"various metals","weight":"200g","quality":"swag"}',
      price: 200,
      quantity: 5,
      releaseDate: '1908',
      imageUrl: 'http://graphicdesign-blog.com/wp-content/uploads/2012/02/Serie_1_Retro_TV_Front.jpg'
    })
      .then(function (newProduct) {
        newProduct.addCategory(Video);
      })
      .catch(function (err) {
        console.err(err);
      })

  ]);

};

var seedReviews = function () {
  var reviews = [
    {
      stars: 4,
      content: "This is great!",
      userId: 2
    },
    {
      stars: 3,
      content: "This is okay...",
      userId: 1
    },
    {
      stars: 5,
      content: "This makes my life!!",
      userId: 3
    },
    {
      stars: 1,
      content: "I regret this heavily.",
      userId: 4
    },
    {
      stars: 4,
      content: "Brings back good memories :)",
      userId: 6
    },
    {
      stars: 2,
      content: "Could be better :(",
      userId: 5
    }
  ]

  var creatingReviews = reviews.map(function (revObj) {
    return Review.create(revObj);
  });

  return Promise.all(creatingReviews);
}


db.sync({force: true})
  .then(function () {
    return seedUsers();
  })
  .then(function () {
    return seedProducts();
  })
  .then(function () {
    return seedReviews();
  })
  .then(function () {
    console.log(chalk.green('Seed successful!'));
    process.exit(0);
  })
  .catch(function (err) {
    console.error(err);
    process.exit(1);
  });

