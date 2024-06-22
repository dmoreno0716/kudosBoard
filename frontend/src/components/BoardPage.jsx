import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Card from "./Card";
import CardForm from "./CardForm";
import Footer from "./Footer";
import Header from "./Header";
import "./Boardpage.css";

const BoardPage = () => {
  const { boardId } = useParams();
  const [boardTitle, setBoardTitle] = useState("");
  const [cards, setCards] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCards();
    fetchBoardData();
  }, [boardId]);

  const fetchCards = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/boards/${boardId}`
      );
      setCards(response.data);
      console.log(cards)

    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  const fetchBoardData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/board/${boardId}`
      );
      const title = response.data.board.title;

      setBoardTitle(title);

    } catch (error) {
      console.error("Error fetching board data:", error);
    }
  };

  const handleDelete = async (cardId) => {
    try {
      await axios.delete(
        `http://localhost:3001/boards/${boardId}/card/${cardId}`
      );
      fetchCards();
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleCreateSuccess = (newCard) => {
    if (newCard && newCard.card_id) {
      setCards([...cards, newCard]);
      setShowForm(false);
    } else {
      console.error("Invalid card data received:", newCard);
    }
  };

  return (
    <div>
      <Link to="/">
        <span className="back-arrow"></span>
      </Link>
      <Header />
      <h2> {boardTitle}</h2>
      <div className="center-create-button">
        <button className="create-card-btn" onClick={toggleForm}>
          Create a Card
        </button>
        {showForm && (
          <CardForm
            boardId={boardId}
            onSuccess={handleCreateSuccess}
            onClose={toggleForm}
          />
        )}
      </div>

      <div className="card-list">
        {cards.map((card) => (
          <div className="card-preview">
            <Card
              key={card.card_id}
              card={card}
              onDelete={() => handleDelete(card.id)}
            />
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default BoardPage;