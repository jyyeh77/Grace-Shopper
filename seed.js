'use strict';
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
var Category = db.model('category');
var Order = db.model('order');
var Review = db.model('review');
var Cart = db.model('cart');
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
      password: 'FSAB',
      isAdmin: true
    },
    {
      email: 'kfuchs24@gmail.com',
      password: '123B',
      isAdmin: true
    },
    {
      email: 'j@osh.com',
      password: '2flyB',
      isAdmin: true
    },
    {
      email: 'd@n.com',
      password: '3fly',
      isAdmin: true
    }
  ];

  var creatingUsers = users.map(function (userObj) {
    return User.create(userObj);
  });

  return Promise.all(creatingUsers);

};

var seedCategories = function () {
  var categories = [
    {name: 'Cars', metaCategory: 'Vehicles'},
    {name: 'Submarines', metaCategory: 'Vehicles'},
    {name: 'Phones', metaCategory: 'Electronics'},
    {name: 'TV', metaCategory: 'Electronics'},
    {name: 'Clocks', metaCategory: 'Electronics'},
    {name: 'Computers', metaCategory: 'Electronics'},
    {name: 'Radios', metaCategory: 'Electronics'}
  ]

  var creatingCategories = categories.map(function (catObj) {
    return Category.create(catObj)
  })

  return Promise.all(creatingCategories)

}



var seedProducts = function () {
  var Clocks, Cars, Phones, TV, Submarines, Computers, Radios;

  Category.findOne({where: {name: 'Clocks'}})
    .then(function (foundCategory) {
      Clocks = foundCategory;
    });
  Category.findOne({where: {name: 'Cars'}})
    .then(function (foundCategory) {
      Cars = foundCategory;
    });
  Category.findOne({where: {name: 'Submarines'}})
    .then(function (foundCategory) {
      Submarines = foundCategory;
    });
  Category.findOne({where: {name: 'Phones'}})
    .then(function (foundCategory) {
      Phones = foundCategory;
    });
  Category.findOne({where: {name: 'TV'}})
    .then(function (foundCategory) {
      TV = foundCategory;
    });
  Category.findOne({where: {name: 'Computers'}})
    .then(function (foundCategory) {
      Computers = foundCategory;
    });
  Category.findOne({where: {name: 'Radios'}})
    .then(function (foundCategory) {
      Radios = foundCategory;
    });

  return Promise.all([
    Product.create({
      title: "iRazr",
      description: "Relive the glory days of your youth (because we all peaked in middle school) with this hot pink Razr that runs the latest version of iOS. Bluetooth earbuds not included.",
      specs: '{"screensize":"2 in.","weight":"95g","quality":"primo"}',
      price: 599.99,
      quantity: 17,
      creationDate: '2005',
      imageUrl: '/product_images/Razr-xs.png'
    })
      .then(function (newProduct) {
        newProduct.addCategory(Phones)
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
      creationDate: '1750',
      imageUrl: '/product_images/rich-grandpa-xs.png'
    })
      .then(function (newProduct) {
        newProduct.addCategory(Clocks)
      })
      .catch(function (err) {
        console.err(err);
      }),

    Product.create({
      title: "Smart Pocket Watch",
      description: "Apple Watch meets 19th-century antique. Read emails, monitor your heart rate, and look like an absolute boss doing it.",
      specs: '{"material":"various metals","weight":"200g","quality":"swag"}',
      price: 1500,
      quantity: 12,
      creationDate: '1874',
      imageUrl: '/product_images/smart-pocketwatch-xs.png'
    })
      .then(function (newProduct) {
        newProduct.addCategory([Phones, Clocks]);
      })
      .catch(function (err) {
        console.err(err);
      }),

    Product.create({
      title: 'Rotary Smartphone',
      description: 'Now grandma can get all the benefits of a smartphone without ever having to learn how to use a touchscreen.',
      specs: '{"material":"various metals","weight":"200g","quality":"swag"}',
      price: 80,
      quantity: 10,
      creationDate: '1970',
      imageUrl: '/product_images/rotary-smartphone-xs.png'
    })
      .then(function (newProduct) {
        newProduct.addCategory(Phones);
      })
      .catch(function (err) {
        console.err(err);
      }),

    Product.create({
      title: 'Model T',
      description: 'Great car',
      specs: '{"material":"various metals","weight":"200g","quality":"swag"}',
      price: 30000,
      quantity: 5,
      creationDate: '1908',
      imageUrl: '/product_images/model-t-xs.png'
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
      creationDate: '1965',
      imageUrl: '/product_images/retro-tv-alt-xs.png'
    })
      .then(function (newProduct) {
        newProduct.addCategory(TV);
      })
      .catch(function (err) {
        console.err(err);
      }),

    Product.create({
      title: 'Steam Sub',
      description: 'This submarine looks like it\'s over 100 years old... because it is! We overhauled the engine and interior, but decided not to interfere with the \'Vintage Chic\' aesthetic of the aging exterior. Looks great! Functionally, your mileage may vary.',
      specs: '{"material":"various metals","weight":"2000kg","quality":"questionable"}',
      price: 80000,
      quantity: 1,
      creationDate: '1889',
      imageUrl: '/product_images/submarine.jpg'
    })
      .then(function (newProduct) {
        newProduct.addCategory(Submarines);
      })
      .catch(function (err) {
        console.err(err);
      }),

    Product.create({
      title: 'Vintage Desktop',
      description: 'Help Gramps ease into the modern era with a desktop that reminds him of the good old days when he had 2/3 of his teeth. And fear not, it comes with macOs Sierra pre-ins',
      specs: '{"material":"polycarbonate","weight":"18kg","quality":"vintage"}',
      price: 1400,
      quantity: 32,
      creationDate: '1996',
      imageUrl: '/product_images/microbee-computer.jpg'
    })
      .then(function (newProduct) {
        newProduct.addCategory(Computers);
      })
      .catch(function (err) {
        console.err(err);
      }),

    Product.create({
      title: 'Grammy\'s Gramophone',
      description: 'She\'ll be so excited to unwrap this vintage-looking music player! Until she realizes it only plays .FLAC and .WAV format audio files. Can also stream podcasts and XM radio (subscription required).',
      specs: '{"material":"woodchips, uranium","weight":"14kg","quality":"flawless"}',
      price: 999.99,
      quantity: 42,
      creationDate: '1901',
      imageUrl: '/product_images/gramophone.jpg'
    })
      .then(function (newProduct) {
        newProduct.addCategory(Radios);
      })
      .catch(function (err) {
        console.err(err);
      })



  ]);

};

