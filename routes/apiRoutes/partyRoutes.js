const express = require('express');
const router = express.Router();
const db = require('../../db/database.js');

router.get('/parties', (req, res) => {
    const sql = `SELECT * FROM parties`;
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

router.get('/party/:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

router.delete('/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'sucessfully deleted', changes: this.changes });
    });
});

// this will update candidate where party changed
router.put('/candidate/:id', (req, res) =>{
    // this will run inputCheck to verify a party id was entered
    const errors = inputCheck(req.body, 'party_id');
        if(errors){
            res.status(400).json({error : errors});
            return;
        }

    const sql = `UPDATE candidates SET party_id = ?
                WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    db.run(sql, params, function(err, result) {
        if(err){
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: req.body,
            changes: this.changes
        });
    });
});


module.exports = router;