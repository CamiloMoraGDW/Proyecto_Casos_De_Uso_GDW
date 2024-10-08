import React from "react"
import ReactDom from "react-dom/client"
import { BrowserRouter as Router } from "react-router-dom"
import App from './App'
import { AuthProvider } from "./contexts/AuthContext"
import "./index.css"

const root = ReactDom.createRoot(document.getElementById('root'));

root.render(
  <AuthProvider>
    <Router>
      <App />
    </Router>
  </AuthProvider>
)