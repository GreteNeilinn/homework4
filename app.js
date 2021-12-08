const express = require('express');
const pool = require('./database');

const app = express();

app.set('view engine', 'ejs');
app.listen(3000);


app.get('/', async(req, res) => {
    try {
        console.log("get posts request has arrived");
        const posts = await pool.query(
            "SELECT * FROM poststable"
        );
        res.json(posts.rows);
    } catch (err) {
        console.error(err.message);
    }
});


app.get('/:id', async(req, res) => {
    try {
        console.log("get a post request has arrived");
        const { id } = req.params;
        const posts = await pool.query(
            "SELECT * FROM nodetable WHERE id=$1", [id]
        );
        res.json(posts.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.get('/singlepost', (req, res) => {
    res.render('singlepost', { title: 'Single post' });
});
app.get('/addnewpost', (req, res) => {
    res.render('addnewpost');
});

app.use((req, res) => {
    res.status(404).render('404');
});