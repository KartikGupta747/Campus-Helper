const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
    year: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String, required: true }
});

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
