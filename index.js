const express = require('express');  // Import expressjs
const bodyParser = require('body-parser');  // Import body-parser
const mongoose = require('mongoose');  // Import mongoose

const port = process.env.PORT || 3000;
const app = express();  // Create expressjs object

// Connect MongoDb
mongoose.connect('mongodb://0.0.0.0:27017/softGlowDB');  // Local
//mongoose.connect('mongodb+srv://alialsaeed:<AliAlsaeed>@cluster0.8xaqegp.mongodb.net/?retryWrites=true&w=majority');
// Check connection is established
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDb connected');
});

// middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use('/uploads', express.static('uploads'));  // Make uploads folder to make it accessible from browser
app.use(express.json());  // For Json Data

// User Route
const userRoute = require('./routes/user');
app.use('/user', userRoute); 

// Blog Post Route
const postRoute = require('./routes/post');
app.use('/post', postRoute);

// Blog Posts Route
const postsRoute = require('./routes/posts');
app.use('/posts', postsRoute);

// Profile Route
const profileRoute = require('./routes/profile');
app.use('/profile', profileRoute);

app.route('/').get((req, res) => res.json('Hello World!'));
// app.listen(port, () => console.log(`Your server is running on port ${port}`));

// Added 0.0.0.0 to run server from local ip address
app.listen(port, '0.0.0.0', () => console.log(`Your server is running on port ${port}`));