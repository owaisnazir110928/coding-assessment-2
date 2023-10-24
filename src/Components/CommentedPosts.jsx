import React, { useEffect, useState } from "react";
import axios from "axios";
import Topic from "./Topic";
import styles from "./Style/Home.module.css";
import { Discuss } from "react-loader-spinner";

const CommentedPosts = () => {
  const [topics, setTopics] = useState([]);
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://codinground.onrender.com/api/topics")
      .then((response) => {
        const commentedTopics = response.data.filter(
          (topic) => topic.comments.length > 0
        );
        setTopics(commentedTopics.reverse());
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching topics:", error);
        setLoading(false);
      });
  }, [userId]);

  return (
    <div className={styles.container}>
      <div className={styles.allTopics}>
        <h1 className={styles.heading}>My Posts</h1>
        <p>Sorted by Comments</p>
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

export default CommentedPosts;
