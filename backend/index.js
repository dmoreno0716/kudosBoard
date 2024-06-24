const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = 3001;

//middleware to parse json bodies, enable CORS for all routes
app.use(express.json());
app.use(cors());


//route to get boards with categories and queries (search)
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
            boards = await prisma.board.findMany({
              include: {
                cards: true,
              }
            });
        }
        return res.json(boards);
    }
    catch(e){
        console.error(e);
    }
})


//route to create board

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

//route to delete board
app.delete('/boards/:boardId', async (req, res) =>{
    const { boardId } = req.params
    const deletedBoard = await prisma.board.delete({
        where: { boardId: parseInt(boardId) }
    })
    res.json(deletedBoard);
})


//route to get specific board
app.get('/boards/:boardId', async (req, res) =>{
  const { boardId } = req.params;
  const board = await prisma.board.findUnique({
    where: { boardId: parseInt(boardId) },
    include: {
      cards: true,
    },
  });
  if (board) {
    res.json(board);
  }
  else{
    res.status(404).send('Board not found')
  }
});

  //route to create a card
  app.post('/boards/:boardId/cards', async (req, res) => {
    const { boardId } = req.params;
    const { title, author, upvotes, gif } = req.body;
    const newCard = await prisma.card.create({
      data: {
        boardId: parseInt(boardId),
        title,
        author,
        upvotes,
        gif
      },
    });
    res.json(newCard);
  });

  //route to delete card
  app.delete('/boards/:boardId/cards/:id', async (req, res) => {
    const { id } = req.params;
    const deletedCard = await prisma.card.delete({
      where: { id: parseInt(id) },
    });
    res.json(deletedCard);
  });

  //route to upvote
  app.patch('boards/:boardId/cards/:id/votes'), async (req, res) =>{
    const {id} = req.params
    const {upvotes} = req.body

    try{
      const updatedCard = await prisma.card.update({
        where: {
          id : parseInt(id),
        },
        data: {
          upvotes: upvotes,
        }
      });
      res.json(updatedCard)
    }
    catch (error) {
      console.error("Error updating upvotes", error);
      res.status(500).send("Failed to update votes");
    }
  }


  app.listen(PORT, () =>{
    console.log(`Server is running on http://localhost:${PORT}`)
})