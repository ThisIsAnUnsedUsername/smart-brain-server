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
const handleSignin = (db, bcrypt) => (req, res) => {
  //(db,bcrypt) function return (req,res) function
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('incorrect form submission'); //use return to stop execution
  }
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select('*') //need to always return
          .from('users')
          .where('email', '=', email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json('unable to get user'));
      } else {
        res.status(400).json('wrong credentials');
      }
    })
    .catch(err => res.status(400).json('wrong credentials'));
};

module.exports = {
  handleSignin: handleSignin
};
