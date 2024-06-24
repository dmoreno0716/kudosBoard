import React, { useState } from "react";
import "./Card.css";
import axios from "axios";

const Card = ({ card, onDelete }) => {
  const { title, gif, owner } = card;
  const [votes, setVotes] = useState(card.votes || 0);

  const handleUpvote = async () => {
    try {
      await axios.patch(
        `http://localhost:3001/boards/${card.boardId}/cards/${card.id}/upvotes`,
        {
          upvotes: votes + 1,
        }
      );
    
      setVotes(votes + 1); 
    } catch (error) {
      console.error("Error upvoting card:", error);
    }
  };

  return (
    <div className="card">
      <h3>{title}</h3>
      <img src={gif} alt="GIF" />
      <p>{owner}</p>
      <button className='upvote-button' onClick={handleUpvote}>Upvote: {votes}</button>
      <button className="delete-button" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
};

export default Card;
