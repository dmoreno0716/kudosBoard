const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

app.listen(PORT, () =>{
    console.log(`Server is running on http://localhost:${PORT}`)
})

//middleware to parse json bodies, enable CORS for all routes
app.use(express.json());
app.use(cors());
