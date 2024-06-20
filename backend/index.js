const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = 3001;

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
        else{
            boards = await prisma.board.findMany();
        }
        return res.json(boards);
    }
    catch(e){
        console.error(e);
    }
})

app.post('/boards', async (req, res)=>{
    const {title, author, description, category, image, cards} = req.body;
    const newBoard = await prisma.board.create({
        data: {
            title,
            author,
            description,
            category,
            image,
            cards
        }
    })
    res.json(newBoard)
})

app.put('/boards/:id', async (req, res) =>{
    const { id } = req.params
    const {title, author, description, category, image, cards} = req.body
    const updatedBoard = await prisma.board.update({
        where: { id: pparseInt(id) },
        data: {
            title,
            author,
            description,
            category,
            image,
            cards
        }
    })
    res.json(updatedBoard)
})

app.delete('/boards/:id', async (req, res) =>{
    const { id } = req.params
    const deletedBoard = await prisma.book.delete({
        where: { id: parseInt(id) }
    })
    res.json(deletedBoard);
})
