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
  if (err) throw err; //Throw error if encountered
  runManager(); //Run initial function
})

//Give user 4 choices for the program
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
    //Check the response and execute the appropriate function
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

//Shows user all products for sale
var viewProducts = function() {
  //Initialize and set query parameters
  var query = 'SELECT * FROM Products';
  //Execute the query
  connection.query(query, function(err, rows, fields) {
    if (err) throw err; //Throw error if encountered
    //Loop through the rows returned and log them to the console
    for (var i in rows) {
        console.log('Product ID: ', rows[i].ItemID, ' Product Name: ', rows[i].ProductName, ' Price: ', rows[i].Price, ' Available: ', rows[i].StockQuantity);
    }
    //Call askUser function
    askUser();
  });

}

//Shows user products with 5 or less left in stock
var viewLow = function() {
  //Initialize and set query parameters
  var query = 'SELECT * FROM Products WHERE StockQuantity <= 5';
  //Execute the query
  connection.query(query, function(err, rows, fields) {
    if (err) throw err; //Throw error if encountered
    //Loop through the rows returned and log them to the console
    for (var i in rows) {
        console.log('Product ID: ', rows[i].ItemID, ' Product Name: ', rows[i].ProductName, ' Price: ', rows[i].Price, ' Available: ', rows[i].StockQuantity);
    }
    //Call askUser function
    askUser();
  });

}

//Allow the user to add inventory for products
var addInventory = function() {
  //Execute DB query
  connection.query('SELECT * FROM Products', function(err, res) {
    //List items are returned from DB query
    inquirer.prompt({
      name: "choice",
      type: "list",
      choices: function(value) {
        //Create empty array to hold list items
        var choiceArray = [];
        //Loop through response and push all product names to the choiceArray
        for (var i = 0; i < res.length; i++) {
            choiceArray.push(res[i].ProductName);
        }
        //Sets choiceArray as list items
        return choiceArray;
      },
      message: "Which item would you like to increase the quantity of?"
    }).then(function(answer) {
        //Loop through response for a match to user input
        for(var i = 0; i < res.length; i++) {
          if(res[i].ProductName == answer.choice) {
            //Set entire product row as var for UPDATE reference
            var chosenItem = res[i];
            //Set current specific product inventory amount as var to be added to the new quantity later
            var addQuantity = res[i].StockQuantity;
            //Ask user how much inventory to add
            inquirer.prompt({
                name: "add",
                type: "input",
                message: "How many would you like to add?"
            }).then(function(answer) {
                //Add the new inventory with the current inventory and set the sum as a var
                var addedQuant = parseInt(addQuantity) + parseInt(answer.add);
                //Execute query with the inventory amount and itemId as parameters
                connection.query("UPDATE Products SET ? WHERE ?", [{
                  StockQuantity: addedQuant
                }, {
                  ItemID: chosenItem.ItemID
                }], function(err, res) {
                  //Tell the user quantity update was successful
                  console.log("Quantity updated successfully!");
                  //Call askUser function
                  askUser();
                });
            })
          }
        }
    })
  })

}

//Allows user to add a new product to DB
var addNewProduct = function() {
  //Get product name, dept, price and quantity
  inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter the name of the product."
    },
    {
      type: "input",
      name: "department",
      message: "Enter a department for this product."
    },
    {
      type: "input",
      name: "price",
      message: "Enter the price for this product."
    },
    {
      type: "input",
      name: "quantity",
      message: "Enter the quantity available for this product."
    }
  ]).then(function(answer) {
      //Execute query with parameters from user input
      connection.query("INSERT INTO Products SET ?", {
            ProductName: answer.name,
            DepartmentName: answer.department,
            Price: answer.price,
            StockQuantity: answer.quantity
        }, function(err, res) {
          //Tell the user addidng product was successful
            console.log("Your new product was added successfully!");
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
          runManager();
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