var seedReviews = function () {
  var reviews = [
    {
      stars: '4',
      content: "This is great!",
      userId: 2,
      productId: 1
    },
    {
      stars: '3',
      content: "This is okay...",
      userId: 1,
      productId: 4
    },

    {
      stars: '5',
      content: "Incredible product. I bought one for all the old people in my life. Love the red color, so fun!",
      userId: 2,
      productId: 4
    },

    {
      stars: '1',
      content: "Couldn't figure it out. Meh. Going back to my iPhone 6.",
      userId: 3,
      productId: 4
    },

    {
      stars: '5',
      content: "This makes my life!!",
      userId: 3,
      productId: 2
    },
    {
      stars: '1',
      content: "I regret this heavily.",
      userId: 4,
      productId: 3
    },
    {
      stars: '4',
      content: "Brings back good memories :)",
      userId: 6,
      productId: 5
    },
    {
      stars: '2',
      content: "Could be better :(",
      userId: 5,
      productId: 6
    }
  ]

  var creatingReviews = reviews.map(function (revObj) {
    return Review.create(revObj);
  });

  return Promise.all(creatingReviews);
}


var seedOrders = function () {

  var orders = [
    {
      status: 'Pending',
      userId: 1,
      products: [
        {
          title: "iRazr",
          description: "Relive the glory days of your youth (because we all peaked in middle school) with this hot pink Razr that runs the latest version of iOS. Bluetooth earbuds not included.",
          specs: '{"screensize":"2 in.","weight":"95g","quality":"primo"}',
          price: 599.99,
          quantity: 1,
          quantityOrdered: 3,
          creationDate: '2005',
          imageUrl: '/product_images/Razr-xs.png'
        },

        {
          title: "Rich Grandpa",
          description: "This may look like your grandfather's clock, but inside is a lot of unnecessary platinum, some bitcoins, and a quad-core processor",
          specs: '{"height":"4 ft","weight":"60kg","quality":"primo"}',
          price: 8000,
          quantityOrdered: 2,
          creationDate: '1656',
          imageUrl: 'http://www.todayifoundout.com/wp-content/uploads/2012/09/grandfather-clock.jpg'
        }
      ]
    },

    {
      status: 'Pending',
      userId: 2,
      products: [
        {
          title: "Smart Pocket Watch",
          description: "Apple Watch meets 19th-century antique. Read emails, monitor your heart rate, and look like an absolute boss doing it.",
          specs: '{"material":"various metals","weight":"200g","quality":"swag"}',
          price: 1500,
          quantityOrdered: 1,
          creationDate: '1874',
          imageUrl: '/product_images/smart-pocketwatch-xs.png'
        }
      ]
    },

    {
      status: 'Completed',
      userId: 3,
      products: [
        {
          title: 'Rotary Smartphone',
          description: 'Now grandma can get all the benefits of a smartphone without ever having to learn how to use a touchscreen.',
          specs: '{"material":"various metals","weight":"200g","quality":"swag"}',
          price: 80,
          quantityOrdered: 1,
          creationDate: '1970',
          imageUrl: '/product_images/rotary-smartphone-xs.png'
        }
      ]
    },

    {
      status: 'Shipped',
      userId: 4,
      products: [
        {
          title: "Smart Pocket Watch",
          description: "Apple Watch meets 19th-century antique. Read emails, monitor your heart rate, and look like an absolute boss doing it.",
          specs: '{"material":"various metals","weight":"200g","quality":"swag"}',
          price: 1500,
          quantityOrdered: 1,
          creationDate: '1874',
          imageUrl: '/product_images/smart-pocketwatch-xs.png'
        }
      ]
    },

    {
      status: 'Cancelled',
      userId: 5,
      products: [
        {
          title: 'Model T',
          description: 'Great car',
          specs: '{"material":"various metals","weight":"200g","quality":"swag"}',
          price: 3000,
          quantityOrdered: 1,
          creationDate: '1908',
          imageUrl: 'http://assets.blog.hemmings.com/wp-content/uploads/2011/03/model-t.jpg'
        }
      ]
    },

    {
      status: 'Completed',
      userId: 6,
      products: [
        {
          title: 'Model T',
          description: 'Great car',
          specs: '{"material":"various metals","weight":"200g","quality":"swag"}',
          price: 3000,
          quantityOrdered: 1,
          creationDate: '1908',
          imageUrl: 'http://assets.blog.hemmings.com/wp-content/uploads/2011/03/model-t.jpg'
        }
      ]
    },

    {
      status: 'Shipped',
      userId: 2,
      products: [
        {
          title: 'Model T',
          description: 'Great car',
          specs: '{"material":"various metals","weight":"200g","quality":"swag"}',
          price: 3000,
          quantityOrdered: 5,
          creationDate: '1908',
          imageUrl: 'http://assets.blog.hemmings.com/wp-content/uploads/2011/03/model-t.jpg'
        },
        {
          title: 'Retro Tv',
          description: 'Old looking TV',
          specs: '{"material":"various metals","weight":"200g","quality":"swag"}',
          price: 200,
          quantityOrdered: 1,
          creationDate: '1965',
          imageUrl: '/product_images/retro-tv-alt-xs.png'
        }
      ]
    },

    {
      status: 'Shipped',
      userId: 1,
      products: [
        {
          title: 'Rich Grandpa',
          description: "This may look like your grandfather's clock, but inside is a lot of unnecessary platinum, some bitcoins, and a quad-core processor",
          specs: '{"height":"4 ft","weight":"60kg","quality":"primo"}',
          price: "Rich Grandpa",
          quantityOrdered: 1,
          creationDate: '1656',
          imageUrl: 'http://www.todayifoundout.com/wp-content/uploads/2012/09/grandfather-clock.jpg'
        }

      ]
    },

    {
      status: 'Cancelled',
      userId: 3,
      products: [
        {
          title: 'Rotary Smartphone',
          description: 'Now grandma can get all the benefits of a smartphone without ever having to learn how to use a touchscreen.',
          specs: '{"material":"various metals","weight":"200g","quality":"swag"}',
          price: 80,
          quantityOrdered: 2,
          creationDate: '1970',
          imageUrl: '/product_images/rotary-smartphone-xs.png'
        }

      ]
    },

    {
      status: 'Shipped',
      userId: 4,
      products: [
        {
          title: "Smart Pocket Watch",
          description: "Apple Watch meets 19th-century antique. Read emails, monitor your heart rate, and look like an absolute boss doing it.",
          specs: '{"material":"various metals","weight":"200g","quality":"swag"}',
          price: 1500,
          quantityOrdered: 1,
          creationDate: '1874',
          imageUrl: '/product_images/smart-pocketwatch-xs.png'
        }

      ]
    },

    {
      status: 'Completed',
      userId: 6,
      products: [
        {
          title: 'Retro Tv',
          description: 'Old looking TV',
          specs: '{"material":"various metals","weight":"200g","quality":"swag"}',
          price: 200,
          quantityOrdered: 2,
          creationDate: '1965',
          imageUrl: '/product_images/retro-tv-alt-xs.png'
        }
      ]
    },

    {
      status: 'Completed',
      userId: 1,
      products: [
        {
          title: "iRazr",
          description: "Relive the glory days of your youth (because we all peaked in middle school) with this hot pink Razr that runs the latest version of iOS. Bluetooth earbuds not included.",
          specs: '{"screensize":"2 in.","weight":"95g","quality":"primo"}',
          price: 599.99,
          quantity: 17,
          creationDate: '2005',
          imageUrl: '/product_images/Razr-xs.png'
        }

      ]
    },

    {
      status: 'Pending',
      userId: 6,
      products: [
        {
          title: "iRazr",
          description: "Relive the glory days of your youth (because we all peaked in middle school) with this hot pink Razr that runs the latest version of iOS. Bluetooth earbuds not included.",
          specs: '{"screensize":"2 in.","weight":"95g","quality":"primo"}',
          price: 599.99,
          quantity: 1,
          creationDate: '2005',
          imageUrl: '/product_images/Razr-xs.png'
        }
      ]
    },

    {
      status: 'Pending',
      userId: 5,
      products: [
        {
          title: 'Rotary Smartphone',
          description: 'Now grandma can get all the benefits of a smartphone without ever having to learn how to use a touchscreen.',
          specs: '{"material":"various metals","weight":"200g","quality":"swag"}',
          price: 80,
          quantityOrdered: 2,
          creationDate: '1970',
          imageUrl: '/product_images/rotary-smartphone-xs.png'
        }
      ]
    },

    {
      status: 'Pending',
      userId: 1,
      products: [
        {
          title: 'Rotary Smartphone',
          description: 'Now grandma can get all the benefits of a smartphone without ever having to learn how to use a touchscreen.',
          specs: '{"material":"various metals","weight":"200g","quality":"swag"}',
          price: 80,
          quantityOrdered: 2,
          creationDate: '1970',
          imageUrl: '/product_images/rotary-smartphone-xs.png'
        },
        {
          title: "iRazr",
          description: "Relive the glory days of your youth (because we all peaked in middle school) with this hot pink Razr that runs the latest version of iOS. Bluetooth earbuds not included.",
          specs: '{"screensize":"2 in.","weight":"95g","quality":"primo"}',
          price: 599.99,
          quantity: 17,
          creationDate: '2005',
          imageUrl: '/product_images/Razr-xs.png'
        }
      ]
    }
  ]

  // stringifies all products in each order to put into Sequelize Array
  orders.forEach(orderObj => {
    orderObj.products = orderObj.products.map(product => {
      return JSON.stringify(product);
    })
  })
  var creatingOrders = orders.map(function (orderObj) {
    return Order.create(orderObj)
  })

  return Promise.all(creatingOrders)
}


var seedCart = function () {
  let cartOne = {
    itemCounts: {
      2 : 1,
      3 : 2
    },
    userId: 3
  }
  let createCart = Cart.create(cartOne);
  let productOne = Product.findById(2);
  let productTwo = Product.findById(3);
  return Promise.all([productOne, productTwo, createCart])
    .spread((prod1, prod2, createdCart) => {
      return createdCart.addProducts([prod1, prod2])
    })
}

db.sync({force: true})
  .then(function () {
    return Promise.all([seedUsers(), seedCategories()]);
  })
  .then(function () {
    return seedProducts();
  })
  .then(function () {
    return seedReviews();
  })
  .then(function () {
    return seedOrders();
  })
  .then(function () {
    return seedCart();
  })
  .then(function () {
    console.log(chalk.green('Seed successful!'));
    process.exit(0);
  })
  .catch(function (err) {
    console.error(err);
    process.exit(1);
  });

