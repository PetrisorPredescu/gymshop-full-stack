const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { Double } = require('mongodb');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const db = require('../config/keys').mongoURI;
var ObjectId = require('mongodb').ObjectID;


// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('dashboard'));

// Dashboard
router.get('/dashboard', (req, res) => //, ensureAuthenticated
  res.render('dashboard', {
    user: req.user
  })
);
// Contact page
router.get('/contact', (req, res) => //, ensureAuthenticated
  res.render('contact', {
    user: req.user
  })
);
// products page
router.get('/products', (req, res) => //, ensureAuthenticated

  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (err) { console.log(err) } else {
      db.collection("products").find().sort({ "price": 1 }).toArray(function (err, result) {
        if (err) { console.log(err) } else {
          res.render('products', {
            user: req.user,
            products: result
          })
        }
      })
    }
  }))

// products submit page
router.post('/products', (req, res) => //, ensureAuthenticated

  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    var { name, qty, customer, address, email, cardnumber, expirydate, cvv } = req.body;
    if (err) { console.log(err) } else {

      db.collection("orders").insertOne({
        "name": name,
        "qty": qty,
        "customer": customer,
        "address": address,
        "email": email,
        "cardnumber": cardnumber,
        "expirydate": expirydate,
        "cvv": cvv
      });

      db.collection("products").find().sort({ "price": 1 }).toArray(function (err, result) {
        if (err) { console.log(err) } else {
          res.render('products', {
            user: req.user,
            products: result,
            success_msg: "Thank you for your order. It will be shipped in a couple of days."
          })
        }
      })
    }
  })
)



// Contact post page
router.post('/contact', (req, res) =>
  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    var { name, email, message } = req.body;
    if (err) { console.log(err) } else {
      db.collection("contacts").insertOne({
        "name": name,
        "email": email,
        "message": message
      });
      res.render('contact', {
        user: req.user,
        success_msg: "Your message has been successfully sent! Thank you!"
      })

    }
  }))


// product manager page
router.get('/product_manager', (req, res) => //, ensureAuthenticated

  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (err) { console.log(err) } else {
      db.collection("products").find().sort({ "price": 1 }).toArray(function (err, result) {
        if (err) { console.log(err) } else {
          res.render('product_manager', {
            user: req.user,
            products: result
          })
        }
      })
    }
  }))

// post products manager page update
router.post('/product_manager1', (req, res) => //, ensureAuthenticated

  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    var { product_id, name, price, photo } = req.body;
    if (err) { console.log(err) } else {
      delete req.body._id;
      db.collection("products").updateOne({ _id: new ObjectId(product_id) }, { $set: { "price": price, "name": name, "photo": photo } });  // yes i know its deprecated!!! but still works! :D

      db.collection("products").find().sort({ "price": 1 }).toArray(function (err, result) {
        if (err) { console.log(err) } else {
          res.render('product_manager', {
            user: req.user,
            products: result,
            success_msg: "Product updated!"
          })
        }
      })
    }
  })
)
// post products manager page insert
router.post('/product_manager2', (req, res) => //, ensureAuthenticated

  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    var { product_id, name, price, photo } = req.body;
    if (err) { console.log(err) } else {

      db.collection("products").insertOne({ "price": Double(price), "name": name, "photo": photo });

      db.collection("products").find().sort({ "price": 1 }).toArray(function (err, result) {
        if (err) { console.log(err) } else {
          res.render('product_manager', {
            user: req.user,
            products: result,
            success_msg: "Product updated!"
          })
        }
      })
    }
  })
)
// post products manager page delete
router.post('/product_manager3', (req, res) => //, ensureAuthenticated

  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    var { product_id, name, price } = req.body;
    if (err) { console.log(err) } else {

      db.collection("products").deleteOne({ _id: new ObjectId(product_id) });

      db.collection("products").find().sort({ "price": 1 }).toArray(function (err, result) {
        if (err) { console.log(err) } else {
          res.render('product_manager', {
            user: req.user,
            products: result,
            success_msg: "Product updated!"
          })
        }
      })
    }
  })
)

// products page
router.get('/orders_manager', (req, res) => //, ensureAuthenticated

  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (err) { console.log(err) } else {
      db.collection("orders").find().toArray(function (err, result) {
        if (err) { console.log(err) } else {
          res.render('orders_manager', {
            user: req.user,
            orders: result
          })
        }

      })
    }
  }))

// my profile page get
router.get('/myprofile', ensureAuthenticated, (req, res) => //, ensureAuthenticated
  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (err) { console.log(err) } else {
      db.collection("users").find({ "email": req.user.email }).toArray(function (err, result) {
        if (err) { console.log(err) } else {
          res.render('myprofile', {
            user: req.user,
            profile: result[0]
          })
        }

      })
    }
  }))
// myprofile_update page post
router.post('/myprofile_update', ensureAuthenticated, (req, res) =>
  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    var { userid, name, email, password } = req.body;
    if (err) { console.log(err) } else {

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hashedPassword) => {
          password = hashedPassword;
          db.collection("users").updateOne({ _id: new ObjectId(userid) }, { $set: { "email": email, "name": name, "password": hashedPassword } }).then(
            db.collection("users").find({ "email": req.user.email }).toArray(function (er, result) {
              if (err) { console.log(err) } else {
                res.render('myprofile', {
                  user: req.user,
                  profile: result[0]
                })
              }
            })
          )
        })
      })
    }
  }))
// myprofile_delete page post
router.post('/myprofile_delete', ensureAuthenticated, (req, res) =>
  mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    var { userid} = req.body;
    if (err) { console.log(err) } else {
      db.collection("users").deleteOne({ _id: new ObjectId(userid) }).then(
        res.render('dashboard'
      ) )
        

    }
  }))
module.exports = router;
