var mysql = require('mysql');

var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;

  else{
  	console.log('LETS SHOP!');
  }
});

function start (){

	  console.log("Selecting all products...\n");

	  connection.query('SELECT * FROM products', function (error, result){
	  		if (error) throw error;

	  		result.forEach(function (product){
	  			console.log(product.item_id + ' ' + product.product_name + ' - price: ' + '$' + product.price);
	  		});

	  		purchase();
	  		//connection.end();
	  });

}

start();

function purchase (){

	inquirer.prompt([
		{
			name: 'productID',
			type: 'input',
			message: 'What would you like to buy today (Choose by product ID)?'
		},
		{
			name: 'howMuch',
			type: 'input',
			message: 'How many would you like to buy?',
		}
]).then(function (answer){

	var product = answer.productID;
	var quantity = answer.howMuch;

	console.log('You chose item ID: ' + product);
	console.log('You want to buy ' + quantity + ' of these')

	connection.query('SELECT * FROM products WHERE ?', {item_id: product}, function (error, result){
	  		if (error) throw error;

	  		//console.log(result[0].stock_quantity);

	  		var chosenItemStock = result[0].stock_quantity;
	  		var price = result[0].price
	  		var itemChosen = result[0].product_name;

	  		var totalCost = quantity * price;

	  		if (chosenItemStock < quantity){
	  			console.log('---------------------------------------------------------------------')
	  			console.log("Oops! Looks like there are not enough in stock to fulfill that order!")
	  			console.log('---------------------------------------------------------------------')
	  			start();
	  		}
	  		else {

	  			connection.query('UPDATE products SET ? WHERE ?',[
	  			{
	  				stock_quantity: chosenItemStock - quantity
	  			},
	  			{
	  				item_id: product
	  			}], function (error, result){

	  				if (error){
	  					console.log(error);
	  				}

							//console.log(result);
							console.log('---------------------------------------------------------------------')

							console.log("You bought " + quantity + ' ' + itemChosen + "s at a total cost of $" + totalCost);
	  						console.log('---------------------------------------------------------------------')

							connection.end();
						})
	  		}
	  	});

})

}


