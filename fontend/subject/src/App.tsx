import './assets/header.css'
import './App.css'
import Hello from './components/Hello'
import UseCard from './components/UseCard'
import Counter from './components/Counter'
import PostList from './components/PostList'
import Header from './components/Header'
import Footer from './components/Footer'
import Body from './components/Body'
import { Container, Typography, Button } from "@mui/material";
import Login from './components/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
    <Router>
       <Header></Header>
       
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Body />} />
      </Routes>
       <Footer></Footer>
       </Router>
       </> 
  )
}

export default App



