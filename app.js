const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

const PORT = 8888;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
