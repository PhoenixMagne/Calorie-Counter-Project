const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

const postData = require('./postData.json'); // Load application data

const PORT = process.env.PORT || 8000; // Set port from environment variable or default to 8000

app.set('view engine', 'ejs'); // Configure EJS as the view engine
app.set('views', path.join(__dirname, 'views')); // Set views directory explicitly


app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method}: ${req.url}`); //check time, method and url
  next();
});

app.use(express.static(path.join(__dirname, 'static'))); // Serve all files in the static/ directory at the root URL (css stuff,client stuff)

app.get('/', (req, res) => {// Route for the home page (all posts)
  res.render('index', { //Pass all posts and a flag to say its not a single post
    posts: postData,
    isSinglePostPage: false
  });
});

// Route for single post view
app.get('/posts/:n', (req, res, next) => { 
  const postIndex = parseInt(req.params.n);

  if (isNaN(postIndex) || postIndex < 0 || postIndex >= postData.length) {//handles invalid post index
    
    next(); // If invalid, pass control to the 404 handler
    return;
  }

  const singlePost = [postData[postIndex]];// Get the single post and wrap it in an array
  res.render('index', {//Render the index template with only one post and the single-post flag set
    posts: singlePost,
    isSinglePostPage: true
  });
});


app.use('*', (req, res) => { //Catches all requests that didn't match a route above, error handling stuff
  res.status(404).render('404');
});

app.listen(PORT, () => { //starts server
  console.log(`Server listening on port ${PORT}...`);
});
