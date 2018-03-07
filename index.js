//docker-compose run --service-ports --rm server
//node_modules/.bin/nodemon index.js

const express = require('express'),
    morgan = require('morgan'),
    cons = require('consolidate'),

    app = express(),
    loginMiddleware = morgan('tiny');

// assign the mustache engine to .html files
app.engine('html', cons.mustache);
// set .html as the default extension
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

const port = 8000;

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/jq', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

app.use('/client', express.static(__dirname + '/client'));

app.use(express.urlencoded({
        extended: true,
    }
));

app.use(express.json());

app.use(function (req, res, next) {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    let hh = today.getHours();
    let mn = today.getMinutes();
    let s = today.getSeconds();

    if(dd<10) {
        dd = '0'+dd;
    }
    if(mm<10) {
        mm = '0'+mm;
    }
    if(hh<10){
        hh = '0'+hh;
    }
    if(mn<10){
        mn = '0'+mn;
    }
    if(s<10){
        s = '0'+s;
    }

    today = mm + '/' + dd + '/' + yyyy;
    const timestamp = mn + 'h' + hh + 'm' + s + 's';
    console.log('Date:', today, 'Time:', timestamp);
    next();
});

app.use(loginMiddleware);

app.listen(port, err => {
    if(err) {
        console.log('Failed to launch server', err);
    } else {
        console.log(`Listening on ${port}`);
    }
});


app.get('/', (req, res) => {
    res.status(200);
    res.contentType('html');
    res.send(`<h1>Hello</h1>`);
});

const data = [
    {id : 1, name : 'item1'},
    {id : 2, name : 'item2'},
    {id : 3, name : 'item3'},
];


app.get('/items', (req, res) => {

    // const formatItem = item => `<a href="/item/${item.id}"><li>${item.name}</li></a>`;

    // const list = data.map(formatItem)
    //                  .join('');

    res.render('layout', {
        partials: {
            main: 'items'
        },
        title : 'Liste d\'items',
        list : data,
    })
});

app.get('/item/:id', (req, res) => {
    const id = req.params.id;

    res.render('layout', {
        partials: {
            main: 'item'
        },
        title: 'Item',
        item : data[id - 1],
    })
});

app.post('/items', function (req, res) {
    console.log(req.body);
    res.redirect('/items');
});

app.use('*', function respond404(req, res) {
    res.status(404);
    res.send('Page introuvable');
});