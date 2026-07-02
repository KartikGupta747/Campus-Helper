const mongoose = require('mongoose');

const previousYearPaperSchema = new mongoose.Schema({
    year: { type: String, required: true },
    exam: { type: String, required: true },
    dept: { type: String, required: true },
    subject: { type: String, required: true },
    type: { type: String, required: true },
    url: { type: String, required: true }
});

module.exports = mongoose.model('PreviousYearPaper', previousYearPaperSchema);
