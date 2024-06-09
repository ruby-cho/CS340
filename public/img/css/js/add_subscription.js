// Get the objects we need to modify
let addSubscriptionForm = document.getElementById('add-subscription-form');

// Modify the objects we need
addSubscriptionForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCustomerID = document.getElementById("input-customerID");
    let inputStartDate = document.getElementById("input-startDate");
    let inputEndDate = document.getElementById("input-endDate");
    let inputActiveStatus = document.getElementById("input-activeStatus");

    // Get the values from the form fields
    let customerIDValue = inputCustomerID.value;
    let startDateValue = inputStartDate.value;
    let endDateValue = inputEndDate.value;
    let activeStatusValue = inputActiveStatus.value;

    // Put our data we want to send in a javascript object
    let data = {
        customerID: customerIDValue,
        startDate: startDateValue,
        endDate: endDateValue,
        activeStatus: activeStatusValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/addSubscription", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputCustomerID.value = '';
            inputStartDate.value = '';
            inputEndDate.value = '';
            inputActiveStatus.value = '';
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
    let currentTable = document.getElementById("subscriptions-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let customerIDCell = document.createElement("TD");
    let startDateCell = document.createElement("TD");
    let endDateCell = document.createElement("TD");
    let activeStatusCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    customerIDCell.innerText = newRow.customerID;
    startDateCell.innerText = newRow.startDate;
    endDateCell.innerText = newRow.endDate;
    activeStatusCell.innerText = newRow.activeStatus;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(customerIDCell);
    row.appendChild(startDateCell);
    row.appendChild(endDateCell);
    row.appendChild(activeStatusCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}