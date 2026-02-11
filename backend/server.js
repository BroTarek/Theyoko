const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const mailchimp = require("@mailchimp/mailchimp_transactional")(process.env.MAILCHIMP_API_KEY);

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to SQLite database');
        createTables();
    }
});

function createTables() {
    db.run(`CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT,
        email TEXT,
        phone_number TEXT,
        referral_source TEXT,
        experience_level TEXT,
        fields TEXT,
        position TEXT,
        company TEXT,
        countries_worked_in TEXT,
        achievements TEXT,
        status TEXT DEFAULT 'Unseen',
        is_archived INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) console.error('Error creating submissions table', err.message);
        // Migration: Add is_archived if it doesn't exist
        db.run(`ALTER TABLE submissions ADD COLUMN is_archived INTEGER DEFAULT 0`, (err) => {
            if (err && !err.message.includes('duplicate column name')) {
                // Ignore duplicate column error, only log others
            }
        });
    });

    db.run(`CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        submission_id INTEGER,
        file_name TEXT,
        file_path TEXT,
        document_type TEXT,
        FOREIGN KEY (submission_id) REFERENCES submissions(id)
    )`, (err) => {
        if (err) console.error('Error creating documents table', err.message);
    });

    db.run(`CREATE TABLE IF NOT EXISTS topics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    )`, (err) => {
        if (err) {
            console.error('Error creating topics table', err.message);
        } else {
            // Seed topics if empty
            db.get(`SELECT COUNT(*) as count FROM topics`, (err, row) => {
                if (row && row.count === 0) {
                    const topics = [
                        "Excutive Leadership (General management ,c-level , director)",
                        "Operations Management :Departement manager ,Manager",
                        "Sales",
                        "Marketing",
                        "Service",
                        "HR",
                        "Finance",
                        "digital marketing",
                        "CRM/CX",
                        "Logistics",
                        "Product",
                        "Others"
                    ];
                    const stmt = db.prepare(`INSERT INTO topics (name) VALUES (?)`);
                    topics.forEach(topic => stmt.run(topic));
                    stmt.finalize();
                    console.log('Topics seeded');
                }
            });
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        roles TEXT NOT NULL, -- JSON array of topic names
        applicants_count INTEGER DEFAULT 0,
        is_archived INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) console.error('Error creating companies table', err.message);
        // Migration: Add is_archived if it doesn't exist
        db.run(`ALTER TABLE companies ADD COLUMN is_archived INTEGER DEFAULT 0`, (err) => {
            if (err && !err.message.includes('duplicate column name')) {
                // Ignore duplicate column error
            }
        });
    });
}

// Mailchimp Email Function
const sendEmail = async (toEmail, name) => {
    try {
        const response = await mailchimp.messages.send({
            message: {
                from_email: process.env.MAILCHIMP_FROM_EMAIL || "info@theyoko.com",
                subject: "Application Received - TheYoko",
                text: `Hello ${name},\n\nThank you for your application to TheYoko. We have received your submission and our team will review it shortly.\n\nBest regards,\nTheYoko Team`,
                to: [
                    {
                        email: toEmail,
                        type: "to"
                    }
                ]
            }
        });
        console.log("Email sent successfully:", response);
        return response;
    } catch (error) {
        console.error("Error sending email:", error);
        // We don't throw so the submission still succeeds even if email fails
        return null;
    }
};

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Endpoint to manually send confirmation
app.post('/api/send-confirmation', async (req, res) => {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    const response = await sendEmail(email, name || "Applicant");
    if (response) {
        res.json({ message: "Confirmation email sent" });
    } else {
        res.status(500).json({ error: "Failed to send email" });
    }
});

// Get all topics with counts
app.get('/api/topics', (req, res) => {
    db.all(`SELECT * FROM topics`, [], (err, topics) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Failed to fetch topics' });
        }

        db.all(`SELECT roles FROM companies WHERE is_archived = 0`, [], (err, companyRows) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Failed to fetch companies' });
            }

            db.all(`SELECT fields FROM submissions WHERE is_archived = 0`, [], (err, submissionRows) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ error: 'Failed to fetch submissions' });
                }

                const topicsWithStats = topics.map(topic => {
                    const companiesCount = companyRows.filter(row => {
                        try {
                            const roles = JSON.parse(row.roles || '[]');
                            return roles.some(role => {
                                if (typeof role === 'string') return role === topic.name;
                                return role.name === topic.name;
                            });
                        } catch (e) { return false; }
                    }).length;

                    const applicantsCount = submissionRows.filter(row => {
                        try {
                            const fields = JSON.parse(row.fields || '[]');
                            return Array.isArray(fields) && fields.includes(topic.name);
                        } catch (e) { return false; }
                    }).length;

                    return {
                        ...topic,
                        companies_count: companiesCount,
                        applicants_count: applicantsCount
                    };
                });

                res.json(topicsWithStats);
            });
        });
    });
});

// Get companies by topic (alternative explicit route)
app.get('/api/companies/topic/:topic', (req, res) => {
    const { topic } = req.params;
    db.all(`SELECT * FROM companies WHERE is_archived = 0 AND roles LIKE ?`, [`%${topic}%`], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Failed to fetch companies' });
        }

        const companies = rows.map(row => ({
            ...row,
            roles: JSON.parse(row.roles || '[]')
        })).filter(c => {
            return c.roles.some(role => {
                const roleName = typeof role === 'string' ? role : role.name;
                return roleName === topic;
            });
        });

        res.json(companies);
    });
});

// Get companies by topic
app.get('/api/companies', (req, res) => {
    const { topic } = req.query;
    let query = `SELECT * FROM companies WHERE is_archived = 0`;
    let params = [];

    if (topic) {
        query = `SELECT * FROM companies WHERE is_archived = 0 AND roles LIKE ?`;
        params = [`%${topic}%`];
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Failed to fetch companies' });
        }

        const companies = rows.map(row => ({
            ...row,
            roles: JSON.parse(row.roles)
        }));

        // Final filter in case of partial matches in JSON
        if (topic) {
            res.json(companies.filter(c => {
                return c.roles.some(role => {
                    if (typeof role === 'string') return role === topic;
                    return role.name === topic;
                });
            }));
        } else {
            res.json(companies);
        }
    });
});

// Add a company
app.post('/api/companies', (req, res) => {
    const { name, roles } = req.body;
    if (!name || !roles || !Array.isArray(roles)) {
        return res.status(400).json({ error: 'Name and roles array are required' });
    }

    const applicants_count = Math.floor(Math.random() * 50) + 10; // Random for demo

    db.run(`INSERT INTO companies (name, roles, applicants_count) VALUES (?, ?, ?)`,
        [name, JSON.stringify(roles), applicants_count],
        function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Failed to add company' });
            }
            res.status(201).json({ id: this.lastID, name, roles, applicants_count });
        }
    );
});

// Get company by name
app.get('/api/companies/:name', (req, res) => {
    const { name } = req.params;
    db.get(`SELECT * FROM companies WHERE name = ?`, [name], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Failed to fetch company' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Company not found' });
        }
        res.json({
            ...row,
            roles: JSON.parse(row.roles)
        });
    });
});

// Update submission status
app.patch('/api/submissions/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    db.run(`UPDATE submissions SET status = ? WHERE id = ?`, [status, id], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Failed to update status' });
        }
        res.json({ message: 'Status updated successfully' });
    });
});

// Archive/Unarchive endpoints
app.post('/api/submissions/:id/archive', (req, res) => {
    const { id } = req.params;
    const { archive } = req.body;
    const status = archive ? 1 : 0;

    db.run(`UPDATE submissions SET is_archived = ? WHERE id = ?`, [status, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `Applicant ${archive ? 'archived' : 'unarchived'} successfully` });
    });
});

app.post('/api/companies/:id/archive', (req, res) => {
    const { id } = req.params;
    const { archive } = req.body;
    const status = archive ? 1 : 0;

    db.run(`UPDATE companies SET is_archived = ? WHERE id = ?`, [status, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `Company ${archive ? 'archived' : 'unarchived'} successfully` });
    });
});

// Get archived data
app.get('/api/archived/submissions', (req, res) => {
    db.all(`SELECT * FROM submissions WHERE is_archived = 1`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const submissions = rows.map(row => ({
            ...row,
            fields: row.fields ? JSON.parse(row.fields) : [],
            countries_worked_in: row.countries_worked_in ? JSON.parse(row.countries_worked_in) : []
        }));
        res.json(submissions);
    });
});

app.get('/api/archived/companies', (req, res) => {
    db.all(`SELECT * FROM companies WHERE is_archived = 1`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const companies = rows.map(row => ({
            ...row,
            roles: row.roles ? JSON.parse(row.roles) : []
        }));
        res.json(companies);
    });
});

// Submit form data
app.post('/api/submit', (req, res) => {
    const {
        full_name,
        email,
        phone_number,
        referral_source,
        experience_level,
        fields,
        position,
        company,
        countries_worked_in,
        achievements,
        documents
    } = req.body;

    const query = `INSERT INTO submissions (
        full_name, email, phone_number, referral_source, experience_level, 
        fields, position, company, countries_worked_in, achievements
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
        full_name,
        email,
        phone_number,
        referral_source,
        experience_level,
        JSON.stringify(fields),
        position,
        company,
        JSON.stringify(countries_worked_in),
        achievements
    ];

    db.run(query, params, function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Failed to save submission' });
        }

        const submissionId = this.lastID;

        // If there are documents, save them too
        if (documents && Array.isArray(documents)) {
            const docStmt = db.prepare(`INSERT INTO documents (submission_id, file_name, file_path, document_type) VALUES (?, ?, ?, ?)`);
            documents.forEach(doc => {
                docStmt.run(submissionId, doc.name, doc.path, doc.type);
            });
            docStmt.finalize();
        }

        // Trigger Confirmation Email
        sendEmail(email, full_name);

        res.status(201).json({
            message: 'Submission successful',
            id: submissionId
        });
    });
});

