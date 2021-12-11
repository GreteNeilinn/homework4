const express = require('express');
const pool = require('./database');
const cors = require('cors');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.listen(3000, () => {
    console.log("Server is listening to port 3000")
});

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/posts', async(req, res) => {
    try {
        console.log("get posts request has arrived");
        const posts = await pool.query(
            "SELECT * FROM poststable ORDER BY id"
        );
        res.render('posts', { posts: posts.rows });
    } catch (err) {
        console.error(err.message);
    }
});

app.put('/posts/:id/:likes', async(req, res) => {
    try {
        console.log("update request has arrived");
        const id = req.params.id;
        let nrOfLikes = parseInt(req.params.likes) + 1;
        const updatepost = await pool.query(
            'UPDATE poststable SET likes = $1 WHERE id = $2', [nrOfLikes, id]
        );
        res.send('Success');
    } catch (err) {
        console.error(err.message);
    }
});

/*
app.get('/:id', async(req, res) => {
    try {
        console.log("get a post request has arrived");
        const { id } = req.params;
        const posts = await pool.query(
            "SELECT * FROM poststable WHERE id=$1", [id]
        );
        res.json(posts.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

*/


app.get('/singlepost', async(req, res) => {
    try {
        const id = req.params.id;
        console.log(req.params.id);
        console.log("get a single post request has arrived");
        const posts = await pool.query(
            "SELECT * FROM poststable WHERE id = $1", [id]
        );
        res.render('singlepost', { posts: posts.rows[0] });
    } catch (err) {
        console.error(err.message);
    }

});

app.delete('/posts/:id', async(req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params;
        const post = req.body;
        console.log("delete a post request has arrived");
        const deletepost = await pool.query(
            "DELETE FROM poststable WHERE id = $1", [id]
        );
        res.redirect('posts');
    } catch (err) {
        console.error(err.message);
    }
});
app.post('/addnewpost', async(req, res) => {
    try {
        const post = req.body;
        console.log(post);
        const newpost = await pool.query(
            "INSERT INTO poststable(datetime, title, body, image, likes) values ($1, $2, $3, $4, $5) RETURNING * ", [post.datetime, post.title, post.body, post.image, post.likes]
        );
        res.redirect('posts');

    } catch (err) {
        console.error(err.message);
    }
});


/*
   //const datetime = document.getElementById('inputTime').value=new Date().toJSON().slice(0,16)
   console.log("a post request has arrived");
   const { datetime, title, body, image, likes } = req.body;
   //const post = req.body;
   const newpost = await pool.query(
   "INSERT INTO poststable (datetime, title, body, image, likes) values ($1, $2, $3, $4, $5) RETURNING*", [post.datetime, post.title, post.body, post.image, post.likes]
   );
   //res.json( newpost );
   res.json(newpost);*/

app.get('/addnewpost', (req, res) => {
    res.render('addnewpost');
});

app.use((req, res) => {
    res.status(404).render('404');
});

//app.post('/addnewpost', function(req, res) {
//  return res.redirect('addnewpost');
//});