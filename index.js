var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var request = require('request-promise');
const port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
    next();
});

app.get('/', async (req, res) => {
//	var world = req.params.id;
var worldInfo = await getWorldInfo("umera");
var playersList = await getPlayersList(worldInfo);

console.log(playersList.length);
console.log("final");

	res.render('index.ejs', {
		playersList: playersList
	});
	   
});

app.listen(port, () => {
	console.log('watcher running');
});

var getWorldInfo = (world) => {
return request({
		url: `https://api.tibiadata.com/v1/worlds/${world}.json`,
		json: true
	});

}

var getPlayersList =  (worldInfo) => {
	var promises = [];


				var playersList = [];
				var players = worldInfo.worlds.players_online;
				for (var i = 0; i < players.length; i++) {
					 promises.push(request({
							url: `https://api.tibiadata.com/v1/characters/${players[i].name}.json`,
							json: true
						}));
				}	

	return Promise.all(promises);
}



