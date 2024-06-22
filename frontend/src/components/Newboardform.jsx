import React, { useState } from "react";
import axios from "axios";
import "./Newboardform.css";

const NewBoardForm = ({ onSuccess, onClose }) => {
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [newBoardCategory, setNewBoardCategory] = useState("");
  const [newBoardAuthor, setNewBoardAuthor] = useState("");

  const categories = ["Recent", "Celebration", "Thank You", "Inspiration"];

  const createNewBoard = async () => {
    try {
      if (!newBoardTitle || !newBoardCategory || !newBoardAuthor) {
        alert("Please fill out all fields");
        return; 
      }
      await axios.post("http://localhost:3001/boards", {
        title: newBoardTitle,
        category: newBoardCategory,
        owner: newBoardAuthor,
      });

      onSuccess();

      setNewBoardTitle("");
      setNewBoardCategory("");
      setNewBoardAuthor("");

      onClose();
    } catch (error) {
      console.error("Error creating a new board:", error);
    }
  };

  return (
    <div className="overlay">
      <div className="new-board-form">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <h2>Create a New Board</h2>
        <label>Title:</label>
        <input
          type="text"
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.target.value)}
          required
        />
        <label>Category:</label>
        <select
          value={newBoardCategory}
          onChange={(e) => setNewBoardCategory(e.target.value)}
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label>Author:</label>
        <input
          type="text"
          value={newBoardAuthor}
          onChange={(e) => setNewBoardAuthor(e.target.value)}
        />
        <button className="submit" onClick={createNewBoard}>
          Create Board
        </button>
      </div>
    </div>
  );
};

export default NewBoardForm;
