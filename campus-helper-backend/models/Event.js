const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: String },
    links: [{
        label: { type: String },
        url: { type: String },
        isImage: { type: Boolean }
    }]
});

module.exports = mongoose.model('Event', eventSchema);
