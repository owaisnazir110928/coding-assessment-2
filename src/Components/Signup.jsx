import React, { useState } from "react";
import axios from "axios";
import styles from "./Style/Signup.module.css";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSendOtp = () => {
    setLoading(true);
    axios
      .post("https://codinground.onrender.com/api/send-otp", {
        email: formData.email,
      })
      .then((response) => {
        setOtpSent(true);
        setLoading(false);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error sending OTP:", error);
        setError("Error sending OTP. Please try again.");
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("https://codinground.onrender.com/api/verify-otp", {
        name: formData.name,
        email: formData.email,
        otp,
      })
      .then((response) => {
        console.log(
          "User verified and registered successfully:",
          response.data
        );
        localStorage.setItem("userId", response.data.id);
        setLoading(false);
        window.location.href = "/#/home";
      })
      .catch((error) => {
        console.error("Error verifying OTP:", error);
        setError("Invalid OTP. Please try again.");
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h1 className={styles.heading}>Sign Up</h1>
      {error && <p className={styles.error}>{error}</p>}
      <input
        className={styles.input}
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        disabled={otpSent}
        onChange={handleInputChange}
        required
      />
      <input
        className={styles.input}
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        disabled={otpSent}
        onChange={handleInputChange}
        required
      />
      {otpSent && (
        <p className={styles.success}>
          {"OTP Sent Successfully. Valid for 2 mins"}
        </p>
      )}
      {!otpSent ? (
        <button
          type="button"
          onClick={handleSendOtp}
          className={styles.button}
          disabled={loading}
        >
          {loading && "Loading..."}
          {!loading && "Send OTP"}
        </button>
      ) : (
        <div className={styles.secondCont}>
          <input
            type="text"
            value={otp}
            onChange={handleOtpChange}
            placeholder="OTP"
            className={styles.input}
          />
          <button className={styles.button} type="submit" disabled={loading}>
            {loading && "Loading..."}
            {!loading && "Verify and Sign Up"}
          </button>
          <div
            className={styles.reset}
            onClick={() => {
              window.location.reload();
            }}
          >
            reset
          </div>
        </div>
      )}
    </form>
  );
};

export default SignUpForm;
