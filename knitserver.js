var http = require('http');
const fs = require('fs');

const server = http.createServer(function(req, res){
	res.writeHead(200, {'Content-Type':'text/html'});
	fs.createReadStream('index.html').pipe(res)
})

server.listen(process.env.PORT || 8080)
