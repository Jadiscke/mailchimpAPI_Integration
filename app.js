//jshint esversion:6

const express = require('express');
const app = express();
const https = require('https');

app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/', (req,res) => {
  res.sendFile(__dirname +'/signup.html');
});

app.post('/', (req,res) => {
  console.log('I am working!');
  console.log(req.body.newName,req.body.newLastName,req.body.yourEmail);

  const firstName = req.body.newName;
  const lastName = req.body.newLastName;
  const email = req.body.yourEmail;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName

        }
      }
    ]
  }

  const jsonData = JSON.stringify(data);
  var mailChimpData = '';
  var statusCode = 0;

  //Setting API response
  const url = 'https://us4.api.mailchimp.com/3.0/lists/fe6cb01234';

  const options = {
    method: 'POST',
    auth: 'jadiscke1:ab30a714f60c3e338efc4005512be4fe-us4'
  }

  const request = https.request(url,options, function(response){
    response.on('data',function(data){
      mailChimpData = JSON.parse(data);
      console.log(mailChimpData);
    });
    statusCode = response.statusCode;

    response.on('end', function(){
      console.log('response ended!');
      if (mailChimpData.error_count > 0 || statusCode !== 200){
        res.sendFile(__dirname + '/fail.html')
      }else {
        res.sendFile(__dirname + '/sucess.html');
      }
    });
  });


  request.write(jsonData);
  request.end();

  });

app.post('/failure', function(req,res) {
  res.redirect('/');
})

app.listen(process.env.PORT || 3000, function() {

  console.log('Server is working!');

});


// API KEY
// ab30a714f60c3e338efc4005512be4fe-us4

// Unique ID
// fe6cb01234

// '{"name":"Freddie'\''s Favorite Hats","contact":{"company":"Mailchimp","address1":"675 Ponce De Leon Ave NE","address2":"Suite 5000","city":"Atlanta","state":"GA","zip":"30308","country":"US","phone":""},"permission_reminder":"You'\''re receiving this email because you signed up for updates about Freddie'\''s newest hats.","campaign_defaults":{"from_name":"Freddie","from_email":"freddie@freddiehats.com","subject":"","language":"en"},"email_type_option":true}'
