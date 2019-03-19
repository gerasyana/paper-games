const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

if (['production', 'ci'].includes(process.env.NODE_ENV)) {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send({status : 200});
  })
}

app.listen(PORT, () => console.log(`Server start running on ${PORT}`));
