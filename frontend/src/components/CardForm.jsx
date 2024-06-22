import React, { useState } from "react";
import axios from "axios";
import './CardForm.css'

const CardForm = ({ boardId, onSuccess, onClose }) => {
  const [title, setTitle] = useState("");
  const [gif, setGif] = useState("");
  const [owner, setOwner] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [gifOptions, setGifOptions] = useState([]);
  const [selectedGifUrl, setSelectedGifUrl] = useState("");

  const apiKey = import.meta.env.VITE_GIPHY_API_KEY;

  const searchGifs = async () => {
    try {
      const response = await axios.get("https://api.giphy.com/v1/gifs/search", {
        params: {
          api_key: apiKey,
          q: searchTerm,
          limit: 6,
        },
      });

      const gifData = response.data.data;
      const gifUrls = gifData.map((gif) => gif.images.original.url);
      setGifOptions(gifUrls);
    } catch (error) {
      console.error("Error searching for GIFs:", error);
    }
  };

  const handleSelectGif = (gifUrl) => {
    setSelectedGifUrl(gifUrl);
    setGif(gifUrl);
    setGifOptions([]);
  };

  const handleCopyGifUrl = () => {
    setGif(selectedGifUrl);
  };

  const createNewCard = async () => {
    try {
      if (!title || !gif) {
        alert("Please fill out all fields");
        return;
      }
      const response = await axios.post(
        `http://localhost:3001/boards/${boardId}/cards`,
        {
          title,
          gif,
          owner,
        }
      );

      const newCard = response.data;

      onSuccess(newCard);
      setTitle("");
      setGif("");
      setOwner("");

      onClose();
    } catch (error) {
      console.error("Error creating card:", error);
    }
  };

  return (
    <div className="overlay">
      <div className="new-card-form">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <h2>Create a New Card</h2>
        <input
          type="text"
          placeholder="Enter card title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Search GIFs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button" type="search" onClick={searchGifs}>
          Search
        </button>
        {gifOptions.length > 0 && (
          <div className="gif-options">
            {gifOptions.map((gifUrl) => (
              <div className="gif-container">
                <img
                  className="gif"
                  key={gifUrl}
                  src={gifUrl}
                  alt="GIF"
                  onClick={() => handleSelectGif(gifUrl)}
                />
              </div>
            ))}
          </div>
        )}
        <input
          type="text"
          placeholder="Enter GIF URL"
          value={gif}
          onChange={(e) => setGif(e.target.value)}
        />
        <button
          className="copy-button"
          type="button"
          onClick={handleCopyGifUrl}
        >
          Copy GIF URL
        </button>
        <input
          type="text"
          placeholder="Enter owner (optional)"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />
        <button className="submit" onClick={createNewCard}>
          Create Card
        </button>
      </div>
    </div>
  );
};

export default CardForm;