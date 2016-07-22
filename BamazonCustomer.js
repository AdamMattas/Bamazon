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
  if(err) throw err;
  // console.log("connected as id " + connection.threadId);
  runSearch();
})

//Users should then be prompted with two messages. The first message should ask them the ID of the product they would like to buy. The second message should ask them how many of the product they would like to buy.

// inquirer.prompt([

//   {
//     type: "input",
//     name: "itemID",
//     message: "Which product (ID) would you like to buy?"
//   },
//   {
//     type: "input",
//     name: "quantity",
//     message: "How many would you like to buy?"
//   }


// ]).then(function(answers){
 
//   var query = 'SELECT ProductName, DepartmentName, Price, StockQuantity FROM Products WHERE ?';
//   connection.query(query, {ItemID: answer.itemID}, function(err, res) {
//       if (err) throw err;
//       console.log(res);
//       for (var i = 0; i < res.length; i++) {
//           console.log('Product ID: ', res[i].ItemID, ' Product Name: ', res[i].ProductName, ' Available: ', res[i].StockQuantity);
//       }
//   });

// })

var runSearch = function() {

  var queryAll = 'SELECT * FROM Products';
 
  connection.query(queryAll, function(err, rows, fields) {
    if (err) throw err;

    for (var i in rows) {
        console.log('Product ID: ', rows[i].ItemID, ' Product Name: ', rows[i].ProductName, ' Price: ', rows[i].Price, ' Available: ', rows[i].StockQuantity);
    }
  });

  inquirer.prompt([
    {
      type: "input",
      name: "itemID",
      message: "Which product (ID) would you like to buy?"
    },
    {
      type: "input",
      name: "quantity",
      message: "How many would you like to buy?"
    }
  ]).then(function(answer) {
      var query = 'SELECT ItemID, ProductName, DepartmentName, Price, StockQuantity FROM Products WHERE ?';
      connection.query(query, {ItemID: answer.itemID}, function(err, res) {
        if (err) throw err;
        console.log(res);
        for (var i = 0; i < res.length; i++) {
            console.log('Product ID: ', res[i].ItemID, ' Product Name: ', res[i].ProductName, ' Available: ', res[i].StockQuantity);
        }
      });

  })
}

// connection.end();