const express = require('express');
const db = require('./db/database');

const PORT = process.env.PORT || 3001;
const app = express();

const apiRoutes = require('./routes/apiRoutes');
// express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// By adding the /api prefix here, we can remove it from the individual route expressions after we move them to their new home.
app.use('/api', apiRoutes);






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
