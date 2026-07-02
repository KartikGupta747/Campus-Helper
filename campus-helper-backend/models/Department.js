const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    emoji: { type: String, required: true },
    careerCode: { type: String, default: null },
    overview: { type: String, required: true },
    hod: {
        name: { type: String },
        email: { type: String },
        mob: { type: String }
    },
    about: {
        year: { type: String },
        students: { type: String }
    },
    courses: [{ type: String }],
    facilities: [{ type: String }],
    research: [{ type: String }],
    importantOrgs: [{ type: String }],
    recruiting: [{ type: String }],
    achievements: [{ type: String }],
    internStats: { type: mongoose.Schema.Types.Mixed },
    placementStats: { type: mongoose.Schema.Types.Mixed }
});

module.exports = mongoose.model('Department', departmentSchema);
