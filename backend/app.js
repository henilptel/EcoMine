const express = require('express'); 
const session = require('express-session');
const passport = require('passport');

const app = express();
const PORT = 3000;
app.use(express.json());    
app.use(session({
    secret:"coal",
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:60000*60
    }
}))

app.use(passport.initialize());
app.use(passport.session());



app.get('/',(req,res) => {
    res.send("HELLO");
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})