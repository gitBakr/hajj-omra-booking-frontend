import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import FormulairePelerin from './components/FormulairePelerin'
import AdminOffres from './components/AdminOffres'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormulairePelerin />} />
        <Route path="/admin/offres" element={<AdminOffres />} />
      </Routes>
    </Router>
  )
}

export default App 