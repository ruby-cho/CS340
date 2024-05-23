

/*
    SETUP
*/
// Express
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 2566;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./database/db-connector')

// app.js

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.


/*
    ROUTES
*/

app.get('/', (req,res) => {
    res.render('index');
});

app.get('/updateCustomer', (req,res) => {
        let query1 = "SELECT Customers.* FROM Customers;"
        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            res.render('updateCustomer', {data: rows});                  // Render the Customers.hbs file, and also send the renderer
        })
});

app.get('/addCustomer', (req, res) => {
    res.render('addCustomer');
});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});



