const express = require("express");
const bodyParser = require("body-parser")
const MongoClient = require("mongodb").MongoClient
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.use(bodyParser.json());
connectionString = "mongodb://localhost:27017/";

MongoClient.connect(connectionString, {useUnifiedTopology: true})
  .then(client => {
      console.log('Connected to Database');
      const db = client.db("farmer");
      const farmerDetails = db.collection("farmerDetails");//for saving the personal details of the farmers
      const sellerDetails = db.collection("sellerDetails");//for saving the personal details of the seller
      const adminDetails = db.collection("adminDetails");//for saving the personal details of the admin
      const requirements = db.collection("requirements");//for saving the requirements of the seller
      const request = db.collection("request");//when farmers request to deliver the requirements to sell the products
      const accept = db.collection("accept");//when seller accepts the request made by the farmer
      const queries = db.collection("queries");//when farmer or seller post any queries

      //starting the server
      app.listen(3000, () => {
        console.log("listening in port 3000");
      })

      //sending the home page
      app.get("/", (req, res) => {
        res.sendFile(__dirname+"/homepage.html");
      })

      //sending the sign in page of farmer
      app.get("/fsignin", (req, res) => {
        res.sendFile(__dirname+"/fsignin.html");
      })

      //receiving the data from sign in page and storing it in the farmerDetails collection
      app.post("/fsignin", (req, res) => {
        farmerDetails.insertOne(req.body);
        res.send("<p>SUCCESSFULLY REGISTERED</p>");
      })

      app.get("/flogin", (req, res) => {
        res.sendFile(__dirname+"/flogin.html");
      })

      app.post("/flogin", (req, res) => {
        var input = req.body;
        db.collection("farmerDetails").find().toArray()
          .then(results =>{
            for(var i=0; i<results.length; i++){
              if(results[i].email === input.email && results[i].pass === input.pass)
              {
                const result = results[i];
                db.collection("requirements").find().toArray()
                .then(resul => {
                  const requirement = resul;
                  var query = { fname: result.fname };
                  db.collection("accept").find(query).toArray()
                  .then(resu => {
                    const accept = resu;
                    res.render("farmerpage.ejs", {
                      dfarmer: result,
                      requirement: requirement,
                      accept: accept
                    })
                  });
                })

              }
            }
          })
      })

      app.get("/ssignin", (req, res) => {
        res.sendFile(__dirname+"/ssignin.html");
      })

      app.post("/ssignin", (req, res) => {
        sellerDetails.insertOne(req.body);
        res.send("<p>SUCCESSFULLY REGISTERED</p>");
      })

      app.get("/slogin", (req, res) => {
        res.sendFile(__dirname+"/slogin.html");
      })

      app.post("/slogin", (req, res) => {
        var input = req.body;
        db.collection("sellerDetails").find().toArray()
          .then(results =>{
            for(var i=0; i<results.length; i++){
              if(results[i].email === input.email && results[i].pass === input.pass)
              {
                const result = results[i];
                db.collection("request").find().toArray()
                .then(resul => {
                  const request = resul;
                  var query = { sname: result.fname };
                  db.collection("accept").find(query).toArray()
                  .then(resu => {
                    const accept = resu;
                    res.render("sellerpage.ejs", {
                      dseller: result,
                      request: request,
                      accept: accept
                    })
                  });
                })

              }
            }
          })
      })
      app.post("/requirements", (req, res)=>{
        var input = req.body;
        requirements.insertOne(input);
        res.send("<p>Successfully posted the requirement</p>");
      })
      app.post('/request', (req, res) => {
        request.insertOne(req.body);
        res.send("<p>Successfully requested!</p>");
      })
      app.post("/queries", (req, res) => {
        var input = req.body;
        queries.insertOne(input);
        res.send("<p>Successfully posted the query!</p>");
      })
      app.post("/accept", (req, res) => {
        accept.insertOne(req.body);
        var query = { sname: (req.body).sname };
        requirements.deleteOne(query);
        res.send("<p>Successfully accepted!</p>");
      })
      app.get("/asignin", (req, res) => {
        res.sendFile(__dirname+"/asignin.html")
      })
      app.post("/asignin", (req, res) => {
        adminDetails.insertOne(req.body);
        res.send("<p>SUCCESSFULLY REGISTERED</p>")
      })
      app.get("/alogin", (req, res) => {
        res.sendFile(__dirname+"/alogin.html")
      })
      app.post("/alogin", (req, res)=> {
        var input = req.body;
        db.collection("adminDetails").find().toArray()
        .then(results => {
          for(var i=0; i<results.length; i++)
          {
            if(results[i].email === input.email && results[i].pass === input.pass)
            {
              const result = results[i];
              db.collection("queries").find().toArray()
              .then(resu => {
                const query = resu;
                res.render("adminpage.ejs", {
                  admin: result,
                  query: query
                })
              });
            }
          }
        })
      })
    })
    .catch(error => console.error(error));


    //{"fname": results[i].fname}
