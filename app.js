const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/api/users', userRoutes);

const PORT = 8888;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
