const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { User, Exercise } = require('./models');

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true })); 
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


mongoose.connect(process.env.MONGO_URL)
.then((result) => {
    console.log('connected to Mongodb');
}).catch((err) => {
    console.error(err);
});


app.get('/api/users', async(req, res) => {
  const allUsers = await User.find();
  return res.json(allUsers);
});

app.post('/api/users', async(req, res) => {
  const username = req.body.username;
  const newUser = new User({ username });
  const insertedUser = await newUser.save();
  return res.json(insertedUser);
});

app.post('/api/users/:_id/exercises', async (req, res) => {
  const id = req.params['_id'];
  const { duration, description } = req.body;
  let date;
  if (req.body.date) {
    date = new Date(req.body.date);
  } else {
    date = new Date();
  }

  const user = await User.findById(id);
  const newExercise = new Exercise({ user, description, duration, date });
  const insertedExercise = await newExercise.save();
  console.log(insertedExercise);
  return res.json({
    _id: id,
    username: user.username,
    date: date.toDateString(),
    duration: insertedExercise.duration,
    description: description,
  }); 
});


app.get('/api/users/:_id/logs', async (req, res) => {
  const id = req.params["_id"];
  const user = await User.findById(id);

  const from = req.query.from;
  const to = req.query.to;
  const limit = req.query.limit || 0;
  const search = { user: id};
  if (from || to) {
    search["date"] = { };
    if (to) {
      search["date"]["$lt"] = to;
    }
    if (from) {
      search["date"]["$gt"] = from;
    }
  }

  let allExercises = await Exercise.find(search).limit(limit).exec();

  return res.json({
    _id: id,
    username: user.username,
    count: allExercises.length,
    log: allExercises.map(e => ({ 
      description: e.description, 
      duration: e.duration,
      date: e.date.toDateString(),
    }))
  }); 
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});