// Get submissions (supports filtering by company and/or topic)
app.get('/api/submissions', (req, res) => {
    const { company, topic } = req.query;
    let query = `SELECT * FROM submissions WHERE is_archived = 0`;
    let params = [];
    let conditions = [`is_archived = 0`];

    if (company) {
        conditions.push(`company = ?`);
        params.push(company);
    }

    if (topic) {
        conditions.push(`fields LIKE ?`);
        params.push(`%${topic}%`);
    }

    if (conditions.length > 0) {
        query = `SELECT * FROM submissions WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY created_at DESC`;

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Failed to fetch submissions' });
        }

        // Parse JSON strings back to arrays and do final filtering for topic to ensure exact match in JSON
        let submissions = rows.map(row => ({
            ...row,
            fields: row.fields ? JSON.parse(row.fields) : [],
            countries_worked_in: row.countries_worked_in ? JSON.parse(row.countries_worked_in) : []
        }));

        if (topic) {
            submissions = submissions.filter(s => s.fields.includes(topic));
        }

        res.json(submissions);
    });
});

// Get applicants by topic (requested endpoint)
app.get('/api/applicants/:topic', (req, res) => {
    const { topic } = req.params;
    db.all(`SELECT * FROM submissions WHERE fields LIKE ?`, [`%${topic}%`], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Failed to fetch applicants' });
        }

        const applicants = rows.filter(row => {
            try {
                const fields = JSON.parse(row.fields || '[]');
                return Array.isArray(fields) && fields.includes(topic);
            } catch (e) {
                return false;
            }
        }).map(row => ({
            ...row,
            fields: JSON.parse(row.fields || '[]'),
            countries_worked_in: row.countries_worked_in ? JSON.parse(row.countries_worked_in) : []
        }));

        res.json(applicants);
    });
});

