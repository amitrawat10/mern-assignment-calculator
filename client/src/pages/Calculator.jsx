import React, { useEffect, useState, useReducer } from "react";
import Button from "../components/Button";

const BUTTONS = [
  {
    label: "AC",
    class: "all-clear",
  },
  {
    label: "+/-",
    class: "negate operator",
  },
  {
    label: "%",
    class: "modulo operator",
  },
  {
    label: "÷",
    class: "divide operator",
  },
  {
    label: "7",
    class: "seven number",
  },
  {
    label: "8",
    class: "eight number",
  },
  {
    label: "9",
    class: "nine number",
  },
  {
    label: "×",
    class: "multiply operator",
  },
  {
    label: "4",
    class: "four number",
  },
  {
    label: "5",
    class: "five number",
  },
  {
    label: "6",
    class: "six number",
  },
  {
    label: "-",
    class: "minus operator",
  },
  {
    label: "1",
    class: "one number",
  },
  {
    label: "2",
    class: "two number",
  },
  {
    label: "3",
    class: "three number",
  },
  {
    label: "+",
    class: "plus operator",
  },
  {
    label: "0",
    class: "zero number",
  },
  {
    label: ".",
    class: "dot number",
  },
  {
    label: "=",
    class: "equal operator",
  },
];

export const ACTIONS = {
  CLEAR: "clear",
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operator",
  EVAL: "evaluate",
  UPDATE_STATE: "update-state",
};

