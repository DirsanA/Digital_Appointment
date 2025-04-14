const express = require('express');
const cors = require('cors');
const doctorsRoutes = require('./routes/doctors');
const bodyParser = require('body-parser');
const PORT = 5000;

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json()); // handles JSON request bodies
app.use(cors());

app.use('/doctor', doctorsRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
