import React, { useEffect, useState } from "react";
import axios from "axios";
import Topic from "./Topic";
import styles from "./Style/Home.module.css";
import { Discuss } from "react-loader-spinner";
import Navbar from "./Navbar";

const UserPosts = () => {
  const [topics, setTopics] = useState([]);
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://codinground.onrender.com/api/topics")
      .then((response) => {
        const userTopics = response.data.filter(
          (topic) => topic.user._id === userId
        );
        setTopics(userTopics.reverse());
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching topics:", error);
        setLoading(false);
      });
  }, [topics.length]);

  return (
    <div className={styles.extraCont}>
      <Navbar />
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
    </div>
  );
};

export default UserPosts;
