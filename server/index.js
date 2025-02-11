const express = require('express');
const bodyParser = require('body-parser');

const Admin = require('../database-mongodb/Admin.js');
const Host = require('../database-mongodb/Host.js');
const Visitor = require('../database-mongodb/Visitor.js');
const Announcement = require('../database-mongodb/Announcement.js');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// UNCOMMENT FOR REACT
app.use(express.static(__dirname + '/../react-client/dist'));

app.get('/api/renting/fetching', function(req,res){
  Announcement.find().populate('Host').exec(function(err,data){
    if(err){
      throw err

    }else{
      res.send(data)
    }
  })
})

//login request
app.post('/api/renting/login', function (req, res) {
  console.log("data from req:",req.body);
  Host.find(req.body,(error, data) => {
    if (error) {
      throw error
    }
    else {
      if(data){
        console.log("data from db host:", data);
        res.send(data)
      }else {
        Visitor.find(req.body,(error, data) => {
          if (error) {
            throw error
          }
          else {
            if(data){
              console.log("data from db visitor:", data);
              res.send(data)
            }else{
              Admin.find(req.body,(error, data) => {
                if (error) {
                  throw error
                }
                else {
                  console.log("data from db admin:", data);
                  res.send(data)
                }
              })
            }
            
          }
        })

      }
      
    }
  })
  
  
});
///signup request

app.post('/api/renting/signup/host', function (req, res) {
  console.log("data from req:", req.body);
  
  var host = new Host(req.body);
    host.save(function (err) {
      if (err) return handleError(err);
      // saved!
    }); 
  
});
app.post('/api/renting/signup/visitor', function (req, res) {
  console.log("data from req:", req.body);
  Visitor.create(req.body,(error) => {
    if (error) {
      throw error
    }
    
  })
});
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
