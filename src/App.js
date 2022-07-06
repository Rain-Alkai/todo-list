
import './App.css';
import Welcome from "./components/Welcome";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Homepage from "./components/Homepage";
import Share from "./components/Share";
function App() {
  return (
    <div className="app">
       <Router>
        <Routes>
          <Route path="/" element={<Welcome />}/>
          <Route path="/homepage" element={<Homepage />}/>
          <Route path="/share" element={<Share />}/>
        </Routes>
    </Router>
    </div>
  );
}

export default App;
