import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Homepage.css";
import Newboardform from "./Newboardform";
import Header from './Header';
import Footer from "./Footer";

const HomePage = () => {
  const [boards, setBoards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategory, setFilteredCategory] = useState("");

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
     //const response = await axios.get("https://site-kudos-board-backend-exemplar.onrender.com/boards");
      setBoards(response.data.boards);
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  const renderBoards = () => {
    let filteredBoards = boards;

    if (searchQuery) {
      filteredBoards = filteredBoards.filter((board) =>
        board.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filteredCategory === "Recent") {
      filteredBoards.sort((a, b) => {
        const dateA = a.createdAt
          ? new Date(a.createdAt.replace(/\s/, "T"))
          : new Date(0);
        const dateB = b.createdAt
          ? new Date(b.createdAt.replace(/\s/, "T"))
          : new Date(0);

        return dateB - dateA;
      });
    } else if (filteredCategory) {
      filteredBoards = filteredBoards.filter(
        (board) => board.category === filteredCategory
      );
    } else {
      filteredBoards.sort((a, b) => {
        const dateA = a.createdAt
          ? new Date(a.createdAt.replace(/\s/, "T"))
          : new Date(0);
        const dateB = b.createdAt
          ? new Date(b.createdAt.replace(/\s/, "T"))
          : new Date(0);

        return dateA - dateB;
      });
    }

    return filteredBoards.map((board) => (
      <div key={board.board_id} className="board-preview">
        <img
          src={`https://picsum.photos/200/300?random=${board.board_id}`}
          alt={board.title}
        />
        <h3>{board.title}</h3>
        <p>{board.category}</p>
        <Link to={`/boards/${board.board_id}`} className="button-common view-board">
        View Board
      </Link>
        <button
          className="button-common delete-board"
          onClick={() => deleteBoard(board.board_id)}
        >
          Delete Board
        </button>
      </div>
    ));
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleCreateSuccess = () => {
    fetchBoards();
    setShowForm(false);
  };

  const deleteBoard = async (boardId) => {
    try {
      const response = await fetch(``,
         {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setBoards((prevBoards) =>
          prevBoards.filter((board) => board.board_id !== boardId)
        );
      } else {
        const text = await response.text();
        console.error(`Failed to delete Board ${boardId}.`, text);
      }
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  };

  const handleCategoryFilter = (category) => {
    setFilteredCategory(category);
  };

  return (
    <div className="home-page">
     <Header />

      <main className="search">
        <input
          type="text"
          placeholder="Search boards..."
          value={searchQuery}
          style={{width: '600px', height: '30px'}}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </main>

      <div className="category-buttons">
        <button
          className="button-common category-button"
          onClick={() => handleCategoryFilter("")}
        >
          All
        </button>
        <button
          className="button-common category-button"
          onClick={() => handleCategoryFilter("Recent")}
        >
          Recent
        </button>
        <button
          className="button-common category-button"
          onClick={() => handleCategoryFilter("Celebration")}
        >
          Celebration
        </button>
        <button
          className="button-common category-button"
          onClick={() => handleCategoryFilter("Thank You")}
        >
          Thank You
        </button>
        <button
          className="button-common category-button"
          onClick={() => handleCategoryFilter("Inspiration")}
        >
          Inspiration
        </button>
      </div>

      <div className="center-button-container" style={{textAlign: 'center'}}>
        <button className="button-common create-brd-btn" onClick={toggleForm}>
          Create a New Board
        </button>
        {showForm && (
          <Newboardform onSuccess={handleCreateSuccess} onClose={toggleForm} />
        )}
      </div>

      <section className="board-grid">{renderBoards()}</section>
      <Footer />
    </div>
  );
};

export default HomePage;
