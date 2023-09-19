import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Calculator from "./pages/Calculator";
import { useUserContext } from "./contexts/userContext";

function App() {
  const { isAuth, loading } = useUserContext();
  return loading === true ? (
    <div className="App">
      <h1 className="text">Loading....</h1>
    </div>
  ) : (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <GuestRoute isAuth={isAuth}>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute isAuth={isAuth}>
                <Register />
              </GuestRoute>
            }
          />
          <Route
            path="/calculator"
            element={
              <ProtectedRoute isAuth={isAuth}>
                <Calculator />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

function GuestRoute({ isAuth, children }) {
  if (isAuth) return <Navigate to="/calculator" replace />;
  else return children;
}

function ProtectedRoute({ isAuth, children }) {
  if (!isAuth) return <Navigate to="/" replace />;
  else return children;
}

export default App;
