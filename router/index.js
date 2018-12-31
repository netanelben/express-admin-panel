const passport = require('passport');
const DataBase = require('../db');

function setRoutes(app) {
    app
        .get('/', (req, res) => {
            // console.log('user: ', req.user);
            // console.log('auth?: ', req.isAuthenticated());
            console.log('sess: ', JSON.stringify(req.session));
            res.render('pages/index')
        })

        .post('/login',
            passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/login',
                failureFlash: true
            }))

        .post('/register', (req, res) => {
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
        //     const userId = DataBase.getUserId({ username });

        //     res.json({ userId });
        // })
}

module.exports = setRoutes;
