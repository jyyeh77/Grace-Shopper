'use strict';

const utils = {
	generateError: function(message, status){
		const error = new Error(message);
		error.status = status;
		return error
	}
}

module.exports = utils;