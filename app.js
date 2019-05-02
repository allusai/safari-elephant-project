const express = require('express');
require('dotenv').config()
var mysql = require('mysql');

const app = express();

const port = 1234;

app.use(express.json())

var con = mysql.createConnection({
  host: "localhost",
  user: process.env.username,
  password: process.env.password,
  database: "elephants"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//Home Page route of API
app.get('/', (req, res) => res.send('Hello World!'))

//Get all the cameras
app.get('/cameras', function(request, response) {
  let sql = "SELECT DISTINCT * FROM Cameras";
    console.log(sql);

    con.query(sql, function (err, result) {
      if (err) {
        console.log("This is the error: " + err);
        throw err;
      }
      console.log("Result: " + result);
      var json = JSON.stringify(result); //Now we have a Json string
      response.json(json);
    });
});

//Get all the cameras that are recharging right now
app.get('/rechargeList', function(request, response) {
    let sql = "SELECT * FROM Cameras WHERE status=\'charging\'";
      console.log(sql);

      con.query(sql, function (err, result) {
        if (err) {
          console.log("This is the error: " + err);
          throw err;
        }
        console.log("Result: " + result);
        var json = JSON.stringify(result); //Now we have a Json string
        response.json(json);
      });
});

function multicamsHelperFunction(result) {
     con.query(helperSql, function (err, helper_result) {
                        if (err) {
                          console.log("This is the error: " + err);
                          throw err;
                        }
                       console.log(helper_result[0]);
                       jsonArray.push(helper_result[0]);
               });
}

//Get all the cameras for a ranger (ex: id = 2)
app.get('/rangers/:id', function(request, response) {
  let id = request.params.id;

  let sql = "SELECT * FROM Assignments WHERE rangerId = \'" +id+ "\'";
  console.log(sql);

  con.query(sql, function (err, result) {
    if (err) {
      console.log("This is the error: " + err);
      throw err;
    }
    
    let jsonString = 'abc';
    let jsonArray = [];
    let i = 0;

    //Add each result to a JSON array
    result.forEach(function(value){
        console.log("Found camera " + value.deviceId);

                let helperSql = "SELECT * FROM Cameras Where deviceId = \'" +value.deviceId+ "\'";
                console.log(helperSql);
                con.query(helperSql, function (err, helper_result) {
                        if (err) {
                          console.log("This is the error: " + err);
                          throw err;
                        }
                       jsonArray.push(helper_result[0]);
                       i++;
                       if(i == result.length) {
                          let string = JSON.stringify(jsonArray);
                          response.json(string);
                       }

               });
    
    }); 

  });

});


//Get all the rangers
app.get('/rangers', function(request, response) {
    let sql = "SELECT * FROM Rangers";
    console.log(sql);

    con.query(sql, function (err, result) {
      if (err) {
        console.log("This is the error: " + err);
        throw err;
      }
      console.log("Result: " + result);
      var json = JSON.stringify(result); //Now we have a Json string
      response.json(json);
    });
});

//Get a single camera (ex: id = 1).  Working!
app.get('/cameras/:id', function(request, response) {

  let id = request.params.id;
  console.log("id: " + id);

  let sql = "SELECT * FROM Cameras WHERE deviceId = \'"+id+"\'";
    console.log(sql);

    con.query(sql, function (err, result) {
      if (err) {
        console.log("This is the error: " + err);
        throw err;
      }
      console.log("Result: " + result);
      var json = JSON.stringify(result); //Now we have a Json string
      response.json(json);
    });
});


function helperFunction(firstName, lastName, callback) {
  let sql = "SELECT rangerId FROM Rangers WHERE firstName LIKE \"" + firstName + "\" AND lastName LIKE \"" + lastName + "\" LIMIT 1;";
  console.log(sql);
  con.query(sql, function (err, result) {
    if (err) {
      console.log("This is the error from the helper function bro: " + err);
      throw err;
    }
    console.log("Ranger Id:");
    console.log(result[0].rangerId);

    callback(result[0].rangerId);
  });
}

//Add a new ranger into the database
app.post('/addRanger', function(request, response) {
  console.log("*****");
  console.log("*****");
  //console.log(request);
  
  let firstName = request.body.firstName;
  let lastName = request.body.lastName;
  let username = request.body.username;
  let password = request.body.password;
  let values = [firstName, lastName, username, password];

  let sql = "INSERT INTO Rangers (firstName, lastName, username, password) VALUES('" + firstName + "','" + lastName + "','" + username + "','" + password + "');";
  console.log(sql);

  con.query(sql, function (err, result) {
    if (err) {
      console.log("This is the error: " + err);
      throw err;
    }
    console.log("Result: " + result);
    let id = 999;

    helperFunction(firstName, lastName, function(result) {
            console.log("Id from helper function");
            id = result;
            console.log(id);
            response.json(id);
    });
  });

  

});

function loginHelperFunction(username, password, callback) {
  let sql = "SELECT rangerId FROM Rangers WHERE username LIKE \"" + username + "\" AND password LIKE \"" + password + "\" LIMIT 1;";
  console.log(sql);
  con.query(sql, function (err, result) {
    if (err) {
      console.log("This is the error from the helper function bro: " + err);
      throw err;
    }
    console.log("Ranger Id:");
    console.log(result[0].rangerId);

    callback(result[0].rangerId);
  });
}

//Do the login for a ranger
app.post('/login', function(request, response) {
  let username = request.body.username;
  let password = request.body.password;

  loginHelperFunction(username, password, function(result) {
            console.log("Id from helper function");
            let id = result;
            console.log(id);
            response.json(id);
    });


});

//
app.post('/assignments', function(request, response) {
  let theRanger = request.body.ranger;
  let theCamera = request.body.camera;


});


app.post('/recharge/:id', function(request, response) {
    let id = request.params.id;
    console.log("Charging has been commanded");

    let sql = "UPDATE Cameras SET status = 'charging' WHERE deviceId = "+id;
    console.log(sql);

    con.query(sql, function (err, result) {
      if (err) {
        console.log("This is the error: " + err);
        throw err;
      }
      console.log("Result: " + result);
      var json = JSON.stringify(result); //Now we have a Json string
      response.json(json);
    });

});


app.post('/deploy/:id', function(request, response) {
    let id = request.params.id;
    console.log("Device has been deployed after charging");

    let sql = "UPDATE Cameras SET status = 'active' WHERE deviceId = "+id;
    console.log(sql);

    con.query(sql, function (err, result) {
      if (err) {
        console.log("This is the error: " + err);
        throw err;
      }
      console.log("Result: " + result);
      var json = JSON.stringify(result); //Now we have a Json string
      response.json(json);
    });
});


app.patch('/cameras/:id', function(request, response) {
    let id = request.params.id;
    let xLocation = request.body.xLocation;
    let yLocation = request.body.yLocation;

    console.log("Moving camera " + id + " to (" + xLocation + ", " + yLocation + ")" );

    let sql = "UPDATE Cameras SET xLocation = " +xLocation+ ", yLocation = "+yLocation+" WHERE deviceId = "+id;
    console.log(sql);

    con.query(sql, function (err, result) {
      if (err) {
        console.log("This is the error: " + err);
        throw err;
      }
      console.log("Result: " + result);
      var json = JSON.stringify(result); //Now we have a Json string
      response.json(json);
    });
});


app.delete('/cameras/:id', function(request, response) {
    let id = request.params.id;

    console.log("Request to delete this camera: " + id);

    let initialsql = "DELETE FROM Assignments WHERE deviceid = "+id;
    console.log(initialsql);

    con.query(initialsql, function (err, result) {
      if (err) {
        console.log("This is the error: " + err);
        throw err;
      }
      console.log("Result: " + result);
    });



    let sql = "DELETE FROM Cameras WHERE deviceid = "+id;
    console.log(sql);

    con.query(sql, function (err, result) {
      if (err) {
        console.log("This is the error: " + err);
        throw err;
      }
      console.log("Result: " + result);
      var json = JSON.stringify(result); //Now we have a Json string
      response.json(json);
    });
    
});






// Headquarters Routes


//
app.post('/addCamera', function(request, response) {
  let deviceType = request.body.deviceType;
  let xLocation = request.body.xLocation;
  let yLocation = request.body.yLocation;
  let status = request.body.status;
  let dataLinkType = request.body.dataLinkType;
  let dataLink = request.body.dataLink;

  let sql = "INSERT INTO Cameras (deviceType, xLocation, yLocation, status, dataLinkType, dataLink) VALUES('" + deviceType + "','" + xLocation + "','" + yLocation + "','" + status + "','" + dataLinkType + "','" + dataLink + "');";
  console.log(sql);

  con.query(sql, function (err, result) {
    if (err) {
      console.log("This is the error: " + err);
      throw err;
    }
    var json = JSON.stringify(result); //Now we have a Json string
      response.json(json);
  });

});



app.post('/assignCamera', function(request, response) {
  console.log(request.json);
  let rangerId = request.body.rangerId;
  let deviceId = request.body.deviceId;

  let sql = "SELECT DISTINCT * FROM Assignments WHERE rangerId=\'" + rangerId + "\' AND deviceId=\'" + deviceId + "\';";
  console.log(sql);

  con.query(sql, function (err, result) {
    if (err) {
      console.log("This is the error: " + err);
      throw err;
    }
    if(result.length === 0) {
        var secondsql = "INSERT INTO Assignments (rangerId, deviceId) VALUES('" + rangerId + "','" + deviceId + "');";
        console.log(secondsql);
        con.query(secondsql, function (err, result) {
              if (err) {
                console.log("This is the error: " + err);
                throw err;
              }
              var json = JSON.stringify(result); //Now we have a Json string
                response.json(json);
          });
    }
    else {
      var json = JSON.stringify(result); //Now we have a Json string
                response.json(json);
    }
  });

});






app.listen(port, () => console.log(`Example app listening on port ${port}!`))