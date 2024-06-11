//Citation for the following function:
//Date: 05/22/2024
//Adapted from and based on CS340 Starter Code
//Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addDeveloperForm = document.getElementById('add-developer-form');

// Modify the objects we need
addDeveloperForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputDeveloperName = document.getElementById("input-devname");

    // Get the values from the form fields
    let devNameValue = inputDeveloperName.value;

    // Put our data we want to send in a javascript object
    let data = {
        devName: devNameValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/addDeveloper", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputDeveloperName.value = '';
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
    let currentTable = document.getElementById("developers-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let developerNameCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    developerNameCell.innerText = newRow.fname;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(developerNameCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}