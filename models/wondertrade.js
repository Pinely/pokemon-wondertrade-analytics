function sanitizeParams(params) {
	var currentDate;

	// Sanitize Date
	if(params.date) {
		currentDate = params.date;
	} else {
		var now = new Date(),
			year = now.getFullYear(),
			month = ('0'+(now.getMonth()+1)).slice(-2),
			day = ('0'+(now.getDate())).slice(-2);
		currentDate = [year, month, day].join('-');
	}

	// Sanitize Gender values
	if(params.gender === "male" || params.gender === "female") {
		params.trainerGender = params.gender;
	} else {
		params.trainerGender = "";
	}

	// Sanitize pokemonId
	var pokemonId = parseInt(params.pokemonId, 10);
	if(pokemonId >=1 && pokemonId <=718) {
		pokemonId = pokemonId;
	} else {
		pokemonId = false;
	}

	params.pokemonId = pokemonId;
	params.pokemonNickname = params.pokemonNickname || '';
	params.hasItem = (params.hasItem ? true : false);
	params.hasHiddenAbility = (params.hasHiddenAbility ? true : false);
	params.isShiny = (params.isShiny ? true : false);
	params.trainerGender = params.trainerGender || '';
	params.trainerCountry = params.trainerCountry || '';
	params.trainerCountrySub1 = params.trainerCountrySub1  || '';
	params.date = currentDate;
	params.userId = params.userId || 'anonymous';

	return params;
}


exports.model = function(params) {
	
	params = sanitizeParams(params);

	var pokemonModel = {
		"pokemonId" : params.pokemonId,
		"pokemonNickname" : params.pokemonNickname,
		"hasItem" : params.hasItem,
		"hasHiddenAbility" : params.hasHiddenAbility,
		"isShiny" : params.isShiny,
		"trainerGender" : params.trainerGender,
		"trainerCountry" : params.trainerCountry,
		"trainerCountrySub1" : params.trainerCountrySub1,
		"date" : params.date,
		"userId" : params.userId
	};

	if(!pokemonModel.pokemonId) {
		return false;
	} else {
		return pokemonModel;
	}
};