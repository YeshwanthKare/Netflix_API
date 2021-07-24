const express = require("express");
const app = express();
// const port = 3000;
const mongoose = require('mongoose');
const dotenv = require("dotenv").config()
const jwt = require('jsonwebtoken');
const { Schema } = mongoose;
const cors = require('cors');

app.use(express.json());
app.use(cors());



app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

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

const wishListSchema = new Schema(
    {
        user: { 
            type: Schema.Types.ObjectId, 
            ref: 'Users'
        },
        movieId: Number,
        backdrop_path: String,
        title: String
    }
)

wishListSchema.index({ user: 1, movieId: 1 }, { unique: true })

const Wishlist = mongoose.model('Wishlist', wishListSchema)

function authenticateToken(req, res, next){
    const authHeaderToken = req.headers['authorization']

    if(!authHeaderToken) return res.sendStatus(401)

    jwt.verify(authHeaderToken, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)

    req.user = user
    console.log(user)

    next()
})
}

app.post('/wishlist', authenticateToken, (req, res) => {
    
    const newWishListItem = new Wishlist({
        user: req.user.id,
        movieId: req.body.movieId,
        backdrop_path: req.body.backdrop_path,
        title: req.body.title
    }) 

    console.log(newWishListItem)


    newWishListItem.save((err, wishList) => {
        if(err){
            res.send(400,{
                status: err
            })
        }else{
            res.send({
                wishList: wishList,
                status: "WishList Saved"
            })
        }
    })
})


app.get('/wishlist', authenticateToken, (req, res) => {
    Wishlist.find({}, (err, wishlist) => {
        if(err){
            res.send(400,{
                status: err
            })
        }else{
            res.send({
                results: wishlist
            })
        }
    })
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

app.get("/register", async(req, res) => {
    User.find({}, (err, user) => {
        if(err){
            res.send(err)
        }else {
            res.send(user)
        }
    })
})

function generateAccessToken(user){
    const payload = {
        id: user.id,
        name:user.name
    }
    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '7200s' })
}


app.post('/login', (req, res) => {
    const password = req.body.password;
    const email = req.body.email;
    User.findOne({ email: email, password: password }, (err, user) => {
        if(user){
            const token = generateAccessToken(user)
            console.log("token:",token)
            res.send({
                status: "valid",
                token: token
            })
            // console.log(user)
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

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`App listening to http://localhost:${PORT}`)
})

