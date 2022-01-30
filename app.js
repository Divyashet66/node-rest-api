const express = require("express");
const dotenv = require("dotenv")
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
const app = express();
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');


dotenv.config();

mongoose.connect('mongodb://localhost:27017/social', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
});

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/post', postRoute);

app.listen(3000, () => {
    console.log("Backend server is running!");
})