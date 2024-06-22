const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = 3001;

//middleware to parse json bodies, enable CORS for all routes
app.use(express.json());
app.use(cors());

app.get('/boards', async (req, res) =>{
    console.log("test")
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

app.post('/boards/:boardId', async (req, res) =>{
  console.log("test");
})

app.post('/boards', async (req, res)=>{
    const {title, author, category, image} = req.body;
    const newBoard = await prisma.board.create({
        data: {
            title,
            author,
            category,
            image
        }
    })
    res.json(newBoard)
})

app.put('/boards/:id', async (req, res) =>{
    const { id } = req.params
    const {title, author, category, image, cards} = req.body
    const updatedBoard = await prisma.board.update({
        where: { id: pparseInt(id) },
        data: {
            title,
            author,
            category,
            image,
            cards
        }
    })
    res.json(updatedBoard)
})

app.delete('/boards/:id', async (req, res) =>{
    const { id } = req.params
    const deletedBoard = await prisma.board.delete({
        where: { id: parseInt(id) }
    })
    res.json(deletedBoard);
})

// app.get('/boards/:boardId/cards', async (req, res) => {
//   const { boardId } = req.params;
//   try {
//     cards = await prisma.board.findMany({
//       where: {
//           boardId : boardId
//       }
//   });
//     if (!cards) {
//       return res.status(404).json({ message: 'No cards found for this board' });
//     }
//     res.json(cards);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching cards' });
//   }
// })

app.get("/boards/:boardId", async (req, res) =>{
  const boardId = parseInt(req.params.boardId)

  const cards = await prisma.card.findMany(
    {
      where: {
        boardId
      }
    }
  );
  res.json(cards);
})

  app.post('/boards/:boardId/cards', async (req, res) => {
    const { boardId } = req.params;
    const { title, author, gif } = req.body;
    const newCard = await prisma.board.card.create({
      data: {
        boardId: parseInt(boardId, 10),
        title,
        author,
        gif 
      },
    });
    res.json(newCard);
  });
  app.put('/boards/:boardId/cards', async (req, res) => {
    const { id } = req.params;
    const { title, author, upvotes, gif, boardId } = req.body;
    const updatedCard = await prisma.card.update({
      where: { id: parseInt(id) },
      data: {
        title,
        author,
        upvotes,
        gif,
        boardId,
      },
    });
    res.json(updatedCard);
  });
  app.delete('/cards/:boardId', async (req, res) => {
    const { id } = req.params;
    const deletedCard = await prisma.card.delete({
      where: { id: parseInt(id) },
    });
    res.json(deletedCard);
  });


  app.listen(PORT, () =>{
    console.log(`Server is running on http://localhost:${PORT}`)
})