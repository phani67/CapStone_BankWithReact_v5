var express = require ('express');
var app = express();
var cors = require ('cors');
var dal = require('./dal.js');
//import firebase from 'firebase/app';
//import 'firebase/auth';

// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJ-9VSrMfWbN35r8xOpd8ukjYB1JDznbk",
  authDomain: "pjbank2.firebaseapp.com",
  projectId: "pjbank2",
  storageBucket: "pjbank2.appspot.com",
  messagingSenderId: "957266325643",
  appId: "1:957266325643:web:2175692bcec1360e07648e",
  measurementId: "G-D13XGTDQBP"
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

//firebase.initializeApp(firebaseConfig);

//const { getUserByEmail, comparePassword } = require('./dal.js');

//used to serve static files from front_end directory

app.use(express.static('public'));
app.use(express.json()); // Parse JSON request body
app.use(cors());

//create user account using user input data on the url link
app.get('/account/create/:name/:email/:password', function (req,res) {
    //else create user
    dal.create(req.params.name,req.params.email,req.params.password).
    then((user) => {
        console.log(user);
        res.send(user);
    });
});

// Create user account using the UI inputs
app.post('/account/create', function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
  
    // Your dal.create() function implementation here
    dal.create(name, email, password)
      .then((user) => {
        console.log(user);
        res.send(user);
      });
  });

//all accounts
app.get('/account/all', function (req,res) {
    dal.all().
    then((docs) => {
        console.log(docs);
        res.send(docs);
    });
});

/// Login user
app.post('/account/login', async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    try {
        // Retrieve the user from the database using the provided email
        const user = await dal.findOne(email);
    
        if (!user) {
          // User not found, authentication failed
          res.status(401).json({ success: false, message: 'Authentication failed. Please check your email and password.' });
          return;
        }
    
        // Compare the provided password with the hashed password stored in the user object
        const isPasswordMatch = dal.comparePassword(password, user.password);
    
        if (isPasswordMatch) {
          // Successful login
          res.json({ success: true, message: 'Login successful!' });
        } else {
          // Password does not match, authentication failed
          res.status(401).json({ success: false, message: 'Authentication failed. Please check your email and password.' });
        }
      } catch (error) {
        console.error('Error authenticating:', error);
        res.status(500).json({ success: false, message: 'Failed to authenticate. Please try again later. Message from Backend' });
      }


  });

// Deposit amount to user account
app.post('/account/deposit', function (req, res) {
  const email = req.body.email;
  const amount = req.body.amount;

  // Ensure that the amount is a positive number
  if (typeof amount !== 'number' || amount <= 0) {
    res.status(400).json({ success: false, message: 'Invalid deposit amount. Please provide a positive number.' });
    return;
  }

  // Update the user's account balance with the deposit amount
  dal.update(email, amount)
    .then((result) => {
      if (result.value) {
        res.json({ success: true, message: `Successfully deposited ${amount} units into the account.` });
      } else {
        res.status(404).json({ success: false, message: 'User not found. Deposit failed.' });
      }
    })
    .catch((error) => {
      console.error('Error depositing amount:', error);
      res.status(500).json({ success: false, message: 'Failed to deposit amount. Please try again later.' });
    });
});

// Withdraw amount from user account
app.post('/account/withdraw', function (req, res) {
  const email = req.body.email;
  const amount = req.body.amount;

  // Ensure that the amount is a positive number
  if (typeof amount !== 'number' || amount <= 0) {
    res.status(400).json({ success: false, message: 'Invalid withdrawal amount. Please provide a positive number.' });
    return;
  }

  // Update the user's account balance with the negative of the withdrawal amount
  dal.update(email, -amount) // Note the negative sign to subtract the amount
    .then((result) => {
      if (result.value) {
        res.json({ success: true, message: `Successfully withdrew ${amount} units from the account.` });
      } else {
        res.status(404).json({ success: false, message: 'User not found. Withdrawal failed.' });
      }
    })
    .catch((error) => {
      console.error('Error withdrawing amount:', error);
      res.status(500).json({ success: false, message: 'Failed to withdraw amount. Please try again later.' });
    });
});



/*
//all accounts
app.get('/account/all', function (req,res) {
    res.send({
        name: 'peter',
        email: 'peter@mit.edu',
        password: 'secret2'
    });
});
*/


/*
//create user account
app.get('/account/create/:name/:email/:password', function (req,res) {
    res.send({
        name: req.params.name,
        email: req.params.email,
        password: req.params.password
    });
});
*/
/*
//login user
app.get('/account/login/:email/:password', function (req,res) {
    res.send({
        email: req.params.email,
        password: req.params.password
    });
});

*/
var port = 3000;
app.listen(port);
console.log('Running on port: ' + port);