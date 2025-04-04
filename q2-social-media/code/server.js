
const express = require('express');
const routes = require('./routes');

const app = express();

const PORT = process.env.PORT || 9876;
app.use(express.json());

app.use('/', routes);

app.listen(PORT, () => {
  console.log('Server is running!');
  console.log(`You can access the server at: http://localhost:${PORT}`);
});
