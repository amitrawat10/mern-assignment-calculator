import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/userContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassowrd] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPassowrdError] = useState("");
  const [error, setError] = useState("");
  const [btnValue, setBtnValue] = useState("Login");

  const { login } = useUserContext();

  const navigate = useNavigate();

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
    setEmailError("");
    setPassowrdError("");
    setBtnValue("Please wait...");
    if (!email.trim() && !password.trim()) {
      setEmailError("please enter the email");
      setPassowrdError("please enter the password");
      setBtnValue("Login");
      return;
    }
    if (!password.trim()) {
      setPassowrdError("please enter the password");
      setBtnValue("Login");
      return;
    }
    if (!email.trim()) {
      setEmailError("please enter the email");
      setBtnValue("Login");
      return;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())
    ) {
      setEmailError("please enter a valid email");
      setBtnValue("Login");
      return;
    }

    try {
      const json = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        }
      );
      const data = await json.json();
      if (data.success) {
        login(data.success);
        setBtnValue("Login");

        navigate("/calculator");
      } else {
        setError(data.message);
        setBtnValue("Login");
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
      setBtnValue("Login");
    }
  };
  return (
    <div>
      <form className="submit-form" onSubmit={handleSubmit}>
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

        <button
          type="submit"
          className={`submit-btn ${btnValue !== "Login" ? "disabled" : ""}`}
          disabled={btnValue !== "Login" ? true : false}
        >
          {btnValue}
        </button>
        {error && <span className="input-error">{error}</span>}

        <span className="acc-txt text">
          Do not have account <NavLink to={"/register"}>Register here</NavLink>
        </span>
      </form>
    </div>
  );
};

export default Login;
