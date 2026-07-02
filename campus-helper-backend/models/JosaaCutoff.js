const mongoose = require('mongoose');

const josaaCutoffSchema = new mongoose.Schema({
    year: { type: String, required: true },
    branch: { type: String, required: true },
    degree: { type: String, required: true },
    category: { type: String, required: true },
    gender: { type: String, required: true },
    open: { type: String, required: true },
    close: { type: String, required: true }
});

module.exports = mongoose.model('JosaaCutoff', josaaCutoffSchema);
