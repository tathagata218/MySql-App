var mysql      =   require('mysql');
var inquirer   =   require('inquirer');
var Table      =   require('cli-table');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bamazon'
});
 
connection.connect();
 
function callGetInfo(){

  console.log(' ');
  console.log(' ');
  inquirer.prompt([
    {type:"input",
    message:"Choose Product by ID ? ",
    name:"productID",
    },
    {type:"input",
    message:"Choose Quantity ? ",
    name:"productQuantity",
    }
  ]).then(function(response){
    var receivedID= parseInt(response.productID);
    var receivedQuantity=parseInt(response.productQuantity);
    connection.connect(function(){
    connection.query('select id, product_name, cost, stock_quantity from products WHERE  id='+receivedID+' LIMIT 0, 1000', function (error, results, fields) {
      // if (error) throw error;
      
      var result;
      var resultPrice;
      var databaseArr1=results.length;
      if(results[0]["id"] === null ){
        console.log("The Item is not in the DataBase");
      }
      else if( receivedQuantity > results[0]["stock_quantity"]){
        console.log("Isufficiant Amount");
      }
      else if(results[0]["id"] !== null && receivedQuantity <= results[0]["stock_quantity"] ){
        result = results[0]["stock_quantity"] - receivedQuantity;
        resultPrice = receivedQuantity*results[0]["cost"];
        console.log(" ");
        console.log("      Total Price of ' "+results[0]["product_name"]+" '  "+resultPrice);
      }
     
      connection.query("UPDATE products SET  stock_quantity = "+result+" WHERE id="+receivedID , function(error, data, fields){
        console.log('            Database Updated !!!!');

      });

     
      
    });
    });
  });

}

function showDatabase(){
  var dataBaseData;
connection.query('SELECT * FROM products', function (error, results, fields) {
  if (error) throw error;

  dataBaseData=results;
  var databaseArr=results.length;
  console.log('The Table is');
  var table = new Table({
    head: ['ID', 'Product Name ','Department Name', 'Cost', 'Stock']
  , colWidths: [10, 20, 20, 10,10 ]
});
  
  for (var i=0; i<databaseArr; i++){
  
  table.push(
    [results[i]["id"], results[i]["product_name"],results[i]["department_name"],results[i]["cost"],results[i]["stock_quantity"]]
  
);
  }

  console.log(table.toString());
 
});
setTimeout(callGetInfo, 2000);

}
showDatabase();

 connection.end();