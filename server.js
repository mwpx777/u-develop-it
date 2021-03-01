const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
// this will produce messages in terminal regarding the state of the runtime
const sqlite3 = require('sqlite3').verbose();
const inputCheck = require('./utils/inputCheck');

// express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connect to database
const db = new sqlite3.Database('./db/election.db', err => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the election database');
});


// get all candidates
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// get a single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates
                WHERE id =?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Success',
            data: row
        });
    });
});


// Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ error: res.message });
            return;
        }

        res.json({
            message: 'successfully deleted',
            changes: this.changes
        });
    });
});

//   create a candidate
app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) 
    VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];
    // ES5 function, not arrow function, to use `this`
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        res.json({
            message: 'success',
            data: body,
            id: this.lastID
        });
    });
});
    // this will run select query and display all of the seeds array of objects
    // db.all('SELECT * FROM candidates', (err, rows) => {
    //     console.log(rows);
    // });

    // get a single candidate
    // db.get('SELECT * FROM candidates WHERE id = 1', (err, row) =>{
    //     if (err){
    //         console.log(err);
    //     }
    //     console.log(row);
    // });

    // Delete a candidate
    // db.run(`DELETE FROM candidates WHERE id = ?`, 1, function(err, result) {
    //     if (err) {
    //       console.log(err);
    //     }
    //     console.log(result, this, this.changes);
    //   });

    // // Create a candidate
    // const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) VALUES (?,?,?,?)`;
    // const params = [1, 'Ronald', "Firbank", 1];

    // db.run(sql, params, function(err, result) {
    //     if (err){
    //         console.log(err);
    //     }
    //     console.log(result, this.lastID);
    // })


    // this always has to be at the bottom or it will run first 
    app.use((req, res) => {
        res.status(404).end();
    });



    // start server after database is connected
    db.on('open', () => {
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);

        })
    });