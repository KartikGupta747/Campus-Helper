const mongoose = require('mongoose');

const societySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    wikiUrl: { type: String },
    website: { type: String },
    instagramUrl: { type: String }
});

module.exports = mongoose.model('Society', societySchema);
