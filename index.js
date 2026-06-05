require('dotenv').config();
const express = require('express');
const prisma = require('./prismaClient');
const appRoutes = require('./routes/routing');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//Route
app.use('/', appRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
