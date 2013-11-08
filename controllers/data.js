var _ = require('underscore'),
	PokemonList = require('../data/pokemonList.json'),
	CountryList = require('../data/countryList.json'),
	PokemonHash = {},
	CountryHash = {};

for(var pokemon in PokemonList) {
		PokemonHash[PokemonList[pokemon].id] = PokemonList[pokemon].name;
	}

for(var country in CountryList) {
	CountryHash[CountryList[country].id] = CountryList[country].name;
}

function deserializeWT(result) {
	var deserializedWondertrades = [];
	for(var i = 0, max =  result.length;i<max;i++) {				
		var currentWonderTrade = result[i];
		if(typeof currentWonderTrade === "string"
			&& currentWonderTrade.charAt(0) === '{'
			&& currentWonderTrade.charAt(currentWonderTrade.length-1) === '}') {
			deserializedWondertrades.push(JSON.parse(currentWonderTrade));
		}
	}
	return deserializedWondertrades;
}

exports.initController = function(app, dataStore) {
	app.get('/data', function(request, response){					
		dataStore.lrange('wondertrade' ,0, -1, function(error, result){
			var deserializedWondertrades = deserializeWT(result);

			// Deserialize the wondertrades from the dataStore
			
			
			// Pluck out the counts that we need
			var trainerGender = _.countBy(deserializedWondertrades, 'trainerGender'),
				pokemonByIds = _.countBy(deserializedWondertrades, 'pokemonId'),
				trainerCountries = _.countBy(deserializedWondertrades, 'trainerCountry');
			
			// The Chart Data that will be spit on the page
			var genderChart = [["Guys", trainerGender.male], ["Girls", trainerGender.female]],
				pokemonChart = [],
				countryChart = [];
				


			// Convert the Arrays into the Highcharts format
			_.each(pokemonByIds, function(pokemonByIdCount, pokemonId) {
				pokemonChart.push([PokemonHash[pokemonId], pokemonByIdCount]);				
			});

			_.each(trainerCountries, function(countryCount, countryId) {
				countryChart.push([CountryHash[countryId], countryCount]);
			});						

			response.render('data/index', {
				title: 'Wonder Trade Analytics',
				pageState: '',
				result: result,
				PokemonHash: PokemonHash,
				CountryHash: CountryHash,
				trainerGender: trainerGender,
				pokemonChart: JSON.stringify(pokemonChart),
				genderChart: JSON.stringify(genderChart),
				countryChart: JSON.stringify(countryChart)
			});
		});
	});


	app.get('/data/pokemon', function(request, response){					
		dataStore.lrange('wondertrade' ,0, -1, function(error, result){
			var deserializedWondertrades = deserializeWT(result),
				pokemonGroupedByDate = {},
				trendingPokemonChart = [];

			// Split the results by Pokemon
			var wonderTradesByPokemon = _.groupBy(deserializedWondertrades, function(wonderTrade){
				return wonderTrade.pokemonId;
			});

			// Then split those results by their dates.
			_.each(wonderTradesByPokemon, function(wonderTradeByDate, wonderTradeDate){
				pokemonGroupedByDate[wonderTradeDate] = _.countBy(wonderTradeByDate, 'date')
			});

			// And now.. we review each pokemon, and add their counts if available
			_.each(pokemonGroupedByDate, function(pokemonTradesByDate, pokemonId) {
				// Generic Literal Object to hold pokemon data
				var pokemonData = {
					name: PokemonHash[pokemonId],
					data: []
				};
				
				// We only care about this past week
				var today = new Date();
				for(var i=0, max=7;i<max;i++) {
					today.setDate(today.getDate()-1);
					if(pokemonTradesByDate[today.customFormatDate()]) {
						var dateField = Date.UTC(today.getFullYear(),  today.getMonth(), today.getDate()),
							countField = pokemonTradesByDate[today.customFormatDate()];
						pokemonData.data.push([dateField,countField]);
					} 
				}
				trendingPokemonChart.push(pokemonData);
			});

			response.render('data/pokemon', {
				title: 'Wonder Trade Pokemon Analytics',
				pageState: '',
				result: result,
				trendingPokemonChart: JSON.stringify(trendingPokemonChart)
			});
		});
	});

	app.get('/data/pokemon/:name', function(request, response){					
		dataStore.lrange('wondertrade' ,0, -1, function(error, result){			
			response.render('data/index', {
				title: 'Wonder Trade Analytics',
				pageState: '',
				result: result
			});
		});
	});

	app.get('/data/regions', function(request, response){					
		dataStore.lrange('wondertrade' ,0, -1, function(error, result){			
			response.render('data/index', {
				title: 'Wonder Trade Analytics',
				pageState: '',
				result: result
			});
		});
	});

	app.get('/data/regions/:code', function(request, response){					
		dataStore.lrange('wondertrade' ,0, -1, function(error, result){			
			response.render('data/index', {
				title: 'Wonder Trade Analytics',
				pageState: '',
				result: result
			});
		});
	});


	// by Gender?
	// by Pokemon
	// by Date
	// by Country
	// by User	
};
