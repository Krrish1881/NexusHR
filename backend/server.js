const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());
// Parse JSON bodies
app.use(express.json());

// Database file path
const dbPath = path.join(__dirname, 'db.json');

// Helper function to read database
function readDatabase() {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading database:', err);
        return { candidates: [] };
    }
}

// Helper function to write to database
function writeDatabase(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error('Error writing to database:', err);
        return false;
    }
}

// API Routes

// Get all candidates
app.get('/api/candidates', (req, res) => {
    const db = readDatabase();
    res.json(db.candidates);
});

// Add a new candidate
app.post('/api/candidates', (req, res) => {
    const db = readDatabase();
    const newCandidate = req.body;
    
    // Simple validation
    if (!newCandidate.name || !newCandidate.title || !newCandidate.department) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    newCandidate.id = Date.now().toString();
    db.candidates.push(newCandidate);
    
    if (writeDatabase(db)) {
        res.status(201).json(newCandidate);
    } else {
        res.status(500).json({ error: 'Failed to save candidate' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
    // Initialize database if empty
    const db = readDatabase();
    if (db.candidates.length === 0) {
        const initialData = {
            candidates: [
                {
                    id: "1",
                    name: "Alex Johnson",
                    title: "Senior Software Engineer",
                    department: "Engineering",
                    description: "Experienced full-stack developer with expertise in JavaScript frameworks.",
                    skills: ["JavaScript", "React", "Node.js", "TypeScript"],
                    experience: "7",
                    location: "San Francisco"
                },
                {
                    id: "2",
                    name: "Maria Garcia",
                    title: "UX Designer",
                    department: "Design",
                    description: "Creative designer focused on user-centered design principles.",
                    skills: ["UI/UX", "Figma", "Prototyping", "User Research"],
                    experience: "4",
                    location: "New York"
                },
                {
                    id: "3",
                    name: "James Wilson",
                    title: "Marketing Manager",
                    department: "Marketing",
                    description: "Digital marketing expert with strong analytics skills.",
                    skills: ["Digital Marketing", "SEO", "Content Strategy"],
                    experience: "5",
                    location: "Chicago"
                },
                {
                    id: "4",
                    name: "Sarah Lee",
                    title: "HR Specialist",
                    department: "HR",
                    description: "Dedicated HR professional with focus on talent development.",
                    skills: ["Recruitment", "Training", "Employee Relations"],
                    experience: "3",
                    location: "Boston"
                },
                {
                    id: "5",
                    name: "David Kim",
                    title: "Sales Director",
                    department: "Sales",
                    description: "Proven track record in enterprise sales and account management.",
                    skills: ["B2B Sales", "Account Management", "Negotiation"],
                    experience: "8",
                    location: "Austin"
                },
                {
                    id: "6",
                    name: "Priya Patel",
                    title: "Quality Assurance Engineer",
                    department: "Engineering",
                    description: "Detail-oriented QA engineer with automation experience.",
                    skills: ["Testing", "Automation", "Selenium", "Python"],
                    experience: "2",
                    location: "Remote"
                }
            ]
        };
        writeDatabase(initialData);
        console.log('Initialized database with sample data');
    }
});
