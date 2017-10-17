const _ = require('lodash');

module.exports = {
	
	getValidMethods: ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'],
	
	getValidMimeTypes: ['application/json', 'application/xml', 'text/xml'],
	
	getValidFormDataMimeTypes : ['multipart/form-data', 'application/x-www-form-urlencoded'],
	
	removePropertiesFromObject: function (object, propNames) {
		for (const id in object) {
			if (!object.hasOwnProperty(id)) continue;
		
			const value = object[id];
			if (_.includes(propNames,id)) {
				delete object[id];
			}
			if (typeof value === 'object') {
				this.removePropertiesFromObject(value, propNames);
			}
		}
	},
	
	removeAllAutogenerateAttribute: function(object) {
		this.removeAutogenerateAttribute(object);
		for (const id in object) {
			if (!object.hasOwnProperty(id)) continue;

			const value = object[id];
			this.removeAutogenerateAttribute(value);
			if (typeof value === 'object') {
				this.removeAllAutogenerateAttribute(value);
			}
		}
	},
	
	removeAutogenerateAttribute: function(value) {
		if (!_.isNull(value) && typeof value === 'object' && !_.isArray(value) && value.hasOwnProperty('__METADATA__') && value['__METADATA__'].hasOwnProperty('primitiveValuesMeta')) {
			for (const id in value['__METADATA__']['primitiveValuesMeta']) {
				if (!value['__METADATA__']['primitiveValuesMeta'].hasOwnProperty(id)) continue;

				if (value['__METADATA__']['primitiveValuesMeta'][id].hasOwnProperty('calculated')) {
					if (value['__METADATA__']['primitiveValuesMeta'][id]['calculated'] === true) {
						delete value[id];
					}
				}

				if (value['__METADATA__']['primitiveValuesMeta'][id].hasOwnProperty('insertedAsDefault')) {
					if (value['__METADATA__']['primitiveValuesMeta'][id]['insertedAsDefault'] === true) {
						delete value[id];
					}
				}

			}
			delete value['__METADATA__'];
		}
	},
	
	getResponseName(method, code) {
		return method + ':' + code;
	},

	isJson: function (str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}
};
