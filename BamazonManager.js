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
  runManager();
})

var runManager = function() {
  inquirer.prompt({
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: [
      'View Products for Sale', 
      "View Low Inventory", 
      "Add to Inventory", 
      "Add New Product"
    ]
  }).then(function(answer) {
    switch(answer.action) {
      case 'View Products for Sale':
          viewProducts();
      break;

      case 'View Low Inventory':
          viewLow();
      break;

      case 'Add to Inventory':
          addInventory();
      break;

      case 'Add New Product':
          addNewProduct();
      break;
    }
  });
}

var viewProducts = function() {
  var query = 'SELECT * FROM Products';
 
  connection.query(query, function(err, rows, fields) {
    if (err) throw err;

    for (var i in rows) {
        console.log('Product ID: ', rows[i].ItemID, ' Product Name: ', rows[i].ProductName, ' Price: ', rows[i].Price, ' Available: ', rows[i].StockQuantity);
    }
  });

}

// If a manager selects option 2 it should list all items for which the quantity available in stores is less than 5.
var viewLow = function() {
  var query = 'SELECT * FROM Products WHERE StockQuantity <= 5';
 
  connection.query(query, function(err, rows, fields) {
    if (err) throw err;

    for (var i in rows) {
        console.log('Product ID: ', rows[i].ItemID, ' Product Name: ', rows[i].ProductName, ' Price: ', rows[i].Price, ' Available: ', rows[i].StockQuantity);
    }
  });

}

var addInventory = function() {
  connection.query('SELECT * FROM Products', function(err, res) {
    console.log(res);
    inquirer.prompt({
      name: "choice",
      type: "list",
      choices: function(value) {
        var choiceArray = [];
        for (var i = 0; i < res.length; i++) {
            choiceArray.push(res[i].ProductName);
        }
        return choiceArray;
      },
      message: "Which item would you like to increase the quantity of?"
    }).then(function(answer) {
        for(var i = 0; i < res.length; i++) {
          if(res[i].ProductName == answer.choice) {
            var chosenItem = res[i];
            var addQuantity = res[i].StockQuantity;
            //console.log(addQuantity);
            inquirer.prompt({
                name: "add",
                type: "input",
                message: "How many would you like to add?"
            }).then(function(answer) {
                var addedQuant = parseInt(addQuantity) + parseInt(answer.add);
                connection.query("UPDATE Products SET ? WHERE ?", [{
                  StockQuantity: addedQuant
                }, {
                  ItemID: chosenItem.ItemID
                }], function(err, res) {
                  console.log("Quantity updated successfully!");
                  //start();
                });
            })
          }
        }
    })
  })

}