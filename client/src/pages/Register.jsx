import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/userContext";
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassowrd] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPassowrdError] = useState("");
  const [error, setError] = useState("");

  const [btnValue, setBtnValue] = useState("Register");

  const navigate = useNavigate();

  const { login } = useUserContext();

  const handleNameChange = (e) => {
    setNameError("");
    setName(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmailError("");
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassowrdError("");
    setPassowrd(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNameError("");
    setEmailError("");
    setPassowrdError("");
    setBtnValue("Please wait...");
    if (!name.trim() && !email.trim() && !password.trim()) {
      setNameError("please enter the name");
      setEmailError("please enter the email");
      setPassowrdError("please enter the password");
      setBtnValue("Register");
      return;
    }
    if (!name.trim()) {
      setNameError("please enter the name");
      setBtnValue("Register");
      return;
    }
    if (!password.trim()) {
      setPassowrdError("please enter the password");
      setBtnValue("Register");
      return;
    }
    if (!email.trim()) {
      setEmailError("please enter the email");
      setBtnValue("Register");
      return;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())
    ) {
      setEmailError("please enter a valid email");
      setBtnValue("Register");
      return;
    }

    try {
      const json = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
          credentials: "include",
        }
      );
      const data = await json.json();
      if (data.success) {
        login(data.success);
        setBtnValue("Register");

        navigate("/calculator");
      } else {
        setError(data.message);
        setBtnValue("Register");
      }
    } catch (error) {
      console.log(error);
      setBtnValue("Register");

      setError(error.response.data.error);
    }
  };
  return (
    <div>
      <form className="submit-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full name"
          value={name}
          className={`input ${nameError ? "border-red" : ""}`}
          // required
          onChange={handleNameChange}
        />
        {nameError && <span className="input-error">{nameError}</span>}
        <input
          type="text"
          placeholder="Your email"
          value={email}
          className={`input ${emailError ? "border-red" : ""}`}
          // required
          onChange={handleEmailChange}
        />
        {emailError && <span className="input-error">{emailError}</span>}

        <input
          type="password"
          placeholder="Your password"
          value={password}
          className={`input ${passwordError ? "border-red" : ""}`}
          // required
          onChange={handlePasswordChange}
        />
        {passwordError && <span className="input-error">{passwordError}</span>}
        {error && <span className="input-error">{error}</span>}

        <button
          type="submit"
          className={`submit-btn ${btnValue !== "Register" ? "disabled" : ""}`}
          disabled={btnValue !== "Register" ? true : false}
        >
          {btnValue}
        </button>
        <span className="acc-txt text">
          already have an account <NavLink to={"/"}>Login here</NavLink>
        </span>
      </form>
    </div>
  );
};

export default Register;
