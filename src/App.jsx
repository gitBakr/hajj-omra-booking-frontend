import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import FormulairePelerin from './components/FormulairePelerin'
import AdminPanel from './components/admin/AdminPanel'
import OffresManager from './components/admin/OffresManager'
import './App.css'

// Composant de protection des routes admin
const AdminRoute = ({ children }) => {
  // Vérification simple basée sur l'email stocké (à améliorer en production)
  const isAdmin = localStorage.getItem('userEmail') === 'raouanedev@gmail.com'
  return isAdmin ? children : <Navigate to="/" />
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormulairePelerin />} />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/offres" 
          element={
            <AdminRoute>
              <OffresManager />
            </AdminRoute>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App 