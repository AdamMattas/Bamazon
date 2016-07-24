var Table = require('cli-table');
var inquirer = require('inquirer');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "sector001",
  database: "Bamazon"
})

connection.connect(function(err) {
  if (err) throw err;
  runExecutive();
})

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

var viewProducts = function() {

  var queryAll = 'SELECT * FROM Departments';
 
  connection.query(queryAll, function(err, rows, fields) {
    if (err) throw err;

    var table = new Table({
        head: ['DepartmentID', 'DepartmentName', 'OverHeadCosts', 'ProductSales', 'TotalProfit']
      , colWidths: [15, 17, 15, 15, 15]
    });

    for (var i in rows) {
      var profit = parseFloat(rows[i].TotalSales) - parseFloat(rows[i].OverHeadCosts);
      table.push(
          [rows[i].DepartmentID, rows[i].DepartmentName, rows[i].OverHeadCosts, rows[i].TotalSales, profit]
      );
    }

    console.log(table.toString());

  });

}

var createDept = function() {
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
      connection.query("INSERT INTO Departments SET ?", {
        DepartmentName: answer.name,
        OverHeadCosts: answer.overhead,
        TotalSales: 0.00
      }, function(err, res) {
        if (err) throw err;
        console.log("Your new department was added successfully!");
      });

  })

}