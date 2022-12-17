require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
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

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }]
    }

    const postData = JSON.stringify(data);

    const options = {
        url: `https://us21.api.mailchimp.com/3.0/lists/${process.env.List_ID}/`,
        method: 'POST',
        headers: {
            Authorization: `auth ${process.env.API_KEY}`
        },
        body: postData
    }
    
    request(options, (err, response, body) => {
        if(err) {
            res.redirect('/fail.html');
        }
        else {
            if (response.statusCode === 200) {
                res.redirect('/success.html');
            }
            else {
                res.redirect('/fail.html');
            }
        }
    });
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server started on port 3000");
});