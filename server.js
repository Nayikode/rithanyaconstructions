var express = require('express');
var bodyParser = require("body-parser");
var nodemailer = require('nodemailer');

app = express();
app.engine('html', require('ejs').renderFile);
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';



/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
  extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());


app.get('/', function (req, res) {
  res.render('index.html');
})

app.post('/', function (req, res) {
  console.log(req.body);
  var name = req.body.name;
  var email = req.body.email;
  var comments = req.body.comments;
  var mailOptions = {
    from: email,
    to: 'Sandeepj1672@gmail.com',
    bcc: 'rithanyaconstructionsweb@gmail.com',
    subject: 'Rithanya Constructions Enquiry from ' + name,
    html: '<b>email : ' + email + '</b><br/>' + comments
  };
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'rithanyaconstructionsweb@gmail.com',
      pass: 'rithanya123'
    }
  });
  transporter.sendMail(mailOptions, function (error, info) {
    var emailsent = false;
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      emailsent = true;

    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ sent: emailsent }));
  });
})
// error handling

app.use(express.static('public'))
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});


app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app;