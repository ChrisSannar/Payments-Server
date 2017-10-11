var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var structure = new Schema({
    amount: {type: Number, default: null},
    date: {type: Date, default: null}
});

var model = mongoose.model('Payment', structure);

module.exports = model;