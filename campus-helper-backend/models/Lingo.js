const mongoose = require('mongoose');

const lingoSchema = new mongoose.Schema({
    word: { type: String, required: true, unique: true },
    meaning: { type: String, required: true }
});

module.exports = mongoose.model('Lingo', lingoSchema);
