require('dotenv').config();

const express = require('express'),
    bodyparser = require('body-parser'),
    cookieparser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    MongoDBStore = require('connect-mongodb-session')(session),
    path = require('path'),
    PORT = process.env.PORT || 5000,
    setRoutes = require('./router'),
    setAuth = require('./router/auth');

const app = express(),
    store = new MongoDBStore({ uri: process.env.DB_URL, collection: 'sessions' });

store.on('error', (f) => f);

app
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .use(bodyparser.json())
    .use(bodyparser.urlencoded({ extended: false }))
    .use(cookieparser())
    .use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }))
    .use(passport.initialize())
    .use(passport.session())
    .use(require('express-session')({
        secret: process.env.SESSION_SECRET,
        cookie: { maxAge: 604800000 },
        store, resave: true, saveUninitialized: true
    }));

setAuth(passport);
setRoutes(app);

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))
