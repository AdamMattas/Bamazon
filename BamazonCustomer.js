var inquirer = require('inquirer'); //Require npm package
var mysql = require('mysql'); //Require npm package
var connection = mysql.createConnection({ //Create connection to local DB
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "Bamazon"
})

connection.connect(function(err) { //Open local DB connection
  if(err) throw err;
  runSearch(); //Run initial function
})

//Query Products table in DB
var runSearch = function() {
  //Initialize and set query parameters
  var queryAll = 'SELECT * FROM Products';
  //Execute the query
  connection.query(queryAll, function(err, rows, fields) {
    if (err) throw err; //Throw error if encountered
    //Loop through the rows returned and log them to the console
    for (var i in rows) {
        console.log('Product ID: ', rows[i].ItemID, ' Product Name: ', rows[i].ProductName, ' Price: ', rows[i].Price, ' Available: ', rows[i].StockQuantity);
    }
    //Call promptUser function
    promptUser();

  });

}

//This function allows the user to make a purchase
var promptUser = function() {
  //Have user pick an item to buy
  inquirer.prompt([
    { 
      type: "input",
      name: "itemID",
      message: "Which product (ID) would you like to buy?"
    },
    //Have user input quantity to buy
    { 
      type: "input",
      name: "quantity",
      message: "How many would you like to buy?"
    }
  ]).then(function(answer) {
      //Initialize and set query parameters
      var query = 'SELECT ItemID, ProductName, DepartmentName, Price, StockQuantity FROM Products WHERE ?';
      //Execute the query
      connection.query(query, {ItemID: answer.itemID}, function(err, res) {
        if (err) throw err; //Throw error if encountered
        //Loop through the response and log items to the console
        for (var i in res) {
          console.log('Product ID: ', res[i].ItemID, ' Product Name: ', res[i].ProductName, ' Price: ', res[i].Price, ' Available: ', res[i].StockQuantity);
        } //Check if there is enough product in stock to fulfill order
        if(answer.quantity <= res[i].StockQuantity){

          //Calculate the total cost of purchase
          var totalPurchase = answer.quantity * res[i].Price;
          //Calculate remaining product in stock
          var remainingQuantity = res[i].StockQuantity - answer.quantity;
          //Log checkout message to the user
          console.log("");
          console.log("Thank you for purchasing " + answer.quantity + " " + res[i].ProductName);
          console.log("The total cost of your purchase is: " +totalPurchase.toFixed(2));//logs total limited to 2 decimal places
          console.log("");
          //Call updateQuant function passing 2 parameters
          updateQuant(remainingQuantity, res[i].ItemID);
          //Call sumDept function passing 2 parameters
          sumDept(totalPurchase.toFixed(2), res[i].DepartmentName);
          //Call askUser function to continue program
          askUser();
        }else{
          //If not enough product is in stock to fulfill the order
          console.log("Insufficient quantity");
          //Call askUser function to continue program
          askUser();
        }
    });

  })
}

//Updates specific product in DB based on quantity & itemID parameters sent
var updateQuant = function(quantity, itemID) {
  //Initialize and set query parameters
  var query = 'UPDATE Products SET ? WHERE ?';
  //Execute the query
  connection.query(query, [{StockQuantity: quantity}, {ItemID: itemID}], function(err, res) {
    if (err) throw err; //Throw error if encountered
  });

}

//Calculate total sales of a specific department
var sumDept = function(total, deptName) {
  //Initialize and set query parameters
  var query = 'SELECT DepartmentName, TotalSales FROM Departments WHERE ?';
  //Execute the query
  connection.query(query, {DepartmentName: deptName}, function(err, res) {
    if (err) throw err; //Throw error if encountered
    //Loop through the response
    for (var i in res) {
      //Set var that is sum of total passed to function TotalSales of response from query
      var completeTotal = parseFloat(total) + parseFloat(res[i].TotalSales);
      //Call updateDept passing calculated total and department name as parameters
      updateDept(completeTotal.toFixed(2), deptName);

    }
  });

}

//Updates the DB with total sales amount
var updateDept = function(total, deptName) {
  //Initialize and set query parameters
  var query = 'UPDATE Departments SET ? WHERE ?';
  //Execute the query
  connection.query(query, [{TotalSales: total}, {DepartmentName: deptName}], function(err, res) {
    if (err) throw err; //Throw error if encountered
  });

}

//Function is called to continue or exit program
var askUser = function() {
  //Ask user if they wish to continue
  inquirer.prompt({
    name: "action",
    type: "list",
    message: "Would you like to keep shopping?",
    choices: [
      'Yes', 
      "No"
    ]
  }).then(function(answer) {
    //Check the response and execute the appropriate function
    switch(answer.action) {
      case 'Yes':
          runSearch();
      break;

      case 'No':
          endProgram();
      break;
    }
  });
}

//Close the DB connection
var endProgram = function() {

  connection.end();

}