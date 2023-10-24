import "./App.css";
import { Routes, Route } from "react-router-dom";
import SignUpForm from "./Components/Signup";
import Home from "./Components/Home";
import UserPosts from "./Components/UserPosts";
import CommentedPosts from "./Components/CommentedPosts";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignUpForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/my-posts" element={<UserPosts />} />
        <Route path="/commented-posts" element={<CommentedPosts />} />
      </Routes>
    </>
  );
}

export default App;
