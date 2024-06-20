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


app.get('/boards', async (req, res) =>{
    const { category, query } = req.query;
    try{
        let boards;
        if(category){
            boards = await prisma.board.findMany({
                where: {
                    category: category
                }
            });
        }
        else if(query){
            boards = await prisma.board.findMany({
                where: {
                    OR: [
                        {
                            title: {
                                contains: query,
                                mode: 'insensitive' //case insensitive search
                            },
                        },
                    ]
                }
            })
        }
    }
})
