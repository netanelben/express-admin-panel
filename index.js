const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');
const PORT = process.env.PORT || 5000;
const setRoutes = require('./router');
const setAuth = require('./router/auth');

const app = express();
const store = new MongoDBStore({ uri: process.env.DB_URL, collection: 'sessions' });
require('dotenv').config();

store.on('error', (f) => f);

app
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .use(bodyparser.json())
    .use(bodyparser.urlencoded({ extended: false }))
    .use(cookieparser())
    .use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))
    .use(passport.initialize())
    .use(passport.session())
    .use(require('express-session')({
        secret: process.env.SESSION_SECRET,
        cookie: { maxAge: 604800000 },
        store: store,
        resave: false, saveUninitialized: false
    }));

setAuth();
setRoutes(app);

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
