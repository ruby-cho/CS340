// Get the objects we need to modify
let addGenreForm = document.getElementById('add-genre-form');

// Modify the objects we need
addGenreForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputGenreName = document.getElementById("input-devname");

    // Get the values from the form fields
    let devNameValue = inputGenreName.value;

    // Put our data we want to send in a javascript object
    let data = {
        devName: devNameValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/addGenre", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputGenreName.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("genres-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let genreNameCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    genreNameCell.innerText = newRow.fname;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(genreNameCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}