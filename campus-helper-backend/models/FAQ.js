const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    category: { type: String, required: true },
    q: { type: String, required: true },
    a: { type: String, required: true }
});

module.exports = mongoose.model('FAQ', faqSchema);
