//Citation for the following function:
//Date: 05/18/2024
//Adapted from and based on CS340 Starter Code
//Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

/*
    SETUP
*/

// Express - Importing the necessary libraries
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

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

// Renders the Home Page
app.get('/', (req,res) => {
    res.render('index');
});

// Render the customer update page
app.get('/updateCustomer', (req,res) => {
        let query1 = "SELECT Customers.* FROM Customers;"
        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            res.render('updateCustomer', {data: rows});                  // Render the Customers.hbs file, and also send the renderer
        })
});

// render the developer management page
app.get('/developers', (req,res) => {
    let query1 = "SELECT Developers.* FROM Developers;"
    db.pool.query(query1, function(error, rows, fields){    // Execute the query
        res.render('developers', {data: rows});                  // Render the Customers.hbs file, and also send the renderer
    })
});

// render the genres page
app.get('/genres', (req,res) => {
    let query1 = "SELECT Genres.* FROM Genres;"
    db.pool.query(query1, function(error, rows, fields){    // Execute the query
        res.render('genres', {data: rows});                  // Render the Customers.hbs file, and also send the renderer
    })
});

// render the games page with related developers and genres
app.get('/games', (req, res) => {
    let query1 = `
        SELECT Games.*, Developers.dev_name 
        FROM Games 
        INNER JOIN Developers ON Games.dev_ID = Developers.dev_ID
        ORDER BY Games.game_ID asc;
    `;

    let query2 = "SELECT dev_ID, dev_name FROM Developers;";
    let query3 = "SELECT genre_ID, genre_name FROM Genres;";

    db.pool.query(query1, function(error, gameRows, fields) { //execute the query
        if (error) {
            console.log("Error fetching games: ", error);
            res.sendStatus(500);
            return;
        }
        
        db.pool.query(query2, function(error, developerRows, fields) { // fetch developers
            if (error) {
                console.log("Error fetching developers: ", error);
                res.sendStatus(500);
                return;
            }

            db.pool.query(query3, function(error, genreRows, fields) { // fetch genres
                if (error) {
                    console.log("Error fetching genres: ", error);
                    res.sendStatus(500);
                    return;
                }

                res.render('games', {
                    data: gameRows,
                    developers: developerRows,
                    genres: genreRows
                });
            });
        });
    });
});


// render the streams page with related customers and games
app.get('/streams', (req,res) => {
    let query1 = "SELECT Streams.* FROM Streams INNER JOIN (SELECT customer_ID FROM Customers) AS Customer ON Customer.customer_ID = Streams.customer_ID INNER JOIN (SELECT game_ID FROM Games) AS Game ON Game.game_ID = Streams.game_ID;"

    let query2 = "SELECT customer_ID, CONCAT(first_name, ' ', last_name) AS first_and_last_name FROM Customers;"

    let query3 = "SELECT game_ID, Title FROM Games;"

    db.pool.query(query1, function(error, rows, fields){    // Execute the query
        let streams = rows;

        db.pool.query(query2, function(error, rows, fields){ // fetch customers
            let customers = rows;

            db.pool.query(query3, function(error, rows, fields){ // fetch games
                let games = rows; 
                
                res.render('streams', {data: streams, customers: customers, games:games});
            })
        })

    })
});

//render the subscriptions page with related customers
app.get('/subscriptions', (req,res) => {
    let query1 = "SELECT Subscriptions.* FROM Subscriptions INNER JOIN (SELECT customer_ID FROM Customers) AS Customer ON Customer.customer_ID = Subscriptions.customer_ID;"
    
    let query2 = "SELECT customer_ID, CONCAT(first_name, ' ', last_name) AS first_and_last_name FROM Customers;"

    db.pool.query(query1, function(error, rows, fields){    // Execute the query
        let subscriptions = rows;

        db.pool.query(query2, function(error, rows, fields){ // fetch customers
            let customers = rows;
            
            res.render('subscriptions', {data: subscriptions, customers: customers});
        })

    })
});

//render the games_genres page with related games and genres
app.get('/games_genres', (req,res) => {
    let query1 = "SELECT Games_Genres.* FROM Games_Genres;"

    let query2 = "SELECT Games.* FROM Games;"

    let query3 = "SELECT Genres.* FROM Genres;"
    db.pool.query(query1, function(error, rows, fields){    // Execute the query
        let games_genres = rows;

        db.pool.query(query2, function(error, rows, fields){ // fetch games
            let games = rows;

            db.pool.query(query3, function(error, rows, fields){ // fetch genres
                let genres = rows;

                res.render('games_genres', {data: games_genres, games: games, genres:genres});   // Render the Customers.hbs file, and also send the renderer
            })
        })
    })
});

