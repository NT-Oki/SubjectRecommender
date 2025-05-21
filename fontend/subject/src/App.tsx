import './assets/header.css'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './components/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Body from './components/Body'

function App() {

  return (
    <>
    <Router>
       <Header></Header>
       
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Body/>} />
      </Routes>
       <Footer></Footer>
       </Router>
       </> 
  )
}

export default App



