// backend integrtion to diet management wbsite 
// to store data "add meal" and display it even after refresh

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


//MySQL Connection (XAMPP default)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'diet_db',
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected!');
});

//GET all meals
app.get('/api/meals', (req, res) => {
    db.query('SELECT * FROM meals ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json({error: err});
        res.json(results);
    });
});

//POST new meal
app.post('/api/meals', (req, res) => {
    const { food_name, calories } = req.body;
    db.query('INSERT INTO meals (food-name, calories) VALUES (?, ?)',
        [food_name, calories],
        (err, result) => {
            if (err) return res.status(500).json({error: err});
            res.json({ id: result.insertId, food_name, calories:calories });

        }
    );
});


//DELETE meals
app.delete('/api/meals/:id', (req, res) => {
    db.query('DELETE FROM meals WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({error: err});
        res.json({ success: true});
        
    });
});

//get total calories
app.get('/api/meals', (req, res) => {
    db.query('SELECT SUM(calories) as total FROM meals', (err, results) => {
        res.json({ total: results[0].total || 0 });
    });
});

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});