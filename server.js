const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.static(path.join(__dirname, 'static')));

function loadPosts() {
  // Ignoring food.json for now, this is just a placeholder if we want to add it
  return [];
}

app.get('/', (req, res) => {
  res.render('index', {
    posts: loadPosts(),
    isSinglePostPage: false
  });
});

app.get('/posts/:n', (req, res, next) => {
  const posts = loadPosts();
  const postIndex = Number.parseInt(req.params.n, 10);

  if (Number.isNaN(postIndex) || postIndex < 0 || postIndex >= posts.length) {
    next();
    return;
  }

  res.render('index', {
    posts: [posts[postIndex]],
    isSinglePostPage: true
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('*', (req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
