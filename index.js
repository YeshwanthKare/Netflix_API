const express = require("express");
const app = express();
// const port = 3000;
const mongoose = require('mongoose');
const dotenv = require("dotenv").config()
const { Schema } = mongoose;
const cors = require('cors');

app.use(express.json());

app.use(express.static('models'))


mongoose.connect(process.env.dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
.then((res) => {
    // app.listen(port, () => {
    //     console.log(`Listening to http://localhost:${port}`);
    // })
    console.log('DB connected')
})
.catch((err) => {
    console.log(err);
})


const User = mongoose.model('Users', new Schema(
    { 
        name: String,
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }
    }
))


app.use(cors());




app.get('/', (req, res) => {
    res.send('Hello World');
})


app.post('/register', (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    newUser.save((err, user) => {
        if(err){
            console.log(err);
            res.send(400, {
                status: err
            })
        }else{
            res.send({
                status: "registered"
            })
        }
        console.log('all is good')
        console.log(user);
    })
})


app.post('/login', (req, res) => {
    const password = req.body.password;
    const email = req.body.email;
    User.findOne({ email: email, password: password }, (err, user) => {
        if(user){
            res.send({
                status: "valid",
                token: user.id
            })
            console.log(user)
        }else{
            res.status(404).send('Not Found')
            console.log(err);
        }
    })
    // const validUser = {
    //     email: 'newmail@mail.com',
    //     password: 'mypassword'
    // }

    // if(email == validUser.email && password == validUser.password){
    //     res.send({
    //         status: 'Valid'
    //     })
    // }else {
    //     res.status(404).send('Not found');
    // }
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`App listening to http://localhost:3000`)
})

