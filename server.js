const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./Controllers/register');
const signin = require('./Controllers/signin');
const profile = require('./Controllers/profile');
const image = require('./Controllers/image');

const db = knex({
  client: 'pg', //pg mean post sql
  connection: {
    host: 'postgresql-acute-89047', //address for local
    user: 'postgres', //user name
    password: '', //password
    database: 'smart-brain'
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors()); //to overcome google security issue

// const database = {
//   users: [
//     {
//       id: '123',
//       name: 'John',
//       email: 'john@gmail.com',
//       password: 'cookies',
//       entries: 0,
//       joined: new Date()
//     },
//     {
//       id: '124',
//       name: 'Sally',
//       email: 'sally@gmail.com',
//       password: 'banana',
//       entries: 0,
//       joined: new Date()
//     }
//   ],
//   login: [
//     {
//       id: '987',
//       hash: '',
//       email: 'john@gmail.com'
//     }
//   ]
// };

app.get('', (req, res) => {
  res.send('database.users');
});

app.post('/signin', signin.handleSignin(db, bcrypt)); //(req,res) get passed in it

app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt); //can pass like this, no need import at register.js, this is called dependency injection
});

app.get('/profile/:id', (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
});

app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res, db);
});
const PORT = process.env.PORT; //can choose anyname for environment variable, for this case it is PORT
//capitalize name for environment variable
app.listen(
  PORT || 3000,
  () => console.log(`app is running on port ${PORT || 3000}`) //|| can use to choose value over undefined value
);
