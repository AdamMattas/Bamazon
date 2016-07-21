var prompt = require('prompt');
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
  console.log("connected as id " + connection.threadId);
})

var queryAll = 'SELECT * FROM Products';

// connection.query(queryAll,function(err, res, fields) {
//   if (err) throw err;
  
//   console.log(res)

// });
 
connection.query(queryAll, function(err, rows, fields) {
    if (err) throw err;
 
    for (var i in rows) {
        console.log('Product ID: ', rows[i].ItemID, ' Product Name: ', rows[i].ProductName, ' Available: ', rows[i].StockQuantity);
    }
});

connection.end();