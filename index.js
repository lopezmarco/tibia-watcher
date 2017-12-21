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

app.get('/:world', async (req, res) => {
var world = req.params.world;

var worldInfo = await getWorldInfo(world);
console.log(worldInfo.world.world_information.players_online);
if (!worldInfo.world.world_information.players_online) {
	res.render('error.ejs');
}else{

	var playersList = await getPlayersList(worldInfo);
	console.log("final");

		res.render('index.ejs', {
			playersList: playersList,
			world:world
		});
	}	   
});

app.listen(port, () => {
	console.log('watcher running');
});

var getWorldInfo = (world) => {
return request({
		url: `https://api.tibiadata.com/v2/world/${world}.json`,
		json: true
	});

}

var getPlayersList =  (worldInfo) => {
	var promises = [];


				var playersList = [];
				var players = worldInfo.world.players_online;
				for (var i = 0; i < players.length; i++) {
					 promises.push(request({
							url: `https://api.tibiadata.com/v2/characters/${players[i].name}.json`,
							json: true
						}));
				}	

	return Promise.all(promises);
}



