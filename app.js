

/*
    SETUP
*/
// Express
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

PORT        = 2567;                 // Set a port number at the top so it's easy to change in the future

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

// app.js

app.post('/add-customer-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Customers (first_name, last_name, email) VALUES ('${data['input-fname']}', '${data['input-lname']}', '${data['input-email']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/updateCustomer');
        }
    })
})

app.post('/update-customer', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `UPDATE Customers SET first_name = ?, last_name = ?, email = ? WHERE customer_ID = ?`;
    let values = [data.firstname, data.lastname, data.email, data.customer_id];

    db.pool.query(query1, values, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/updateCustomer');
        }
    });
});

app.post('/delete-customer', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

     // Log the received data to verify the request
     console.log('Received delete request for customer ID:', data.customer_id);

    // Create the query and run it on the database
    let query1 = `DELETE FROM Customers WHERE customer_ID = ?`;
    let values = [data.customer_id];

    db.pool.query(query1, values, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            console.log('Error executing query:', error);
            res.sendStatus(400);
        } else {
            console.log('Delete successful, redirecting to /updateCustomer');
            res.redirect('/updateCustomer');
        }
    });
});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});



