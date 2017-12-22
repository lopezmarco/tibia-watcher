var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var request = require('request-promise');
const port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/views'));
//app.use('world',express.static(__dirname + '/views'));

app.set('view engine', 'ejs');

app.get('/:world/:page', async (req, res) => {
	var world = req.params.world;
	var page = req.params.page;

	var worldInfo = await getWorldInfo(world);
	console.log(worldInfo.world.world_information.players_online);
	if (!worldInfo.world.world_information.players_online) {
		res.render('error.ejs');
	}else{

		var playersList = await getPlayersList(worldInfo, page);
		console.log("final");

		res.render('index.ejs', {
			playersList: playersList,
			world:world
		});
	}	 

  
});

app.use(function(req, res, next){
  res.status(404);
  res.render('notfound.ejs');

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

var getPlayersList =  (worldInfo, page) => {
	var promises = [];
	var playersList = [];
	var players = worldInfo.world.players_online;
	var max = 0;
	var i = 0;

	if (page == 1 && players.length < 150) {
		max = players.length;
		i = 0;
	}else{
		if (page == 1) {
			max = 150;
			i = 0;
		}else{
			if (page == 2 && players.length < 300) {
				max = players.length;
				i = 150;
			}else{
				if (page == 2 && players.length >= 300) {
					max = 300;
					i = 150;
				}else{
					if (page == 3 && players.length < 450) {
						max = players.length;
						i = 300;
					}else{
						if (page == 3 && players.length >= 450) {
							max = 450;
							i = 300;
						}else{
							if (page == 4 && players.length < 600) {
								max = players.length;
								i = 450;
							}else{
								if (page ===4 && players.length >= 600) {
									max = 600;
									i = 450;
								}else{
									if (page == 5 && players.length < 750) {
										max = players.length;
										i = 600;
									}else{
										if (page == 5 && players.length >= 750) {
											max = 750;
											i = 600;
										}else{
											if (page == 6 && players.length < 1000) {
												max = players.length;
												i = 750;
											}else{
												if (page == 6) {
													max = 1000;
													i = 750;
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}

	for (i; i < max; i++) {
			promises.push(request({
					url: `https://api.tibiadata.com/v2/characters/${players[i].name}.json`,
					json: true
				}));
			}	

	return Promise.all(promises);
}



