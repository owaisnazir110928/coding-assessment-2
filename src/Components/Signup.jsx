import React, { useState } from "react";
import axios from "axios";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSendOtp = () => {
    // Send OTP to the user's email address (implement this function)
    axios
      .post("http://localhost:3000/api/send-otp", { email: formData.email })
      .then((response) => {
        setOtpSent(true);
        console.log(response.data);
      })
      .catch((error) => {
        // Handle error
        console.error("Error sending OTP:", error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Verify the OTP entered by the user (implement this function)
    axios
      .post("http://localhost:3000/api/verify-otp", {
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
        window.location.href = "/#/home";
      })
      .catch((error) => {
        // Handle error
        console.error("Error verifying OTP:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
      </label>
      {!otpSent ? (
        <button type="button" onClick={handleSendOtp}>
          Send OTP
        </button>
      ) : (
        <div>
          <label>
            OTP:
            <input type="text" value={otp} onChange={handleOtpChange} />
          </label>
          <button type="submit">Verify and Sign Up</button>
        </div>
      )}
    </form>
  );
};

export default SignUpForm;
