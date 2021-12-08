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
/*app.get('/addnewpost', (req, res) => {
    res.render('addnewpost');
});*/

app.post('/addnewpost', async(req, res) => {
    try {
    console.log("a post request has arrived");
    const post = req.body;
    // TIME
    const time = now.getTime();
    const newpost = await pool.query(
    "INSERT INTO nodetable(title, body) values ($1, $2, $3) RETURNING*", [post.title, post.body, time]
    );
    res.json( newpost );
    } catch (err) {
    console.error(err.message);
    }
   });

   $(function() {
    $('#send').click(function() {
    let title = $('form input').val()
    let body = $('form textarea').val()
    //create a Json object composed of these two values
    let data = {
    "title": title,
    "body": body,
    }

    // instead of this I have to integrate here the POST request function (look above)
    $.post('https://jsonplaceholder.typicode.com/posts', data,
   function(response) {
    //to show the object to be send we output the result to the console
    console.log(response)
    })
    })
   });

app.use((req, res) => {
    res.status(404).render('404');
});