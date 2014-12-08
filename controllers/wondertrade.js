module.exports =  function(app, dataStore, passport) {
	var WondertradeModel = require('../models/wondertrade'),
		UserTableModel = require('../models/UserTable'),
		HighChartsData = require('../models/HighChartsData'),
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


	app.get('/wondertrade', function(request, res){
		res.redirect('data/recent');
	});

	app.get('/wondertrade/new', function(request, response, next){
		passport.authenticate('local', function(error, user, info){
			var currentUser = request.user;
			if (error) {
				return next(error);
			} else if (!currentUser) {
				return response.redirect('/login');
			}
			request.logIn(currentUser, function(err) {
				if (err) {
					return next(err);
				} else {
					response.render('wondertrade/new', {
						title: 'New Wonder Trade',
						pokemonList: PokemonList,
						countryList: CountryList,
						user: request.user,
						pageState: '',
						stateMessage:	''
					});
				}
			});
		})(request, response, next);
	});

	app.post('/wondertrade/new', function(request, response, next){

		passport.authenticate('local', function(error, user, info){
			var currentUser = request.user;
			if (error) {
				return next(error);
			} else if (!currentUser) {
				return response.redirect('/login');
			} else {
				var WondertradeParams = request.body,
					userId = currentUser.id,
					wondertrade = new WondertradeModel(WondertradeParams, userId),
					serializedWondertrade = JSON.stringify(wondertrade.toJSON());

				if(wondertrade.validate()) {
					dataStore.lpush('wondertrade', serializedWondertrade, function(err, size) {
						response.render('wondertrade/new', {
							title: 'New Wonder Trade',
							pokemonList: PokemonList,
							countryList: CountryList,
							user: request.user,
							pageState: 'success',
							stateMessage:	'Your Wonder Trade was successfully added.'
						});
						console.log('A new wondertrade was added by user:'+userId);
					});
				} else {
					response.render('wondertrade/new', {
						title: 'New Wonder Trade',
						pokemonList: PokemonList,
						countryList: CountryList,
						user: request.user,
						pageState: 'error',
						stateMessage:	'There was a problem adding your last wonder trade.'
					});
				}
			}


		})(request, response, next);

	});
};