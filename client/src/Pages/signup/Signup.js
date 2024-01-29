import { Link } from "react-router-dom";
import "./Signup.scss";
import React, { useState } from "react";
import { axiosClient } from "../../utils/axiosClient";

function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await fetch(
        "https://insta-backend-wc4u.onrender.com/auth/signup",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );
      const res = await result.json();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="Signup">
      <div className="signup-box">
        <h2 className="heading">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="name"
            id="name"
            placeholder="Name"
            className="name"
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <input type="submit" className="submit" value="Sign Up" />
        </form>

        <div className="lines-text">
          <span>OR</span>
        </div>

        <p className="subheading">
          Already have an Account?
          <span>
            <Link to="/login">Log In</Link>
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
