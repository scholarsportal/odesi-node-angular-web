//TEST:
var BASE_URL="http://mlenodetest1.scholarsportal.info:8031";

// Use Express
var express = require("express");
var request = require("request");
// Use body-parser
var bodyParser = require("body-parser");

// Create new instance of the express server
var app = express();

// Define the JSON parser as a default way
// to consume and produce data through the
// exposed APIs
app.use(bodyParser.json());

// Create link to Angular build directory
// The `ng build` command will save the result
// under the `dist` folder.
console.log(__dirname)
var distDir = __dirname + "/odesi-web/dist/odesi-web/";
app.use(express.static(distDir));

// Init the server
var server = app.listen(process.env.PORT || 3080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

/*  "/api/status"
 *   GET: Get server status
 *   PS: it's just an example, not mandatory
 */
app.get("/api/status", function (req, res) {
    res.status(200).json({ status: "UP" });
});

//route used for all search requests, and browse requests (except for browse by category)
app.get('/api/search', function (req, res) {
    console.log(req)
    //var reqURL = BASE_URL+'/v1/values/topcClas?options=odesi-opts2&format=json'; //+ req.query.requestURL;
    var reqURL = BASE_URL+'/v1/search/?q=' +  '*&options=odesi-opts-test&collection=http://scholarsportal.info/cora&format=json';
    console.log(reqURL)
    request({url : reqURL, json : true, 'auth': { 'user': 'demo', 'pass': 'demo', 'sendImmediately': false } }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }else {
            res.sendStatus(response.statusCode);
        }
    });
});

