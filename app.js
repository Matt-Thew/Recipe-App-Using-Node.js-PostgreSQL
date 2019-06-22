const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    app = express();
    const config = {
        user: 'matt',
        database: 'recipebookdb',
        password: 'pass1234',
        port: 5432
    };
    const pool = new pg.Pool(config);





app.engine('dust', cons.dust);

app.set('view engine', 'dust');

app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req,res) =>{
    // pg.connect(connect, (err, client, done) => {
    //     if(err){
    //         console.log(err);
    //     }
    //     client.query('SELECT * FROM recipe', (err, result) => {
    //         console.log(result);
    //     })

    //     done();

    // });
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        client.query('SELECT * FROM recipe', function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    })

})

app.get('/add', (req,res) => {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        client.query('INSERT INTO recipe(name, ingredient, directions) VALUES($1, $2, $3)', 
            ['test name', 'tometo', 'forward'],
            function (err, result) {
            done();

            res.send('success');
            return;
            res.redirect('/');
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    })
})
app.listen(3000, function(){
    console.log('server started');
})