import React from "react";
import { ACTIONS } from "../pages/Calculator";
const Button = ({ button, dispatch }) => {
  const handleClick = (label) => {
    if (button.class.includes("number"))
      dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: label } });
    else if (button.class.includes("equal"))
      dispatch({
        type: ACTIONS.EVAL,
      });
    else if (button.class.includes("operator"))
      dispatch({
        type: ACTIONS.CHOOSE_OPERATION,
        payload: { operator: label },
      });
    else dispatch({ type: ACTIONS.CLEAR });
  };
  return (
    <button
      className={`calc-btn ${button.class} ${
        button.label === "+/-" || button.label === "AC" || button.label === "%"
          ? "grey"
          : ""
      }`}
      onClick={() => handleClick(button.label)}
    >
      {button.label}
    </button>
  );
};

export default Button;