const evaluate = (state) => {
  if (!state.currentValue || !state.prevValue || !state.operator) return "";
  const curr = parseFloat(state.currentValue);
  const prev = parseFloat(state.prevValue);
  if (isNaN(curr) || isNaN(prev)) return "";
  let result = "";
  switch (state.operator) {
    case "+":
      result = prev + curr;
      break;

    case "-":
      result = prev - curr;
      break;

    case "×":
      result = prev * curr;
      break;

    default:
      result = prev / curr;
      break;
  }

  return result.toString();
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite)
        return {
          ...state,
          currentValue: action.payload.digit,
          overwrite: false,
        };
      if (action.payload.digit === "0" && state.currentValue === "0")
        return state;

      if (state.currentValue === "0")
        return {
          ...state,
          currentValue: action.payload.digit,
        };
      if (action.payload.digit === "." && state.currentValue?.includes("."))
        return state;

      if (action.payload.digit === "." && state.currentValue == null)
        return {
          ...state,
          currentValue: `0.`,
        };
      return {
        ...state,
        currentValue: `${state.currentValue || ""}${action.payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentValue == null && state.prevValue == null) {
        return state;
      }

      if (action.payload.operator === "+/-") {
        return {
          ...state,
          currentValue: state.currentValue.startsWith("-")
            ? state.currentValue.substring(1)
            : `-${state.currentValue}`,
        };
      }

      if (state.currentValue === "0.") {
        return {
          ...state,
          prevValue: "0",
          operator: action.payload.operator,
          currentValue: "0",
        };
      }

      if (action.payload.operator === "%") {
        if (!state.prevValue && !state.operator) {
          return {
            ...state,
            currentValue: String(parseFloat(state.currentValue) / 100),
          };
        }

        if (state.prevValue && state.operator) {
          return {
            currentValue: String(parseFloat(state.prevValue) / 100),
            prevValue: null,
            operator: null,
          };
        }
      }

      if (state.currentValue == null) {
        return {
          ...state,
          operator: action.payload.operator,
        };
      }

      if (state.prevValue == null) {
        return {
          ...state,
          operator: action.payload.operator,
          prevValue: state.currentValue,
          currentValue: null,
        };
      }

      console.log(state);
      return {
        ...state,
        prevValue: evaluate(state),
        operator: action.payload.operator,
        currentValue: null,
      };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.EVAL:
      if (
        state.currentValue == null ||
        state.prevValue == null ||
        state.operator == null
      )
        return state;

      return {
        ...state,
        prevValue: null,
        prevValueTxt:
          state.prevValue + `${state.operator}` + state.currentValue,
        currentValue: evaluate(state),
        overwrite: true,
        operator: null,
      };

    case ACTIONS.UPDATE_STATE:
      if (!action.payload.calculation || !action.payload.result) return state;
      return {
        ...state,
        // prevValue: action.payload.calculation,
        currentValue: action.payload.result,
      };

    default:
      return state;
  }
};

const NUMBER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatNumber(number) {
  if (!number) return;
  const [integer, decimal] = number.split(".");
  if (decimal == null) return NUMBER_FORMATTER.format(integer);
  return `${NUMBER_FORMATTER.format(integer)}.${decimal}`;
}

const Calculator = () => {
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [btnValue, setBtnValue] = useState("Save");
  const [calculationName, setCalculationName] = useState("");
  const [{ currentValue, prevValue, operator, prevValueTxt }, dispatch] =
    useReducer(reducer, {});

  const getHistory = async () => {
    try {
      const json = await fetch(
        process.env.REACT_APP_SERVER_URL + "/calculator/history",
        {
          credentials: "include",
        }
      );

      const data = await json.json();
      console.log(data);
      setHistory(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  const handleSave = async () => {
    setError("");
    setBtnValue("Saving...");

    if (!calculationName.trim()) {
      setError("Please enter calculation name");
      setBtnValue("Save");
      return;
    }

    if (currentValue && !prevValueTxt) {
      setError("Calculation required two operands");
      setBtnValue("Save");
      return;
    }

    if (!currentValue || !prevValueTxt) {
      setError("No calculation found");
      setBtnValue("Save");
      return;
    }
    try {
      const json = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/calculator/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            calculationName,
            result: currentValue,
            calculation: prevValueTxt,
          }),
          credentials: "include",
        }
      );
      const data = await json.json();
      if (data.success) {
        getHistory();
      } else {
        setError(data.message);
      }
      setBtnValue("Save");
      setCalculationName("");
    } catch (error) {
      console.log(error);
      setBtnValue("Save");
      setError(error.response.data.message);
    }
  };

  const deleteCalculation = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_SERVER_URL}/calculator/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      // await json.json();
      getHistory();
    } catch (error) {
      console.log(error);
    }
  };

  const editHandler = async (id) => {
    const record = history.filter((his) => his._id === id)[0];
    dispatch({ type: ACTIONS.UPDATE_STATE, payload: record });
  };

  return (
    <div className="main">
      <div className="calculator-container">
        <div className="screen">
          <span className="prev-calculation">
            {prevValueTxt && prevValue == null ? prevValueTxt : prevValue}{" "}
            {operator}
          </span>
          <span>{formatNumber(currentValue)}</span>
        </div>

        <div className="buttons">
          {BUTTONS.map((button) => (
            <Button button={button} key={button.label} dispatch={dispatch} />
          ))}
        </div>

        <div className="input-container">
          <div>
            <input
              type="text"
              className={`input calc-input ${error ? "border-red" : ""}`}
              placeholder="Calculation Name"
              value={calculationName}
              onChange={(e) => {
                setCalculationName(e.target.value);
                setError("");
              }}
            />
            <button
              className={`submit-btn save ${
                btnValue !== "Save" ? "disabled" : ""
              }`}
              disabled={btnValue !== "Save" ? true : false}
              onClick={handleSave}
            >
              {btnValue}
            </button>
          </div>
          {error !== "" && <span className="input-error">{error}</span>}
        </div>
      </div>

      <div className="user-history">
        {history.length === 0 ? (
          <h2 className="text">Your History will appear here</h2>
        ) : (
          <div className="history-container">
            <table border={"1"} className="table">
              <thead>
                <th width={"35"}>Name</th>
                <th width={"25"}>Calculation</th>
                <th width={"20"}>Result</th>
                <th width={"20"}>Action</th>
              </thead>
              <tbody>
                {history.map((his) => (
                  <tr key={his._id}>
                    <td>{his.calculationName}</td>
                    <td>{his.calculation}</td>
                    <td>{his.result}</td>
                    <td className="action-btns">
                      <span onClick={() => editHandler(his._id)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="28"
                          height="28"
                          fill="white"
                          viewBox="0 0 16 16"
                        >
                          <polygon points="5,12 1.734,12 5.166,6.607 3.466,5.554 0,11 2,14 5,14"></polygon>
                          <polygon points="14.681,8.927 12.98,9.98 14.266,12 8.856,12 8.856,14 14,14 16,11"></polygon>
                          <polygon points="9.733,16 7,13 9.733,10 11,10 11,16"></polygon>
                          <polygon points="13.959,4.053 12.892,7.976 8.888,7.26 8.218,6.199 13.289,2.991"></polygon>
                          <polygon points="6.247,8.717 5.162,4.816 1.176,5.509 0.489,6.593 5.559,9.8"></polygon>
                          <polygon points="6.364,1 5.193,2.839 6.894,3.892 8,2.154 10.961,6.807 12.661,5.753 9.636,1"></polygon>
                        </svg>
                      </span>
                      {"  "}
                      <span onClick={() => deleteCalculation(his._id)}>
                        {" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="30"
                          height="30"
                          viewBox="0 0 48 48"
                          fill="white"
                        >
                          <path d="M 24 4 C 20.491685 4 17.570396 6.6214322 17.080078 10 L 10.238281 10 A 1.50015 1.50015 0 0 0 9.9804688 9.9785156 A 1.50015 1.50015 0 0 0 9.7578125 10 L 6.5 10 A 1.50015 1.50015 0 1 0 6.5 13 L 8.6386719 13 L 11.15625 39.029297 C 11.427329 41.835926 13.811782 44 16.630859 44 L 31.367188 44 C 34.186411 44 36.570826 41.836168 36.841797 39.029297 L 39.361328 13 L 41.5 13 A 1.50015 1.50015 0 1 0 41.5 10 L 38.244141 10 A 1.50015 1.50015 0 0 0 37.763672 10 L 30.919922 10 C 30.429604 6.6214322 27.508315 4 24 4 z M 24 7 C 25.879156 7 27.420767 8.2681608 27.861328 10 L 20.138672 10 C 20.579233 8.2681608 22.120844 7 24 7 z M 11.650391 13 L 36.347656 13 L 33.855469 38.740234 C 33.730439 40.035363 32.667963 41 31.367188 41 L 16.630859 41 C 15.331937 41 14.267499 40.033606 14.142578 38.740234 L 11.650391 13 z M 20.476562 17.978516 A 1.50015 1.50015 0 0 0 19 19.5 L 19 34.5 A 1.50015 1.50015 0 1 0 22 34.5 L 22 19.5 A 1.50015 1.50015 0 0 0 20.476562 17.978516 z M 27.476562 17.978516 A 1.50015 1.50015 0 0 0 26 19.5 L 26 34.5 A 1.50015 1.50015 0 1 0 29 34.5 L 29 19.5 A 1.50015 1.50015 0 0 0 27.476562 17.978516 z"></path>
                        </svg>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculator;
