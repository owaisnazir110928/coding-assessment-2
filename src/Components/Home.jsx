import React, { useEffect, useState } from "react";
import axios from "axios";
import Topic from "./Topic";
import styles from "./Style/Home.module.css";

const Home = () => {
  const [topics, setTopics] = useState([]);
  const userId = localStorage.getItem("userId");
  const [topicContent, setTopicContent] = useState("");

  const handlePostTopic = () => {
    axios
      .post("https://codinground.onrender.com/api/topics", {
        userId,
        content: topicContent,
      })
      .then((response) => {
        console.log("Topic posted:", response.data);
        window.location.href="/#/home"
        // Handle success, e.g., update UI, show notifications, etc.
      })
      .catch((error) => {
        console.error("Error posting topic:", error);
      });
  };

  useEffect(() => {
    axios
      .get("https://codinground.onrender.com/api/topics")
      .then((response) => {
        setTopics(response.data);
      })
      .catch((error) => {
        console.error("Error fetching topics:", error);
      });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.topicContainer}>
        <h2>Post a New Topic</h2>
        <textarea
          className={styles.textarea}
          value={topicContent}
          onChange={(e) => setTopicContent(e.target.value)}
          placeholder="Enter your topic here..."
        />
        <button className={styles.button} onClick={handlePostTopic}>
          Post Topic
        </button>
      </div>
      <h1>All Topics</h1>
      {topics.map((topic) => (
        <div key={topic._id}>
          <Topic topic={topic} />
        </div>
      ))}
    </div>
  );
};

export default Home;
