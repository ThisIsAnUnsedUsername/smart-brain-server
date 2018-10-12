const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg', //pg mean post sql
  connection: {
    host: '127.0.0.1', //address for local
    user: 'postgres', //user name
    password: 'abce9875', //password
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
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  //res.send('signin');
  //res.json('signin'); //this commend send stringify json
  //Load hash from your password DB.
  // bcrypt.compare(
  //   'apple',
  //   '$2a$10$E36fkd.x1u5em24XkQDemOPC9fnicN/USIefXTWuD2LueJA7NUhfi',
  //   function(err, res) {
  //     // res == true
  //     console.log('first guess', res);
  //   }
  // );
  // bcrypt.compare(
  //   'veggies',
  //   '$2a$10$E36fkd.x1u5em24XkQDemOPC9fnicN/USIefXTWuD2LueJA7NUhfi',
  //   function(err, res) {
  //     // res = false
  //     console.log('2nd guess', res);
  //   }
  // );
  // if (
  //   req.body.email === database.users[0].email &&
  //   req.body.password === database.users[0].password
  // ) {
  //   res.json(database.users[0]);
  // } else {
  //   res.status(400).json('error loginggin in');
  // }
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select('*') //need to always return
          .from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json('unable to get user'));
      } else {
        res.status(400).json('wrong credentials');
      }
    })
    .catch(err => res.status(400).json('wrong credentials'));
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password); //sync method
  // bcrypt.hash(password, null, null, function(err, hash) {//async method
  //   // Store hash in your password DB.
  //   console.log(hash);
  // });
  // database.users.push({
  //   id: '125',
  //   name: name,
  //   email: email,
  //   entries: 0,
  //   joined: new Date()
  // });
  db.transaction(trx => {
    //transaction make sure all operations are either success or fail
    trx
      .insert({ hash: hash, email: email })
      .into('login')
      .returning('email')
      .then(loginmail => {
        return trx('users') //use trx instead of db
          .returning('*') //return the data after manage to insert, can place anywhere before the response
          .insert({
            //no need json stingify between server and database
            email: loginmail[0],
            name: name,
            joined: new Date()
          })

          .then(user => {
            res.json(user[0]);
          }); //pick first because it return as one element array
      })
      .then(trx.commit) //commit if above no error
      .catch(trx.rollback); //roolback if error
  }).catch(err => {
    res.status(400).json('unable to register');
  });

  //res.json(database.users[database.users.length - 1]); //always remember to put response or else broswer will hang
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params; //this param is the :id or anything behind profile/:
  // database.users.forEach(user => {
  //   if (user.id === id) {
  //     found = true;
  //     return res.json(user);
  //   } else {
  //   }
  // });
  db.select('*') //select all column
    .from('users')
    .where('id', id) //.where({id})also work
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('error getting user');
      }
    });
  // if (!found) {
  //   res.json('no such user').status(404);
  // }
});

app.put('/image', (req, res) => {
  const { id } = req.body; //this param is the :id or anything behind profile/
  // let found = false;
  // database.users.forEach(user => {
  //   if (user.id === id) {
  //     found = true;
  //     user.entries++;
  //     return res.json(user.entries);
  //   } else {
  //   }
  // });
  // if (!found) {
  //   res.json('no such user').status(404);
  // }
  db('users')
    .where('id', '=', id)
    .returning('entries')
    .increment('entries', 1)

    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'));
});

app.listen(3000, () => console.log('app is running on port 3000'));
