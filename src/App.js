import "./App.css"
import Welcome from "./components/Welcome"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Homepage from "./components/Homepage"
import Share from "./components/Share"
import Fetch from "./components/fetch"
function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/share" element={<Share />} />
          <Route path="/fetch" element={<Fetch />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
