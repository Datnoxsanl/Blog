const express = require('express');
const path = require('path');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const app = express();
const port = 3000;
// https:localhost:3000

const route = require('./routes');

app.use(express.static(path.join(__dirname, 'public')));
// http://localhost:3000/img/logo.jpg

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//https
app.use(morgan('combined'));

//template engine
        app.engine(
    'hbs',
       
    
     
    
     engine({
        extname: '.hbs',
    }),
);
app.set('view engine', 'hbs');
app.set('views', 
                    path.join(__dirname,                 'resources', 'views'));

// Routes init
route(app);

//127.0.0.1
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
