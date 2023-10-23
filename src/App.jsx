import "./App.css";
import { Routes, Route } from "react-router-dom";
import SignUpForm from "./Components/Signup";
import Home from "./Components/Home";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignUpForm />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
