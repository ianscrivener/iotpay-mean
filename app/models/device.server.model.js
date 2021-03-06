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
	customer: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	totalCharges: {
		type: Number,
		default: 0
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
			default: 4
		}
	}
});

mongoose.model('Device', DeviceSchema);