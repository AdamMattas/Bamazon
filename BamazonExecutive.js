var Table = require('cli-table'); //Require npm package
var inquirer = require('inquirer'); //Require npm package
var mysql = require('mysql'); //Require npm package
var connection = mysql.createConnection({ //Create connection to local DB
  host: "localhost",
  port: 3306,
  user: "root",
  password: "sector001",
  database: "Bamazon"
})

connection.connect(function(err) { //Open local DB connection
  if (err) throw err; //Throw error if encountered
  runExecutive(); //Run initial function
})

//Give user 2 choices for the program
var runExecutive = function() {
  inquirer.prompt({
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: [
      'View Product Sales by Department', 
      "Create New Department"
    ]
  }).then(function(answer) {
    //Check the response and execute the appropriate function
    switch(answer.action) {
      case 'View Product Sales by Department':
          viewProducts();
      break;

      case 'Create New Department':
          createDept();
      break;
    }
  });
}

//Retrieves all entries in the Departments table
var viewProducts = function() {
  //Initialize and set query parameters
  var queryAll = 'SELECT * FROM Departments';
  //Execute the query
  connection.query(queryAll, function(err, rows, fields) {
    if (err) throw err; //Throw error if encountered
    //Creates a new table from the cli-table npm package
    var table = new Table({
        //Give labels to the head of each column
        head: ['DepartmentID', 'DepartmentName', 'OverHeadCosts', 'ProductSales', 'TotalProfit']
        //Specifies the width of each column in table
      , colWidths: [15, 17, 15, 15, 15]
    });
    //Loop through the response
    for (var i in rows) {
      //Calculate dept profit by subtracting sales from overhead costs
      var profit = parseFloat(rows[i].TotalSales) - parseFloat(rows[i].OverHeadCosts);
      //Push each row from DB table to display table just created
      table.push(
          [rows[i].DepartmentID, rows[i].DepartmentName, rows[i].OverHeadCosts, rows[i].TotalSales, profit]
      );
    }

    //Display the table in the console
    console.log(table.toString());
    console.log("");
    //Call askUser function
    askUser();

  });

}

//Allows the user to create a new department in the Departments table
var createDept = function() {
  //Get dept name and overhead cost for dept
  inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter the name of the department."
    },
    {
      type: "input",
      name: "overhead",
      message: "Enter the overhead cost for this department."
    }
  ]).then(function(answer) {
      //Execute query with parameters from user input
      connection.query("INSERT INTO Departments SET ?", {
        DepartmentName: answer.name,
        OverHeadCosts: answer.overhead,
        TotalSales: 0.00 //Starts dept at 0 sales
      }, function(err, res) {
        if (err) throw err; //Throw error if encountered
        //Tell the user addidng dept was successful
        console.log("Your new department was added successfully!");
        console.log("");
        //Call askUser function
        askUser();
      });

  })

}

//Asks the user to continue or exit program
var askUser = function() {
  //Ask user if they wish to continue
  inquirer.prompt({
    name: "action",
    type: "list",
    message: "Would you like to run this program again?",
    choices: [
      'Yes', 
      "No"
    ]
  }).then(function(answer) {
    //Check the response and execute the appropriate function
    switch(answer.action) {
      case 'Yes':
          runExecutive();
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