// add, update, delete customer

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

// add, update, delete Developer

app.post('/add-developer-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Developers (dev_name) VALUES ('${data['input-devname']}')`;
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
            res.redirect('/developers');
        }
    })
})

app.post('/update-developer', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `UPDATE Developers SET dev_name = ? WHERE dev_ID = ?`;
    let values = [data.dev_name, data.developer_id];

    db.pool.query(query1, values, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/developers');
        }
    });
});

app.post('/delete-developer', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

     // Log the received data to verify the request
     console.log('Received delete request for developer ID:', data.developer_id);

    // Create the query and run it on the database
    let query1 = `DELETE FROM Developers WHERE dev_id = ?`;
    let values = [data.developer_id];

    db.pool.query(query1, values, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            console.log('Error executing query:', error);
            res.sendStatus(400);
        } else {
            console.log('Delete successful, redirecting to /developers');
            res.redirect('/developers');
        }
    });
});

// add, delete, update genre

app.post('/add-genre-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Genres (genre_name) VALUES ('${data['input-genrename']}')`;
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
            res.redirect('/genres');
        }
    })
})

app.post('/update-genre', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `UPDATE Genres SET genre_name = ? WHERE genre_ID = ?`;
    let values = [data.genre_name, data.genre_id];

    db.pool.query(query1, values, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/genres');
        }
    });
});

app.post('/delete-genre', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

     // Log the received data to verify the request
     console.log('Received delete request for genre ID:', data.genre_id);

    // Create the query and run it on the database
    let query1 = `DELETE FROM Genres WHERE genre_ID = ?`;
    let values = [data.genre_id];

    db.pool.query(query1, values, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            console.log('Error executing query:', error);
            res.sendStatus(400);
        } else {
            console.log('Delete successful, redirecting to /genres');
            res.redirect('/genres');
        }
    });
});

// add, delete, update games_genres

app.post('/add-game-genre-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Games_Genres (game_ID, genre_ID) VALUES ('${data['input-gameID']}', '${data['input-genreID']}')`;
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
            res.redirect('/games_genres');
        }
    })
})

app.post('/update-game-genre', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `UPDATE Games_Genres SET game_ID = ?, genre_ID = ? WHERE game_genre_ID = ?`;
    let values = [data.game_ID, data.genre_ID, data.game_genre_ID];

    db.pool.query(query1, values, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/games_genres');
        }
    });
});

app.post('/delete-game-genre', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

     // Log the received data to verify the request
     console.log('Received delete request for genre ID:', data.delete_game_genre_id);

    // Create the query and run it on the database
    let query1 = `DELETE FROM Games_Genres WHERE game_genre_ID = ?`;
    let values = [data.delete_game_genre_id];

    db.pool.query(query1, values, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            console.log('Error executing query:', error);
            res.sendStatus(400);
        } else {
            console.log('Delete successful, redirecting to /games_genres');
            res.redirect('/games_genres');
        }
    });
});

// add, delete, update game

app.post('/add-game-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Games (Title, dev_ID) VALUES ('${data['input-gamename']}', '${data['input-devID']}')`;
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
            res.redirect('/games');
        }
    })
})

app.post('/update-game', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `UPDATE Games SET Title = ?, dev_ID = ? WHERE game_ID = ?`;
    let values = [data.Title, data.dev_ID, data.game_ID];

    db.pool.query(query1, values, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/games');
        }
    });
});

app.post('/delete-game', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

     // Log the received data to verify the request
     console.log('Received delete request for game ID:', data.delete_game_id);

    // Create the query and run it on the database
    let query1 = `DELETE FROM Games WHERE game_ID = ?`;
    let values = [data.delete_game_id];

    db.pool.query(query1, values, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            console.log('Error executing query:', error);
            res.sendStatus(400);
        } else {
            console.log('Delete successful, redirecting to /games');
            res.redirect('/games');
        }
    });
});

// add new stream

app.post('/add-stream-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Streams (customer_ID, game_ID, stream_date) VALUES ('${data['input-customerID']}', '${data['input-gameID']}', '${data['input-streamDate']}')`;
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
            res.redirect('/streams');
        }
    })
})

// add subscription

app.post('/add-subscription-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Subscriptions (customer_ID, start_date, end_date, active_status) VALUES ('${data['input-customerID']}', '${data['input-startDate']}', '${data['input-endDate']}', '${data['input-activeStatus']}')`;
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
            res.redirect('/subscriptions');
        }
    })
})



/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});



