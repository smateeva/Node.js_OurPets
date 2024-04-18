const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/authRoute');  
const indexRoutes = require('./routes/index');
const userRoute = require('./routes/userRoute')
const logoutRoute = require('./routes/logoutRoute')
const advertsRoute = require('./routes/advertsRoute');




app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(session({
    store: new SQLiteStore(),
    secret: 'secret key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true } // 24 hours
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use('/', indexRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/' ,userRoute)
app.use('/', logoutRoute);
app.use('/adverts', advertsRoute);


app.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
    } else {
        res.locals.user = null;
    }
    next();
});




wss.on('connection', function connection(ws) {
    console.log('A new client Connected!');
    ws.send('Welcome New Client!');

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.on('close', () => console.log('Client has disconnected.'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
