import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [harryImage, setHarryImage] = useState("");
  const [catFact, setCatFact] = useState("");

  useEffect(() => {
    // Set a default image URL
    setHarryImage("https://upload.wikimedia.org/wikipedia/en/d/d7/Harry_Potter_character_poster.jpg?20210608000322");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      // Update Harry's image if provided in the response
      if (data.imageUrl) {
        setHarryImage(data.imageUrl);
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCatFact = async () => {
    try {
      const response = await fetch("https://testworker.s777345.workers.dev/");
      if (!response.ok) {
        throw new Error("Failed to fetch cat fact");
      }
      const data = await response.json();
      setCatFact(data.catFact);
    } catch (error) {
      console.error("Error fetching cat fact:", error);
      setCatFact("Failed to fetch cat fact. Please try again.");
    }
  };

  return (
    <div className="App">
      <h1>Chat with Harry Potter AI</h1>
      <div className="chat-interface">
        <div className="harry-image">
          <img src={harryImage} alt="Harry Potter" />
        </div>
        <div className="chat-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <strong>{message.role === "user" ? "You" : "Harry Potter"}:</strong> {message.content}
            </div>
          ))}
          {isLoading && (
            <div className="message assistant">
              <strong>Harry Potter:</strong> Thinking...
            </div>
          )}
          {error && <div className="error">Error: {error}</div>}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Harry Potter something..." disabled={isLoading} />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
      <div className="cat-fact-section">
        <button onClick={fetchCatFact}>Get Cat Fact</button>
        {catFact && (
          <div className="cat-fact">
            <strong>Cat Fact:</strong> {catFact}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
