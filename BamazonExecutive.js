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

  // instantiate 
  var table = new Table({
      head: ['DepartmentID', 'DepartmentName', 'OverHeadCosts', 'ProductSales', 'TotalProfit']
    , colWidths: [25, 75]
  });

  var query = 'SELECT Departments.DepartmentID, Departments.DepartmentName, Departments.OverHeadCosts, Departments.TotalSales FROM Departments ';
  query += 'INNER JOIN top5000 ON (topalbums.artist = top5000.artist AND topalbums.year = top5000.year) ';
  query += 'WHERE (topalbums.artist = ? AND top5000.artist = ?) ORDER BY topalbums.year ';

  connection.query(query, [answer.artist, answer.artist], function(err, res) {
    console.log(res.length + " matches found!");
    for (var i = 0; i < res.length; i++) {
        console.log("Album Position: " + res[i].position + " || Artist: " + res[i].artist + " || Song: " + res[i].song + " || Album: " + res[i].album + " || Year: " + res[i].year);
    }
    
    runSearch();
  })
   
  // table is an Array, so you can `push`, `unshift`, `splice` and friends 
  table.push(
      ['First value', 'Second value']
    , ['First value', 'Second value']
  );

  console.log(table.toString());

}