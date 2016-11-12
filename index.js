const express = require('express'); //importamos los modulos
const hbs = require('hbs');
const fs = require('fs');

//Con esto conseguimos que funcione Heroku
//Ademas debemos indicar en el json "start": "node index.js" en scripts
const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials'); //Los partials serian los layouts
app.set('view engine', 'hbs'); //Indicamos que vamos a mostrar los datos con handelbars
app.use(express.static(__dirname + '/public'));

app.use((req, res, next)=> {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if(err){
      console.log('Unable to append to server.log.');
    }
  });
  next();
});

//-- Creacion de los helpers que usaremos con {{> NombreHelper}}

hbs.registerHelper('getCurrentYear', () => { // {{>getCurrentYear}}
  return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => { // {{>screamIt welcomeMessage}}
  return text.toUpperCase();
});

//Renderizamos las paginas de nuestra web

app.get('/', (req, res) =>{
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my website'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
    welcomeMessage: 'Welcome to about'
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects Page'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

//El puerto que va a estar escuchando nuestra web

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
