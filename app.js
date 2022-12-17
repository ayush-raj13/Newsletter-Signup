require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const client = require("@mailchimp/mailchimp_marketing");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/public/signup.html");
});

app.post("/", function(req, res){
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;
    console.log(firstName + lastName + email);
    client.setConfig({
        apiKey: process.env.API_KEY,
        server: "us21",
      });
      
      const run = async () => {
        const response = await client.lists.batchListMembers(process.env.List_ID, {
          members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }],
        });
        console.log(response);
        if (response.errors.length==0){
            res.send("Successfully Subscribed!");
        }else {
            res.send("There was an error with signing up, " + response.errors[0].error_code + ", please try again!");
        }
      };
      
      run();
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server started on port 3000");
});