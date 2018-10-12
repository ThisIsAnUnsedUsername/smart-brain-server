const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission'); //use return to stop execution
  }
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
};
//res.json(database.users[database.users.length - 1]); //always remember to put response or else broswer will hang

module.exports = { handleRegister: handleRegister };
