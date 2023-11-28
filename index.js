const express = require('express');  // Import expressjs
const bodyParser = require('body-parser');  // Import body-parser
const mongoose = require('mongoose');  // Import mongoose

const port = process.env.PORT || 3000;
const app = express();  // Create expressjs object

// Connect MongoDb
mongoose.connect('mongodb://0.0.0.0:27017/softGlowDB');  // Local
// mongoose.connect('mongodb://user:password@cluster0-shard-00-00.mourb.mongodb.net:27017,cluster0-shard-00-01.mourb.mongodb.net:27017,cluster0-shard-00-02.mourb.mongodb.net:27017/BlogDb?ssl=true&replicaSet=atlas-jdfk2u-shard-0&authSource=admin&retryWrites=true&w=majority');
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

app.route('/').get((req, res) => res.json('Hello World!'));
// app.listen(port, () => console.log(`Your server is running on port ${port}`));

// Added 0.0.0.0 to run server from local ip address
app.listen(port, '0.0.0.0', () => console.log(`Your server is running on port ${port}`));