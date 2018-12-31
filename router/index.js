const passport = require('passport');
const DataBase = require('../db');

function setRoutes(app) {
    app
        .get('/', (req, res) => res.render('pages/index', { username: null }))

        .get('/login', (req, res) => res.render('pages/login'))
        .get('/signup', (req, res) => res.render('pages/signup'))

        .get('/profile', authMiddleware(), (req, res) => {
            res.render('pages/index', { username: req.user && req.user.username || null });
        })

        .post('/login',
            passport.authenticate('local', {
                successRedirect: '/profile',
                failureRedirect: '/login'
            }))

        .post('/signup', (req, res) => {
            const {
                username,
                password
            } = req.body;

            DataBase.addUser({ username, password }, req, res);
        })

        // .get('/users', (req, res) => {
        //     const getUsers = DataBase.getUsers();

        //     res.json({ getUsers });
        // })

        // .get('/users/:username', (req, res) => {
        //     const UserModel = require('../db/models/User');
        //     const username = req.params.username;
        //     const userId = DataBase.getUserId({ username });

        //     UserModel.findUser(username);
        //     UserModel.addUser(username, '1234');

        //     res.send('ok');
        // })
}

function authMiddleware() {
    return (req, res, next) => {
        if (!req.isAuthenticated()) { res.redirect('/login'); }
        return next();
    }
}

module.exports = setRoutes;
