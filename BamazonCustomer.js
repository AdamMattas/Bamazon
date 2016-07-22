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
        for (var i in res) {
            console.log('Product ID: ', res[i].ItemID, ' Product Name: ', res[i].ProductName, ' Price: ', res[i].Price, ' Available: ', res[i].StockQuantity);
        }
        if(answer.quantity <= res[i].StockQuantity){
          var totalPurchase = answer.quantity * res[i].Price;
          var remainingQuantity = res[i].StockQuantity - answer.quantity;
          console.log("Remaining: " + remainingQuantity);
          console.log(totalPurchase.toFixed(2));//logs total limited to 2 decimal places
          //console.log("Sell Sell Sell!!!");
          updateQuant(remainingQuantity, res[i].ItemID);
        }else{
          console.log("Insufficient quantity");
        }

      });

  })
}

var updateQuant = function(quantity, itemID) {

  var query = 'UPDATE Products SET ? WHERE ?';

      connection.query(query, [{StockQuantity: quantity}, {ItemID: itemID}], function(err, res) {
        if (err) throw err;
        console.log(res);
      });

}

//connection.end();