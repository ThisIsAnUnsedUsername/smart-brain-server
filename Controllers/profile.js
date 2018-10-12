const handleProfileGet = (req, res, db) => {
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
};

module.export = { handleProfileGet };
