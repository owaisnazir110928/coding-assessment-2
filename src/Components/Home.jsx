import React, { useEffect, useState } from "react";
import axios from "axios";
import Topic from "./Topic"; // Import the Topic component

const Home = () => {
  const [topics, setTopics] = useState([]);
  const userId = localStorage.getItem("userId");
  const [topicContent, setTopicContent] = useState("");

  const handlePostTopic = () => {
    axios
      .post("http://localhost:3000/api/topics", {
        userId,
        content: topicContent,
      })
      .then((response) => {
        console.log("Topic posted:", response.data);
        // Handle success, e.g., update UI, show notifications, etc.
      })
      .catch((error) => {
        console.error("Error posting topic:", error);
        // Handle error, e.g., show error messages to the user
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/topics")
      .then((response) => {
        setTopics(response.data);
      })
      .catch((error) => {
        console.error("Error fetching topics:", error);
      });
  }, []);

  return (
    <div>
      <h1>Post a New Topic</h1>
      <div>
        <h2>Post a New Topic</h2>
        <textarea
          value={topicContent}
          onChange={(e) => setTopicContent(e.target.value)}
          placeholder="Enter your topic here..."
        />
        <button onClick={handlePostTopic}>Post Topic</button>
      </div>
      <h1>All Topics</h1>
      {topics.map((topic) => (
        <div key={topic._id}>
          {/* Use the Topic component to render each topic */}
          <Topic topic={topic} />
        </div>
      ))}
    </div>
  );
};

export default Home;
