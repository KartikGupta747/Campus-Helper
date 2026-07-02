const StudyMaterial = require('../models/StudyMaterial');
const PreviousYearPaper = require('../models/PreviousYearPaper');
const Department = require('../models/Department');
const Society = require('../models/Society');
const FAQ = require('../models/FAQ');
const Lingo = require('../models/Lingo');
const Event = require('../models/Event');
const JosaaCutoff = require('../models/JosaaCutoff');

// 1. Study Materials
exports.getStudyMaterials = async (req, res) => {
    try {
        const materials = await StudyMaterial.find({});
        res.json(materials);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch study materials" });
    }
};

// 2. Previous Year Papers (Reconstructs the hierarchical structure the frontend expects)
exports.getPreviousYearPapers = async (req, res) => {
    try {
        const papers = await PreviousYearPaper.find({});
        const nested = {};

        papers.forEach(p => {
            if (!nested[p.year]) nested[p.year] = {};
            if (!nested[p.year][p.exam]) nested[p.year][p.exam] = {};
            if (!nested[p.year][p.exam][p.dept]) nested[p.year][p.exam][p.dept] = {};
            if (!nested[p.year][p.exam][p.dept][p.subject]) {
                nested[p.year][p.exam][p.dept][p.subject] = { pdfs: [] };
            }
            nested[p.year][p.exam][p.dept][p.subject].pdfs.push({
                type: p.type,
                url: p.url
            });
        });

        res.json(nested);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch previous year papers" });
    }
};

// 3. Departments Info
exports.getDepartments = async (req, res) => {
    try {
        const depts = await Department.find({});
        const departmentsData = {};

        depts.forEach(d => {
            departmentsData[d.name] = {
                emoji: d.emoji,
                careerCode: d.careerCode,
                overview: d.overview,
                hod: d.hod,
                about: d.about,
                courses: d.courses,
                facilities: d.facilities,
                research: d.research,
                importantOrgs: d.importantOrgs,
                recruiting: d.recruiting,
                achievements: d.achievements
            };
        });

        res.json(departmentsData);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch departments data" });
    }
};

// 4. Department Career Stats
exports.getDepartmentCareerStats = async (req, res) => {
    try {
        const depts = await Department.find({});
        const internData = [];
        const placementData = [];

        depts.forEach(d => {
            if (d.careerCode) {
                if (d.internStats) {
                    internData.push({
                        department: d.careerCode,
                        code: d.internStats.code || d.careerCode.substring(0, 2).toUpperCase(),
                        ...d.internStats
                    });
                }
                if (d.placementStats) {
                    placementData.push({
                        department: d.careerCode,
                        code: d.placementStats.code || d.careerCode.substring(0, 2).toUpperCase(),
                        ...d.placementStats
                    });
                }
            }
        });

        res.json({ internData, placementData });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch department career stats" });
    }
};

// 5. Societies
exports.getSocieties = async (req, res) => {
    try {
        const societies = await Society.find({});
        res.json(societies);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch societies" });
    }
};

// 6. FAQs (Reconstructs grouped category structure)
exports.getFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find({});
        const grouped = {};

        faqs.forEach(f => {
            if (!grouped[f.category]) grouped[f.category] = [];
            grouped[f.category].push({
                q: f.q,
                a: f.a
            });
        });

        res.json(grouped);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch FAQs" });
    }
};

// 7. Lingo
exports.getLingo = async (req, res) => {
    try {
        const lingos = await Lingo.find({});
        res.json(lingos);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch campus lingo" });
    }
};

// 8. Events (Serve events locally)
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find({});
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch campus events" });
    }
};

// 9. JoSAA Cutoffs
exports.getJosaaCutoffs = async (req, res) => {
    try {
        const { year } = req.params;
        const cutoffs = await JosaaCutoff.find({ year });
        res.json(cutoffs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch JoSAA cutoffs" });
    }
};