// Get a single submission with documents
app.get('/api/submissions/:id', (req, res) => {
    const id = req.params.id;
    db.get(`SELECT * FROM submissions WHERE id = ?`, [id], (err, submission) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Failed to fetch submission' });
        }
        if (!submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        db.all(`SELECT * FROM documents WHERE submission_id = ?`, [id], (err, docs) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Failed to fetch documents' });
            }

            res.json({
                ...submission,
                fields: submission.fields ? JSON.parse(submission.fields) : [],
                countries_worked_in: submission.countries_worked_in ? JSON.parse(submission.countries_worked_in) : [],
                documents: docs
            });
        });
    });
});

// Delete a submission
app.delete('/api/submissions/:id', (req, res) => {
    const { id } = req.params;

    // Start a transaction to ensure both submission and documents are deleted
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        db.run(`DELETE FROM documents WHERE submission_id = ?`, [id], (err) => {
            if (err) {
                console.error(err.message);
                db.run('ROLLBACK');
                return res.status(500).json({ error: 'Failed to delete associated documents' });
            }

            db.run(`DELETE FROM submissions WHERE id = ?`, [id], function (err) {
                if (err) {
                    console.error(err.message);
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: 'Failed to delete submission' });
                }

                if (this.changes === 0) {
                    db.run('ROLLBACK');
                    return res.status(404).json({ error: 'Submission not found' });
                }

                db.run('COMMIT');
                res.json({ message: 'Submission and associated documents deleted successfully' });
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
