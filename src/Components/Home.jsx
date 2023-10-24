import React, { useEffect, useState } from "react";
import axios from "axios";
import Topic from "./Topic";
import styles from "./Style/Home.module.css";
import { Discuss } from "react-loader-spinner";

const Home = () => {
  const [topics, setTopics] = useState([]);
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(true);

  const [topicContent, setTopicContent] = useState("");

  const handlePostTopic = () => {
    axios
      .post("https://codinground.onrender.com/api/topics", {
        userId,
        content: topicContent,
      })
      .then((response) => {
        console.log("Topic posted:", response.data);
        setTopics([response.data, ...topics]);
        setTopicContent("");
      })
      .catch((error) => {
        console.error("Error posting topic:", error);
      });
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://codinground.onrender.com/api/topics")
      .then((response) => {
        setTopics(response.data.reverse());
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching topics:", error);
        setLoading(false);
      });
  }, [topics.length]);

  return (
    <div className={styles.container}>
      <div className={styles.topicContainer}>
        <h2>Post a New Topic</h2>
        <textarea
          className={styles.textarea}
          value={topicContent}
          onChange={(e) => setTopicContent(e.target.value)}
          placeholder="What's on Your Mind..."
        />
        <button className={styles.button} onClick={handlePostTopic}>
          Post Topic
        </button>
      </div>
      <div className={styles.allTopics}>
        <h1 className={styles.heading}>Home</h1>
        {loading && (
          <div className={styles.loader}>
            <Discuss
              visible={true}
              height="130"
              width="130"
              ariaLabel="comment-loading"
              wrapperStyle={{}}
              wrapperClass="comment-wrapper"
              color="#fff"
              backgroundColor="#F4442E"
            />
          </div>
        )}
        {topics.map((topic) => (
          <div key={topic._id}>
            <Topic topic={topic} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
