const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./express-app-init')(app);

app.listen(PORT, () => console.log(`Server start running on ${PORT}`));
