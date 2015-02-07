'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Device Schema
 */
var DeviceSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Device name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	biller: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	status: {
		type: String,
		default: 'OK',
		enum: ['OK', 'Breach']
	},
	customers: [{
		type: Schema.ObjectId,
		ref: 'User'
	}],
	alias: {
		type: String,
	},
	config: {
		dataPeriod: {
			type: Number,
			default: 1
		},
		configPeriod: {
			type: Number,
			default: 5
		},
		thresholdWarn: {
			type: Number,
			default: 65
		},
		thresholdLimit: {
			type: Number,
			default: 75
		}
	}
});

mongoose.model('Device', DeviceSchema);