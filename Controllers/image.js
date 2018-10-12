const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: '019ad8a0976145d895e6bb075a3de5e1'
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(400).json('unable to work with API');
    });
};

const handleImage = (req, res, db) => {
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
};

module.exports = { handleImage, handleApiCall };
