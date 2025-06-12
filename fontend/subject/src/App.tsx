import './assets/header.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './components/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Body from './components/Body'
import ProtectedRoute from './components/ProtectedRoute'
import BodyAdmin from './components/BodyAdmin';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
      <Router>
        <Header></Header>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home/*" element={
            <ProtectedRoute>
              <Body />
            </ProtectedRoute>
          } />
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <BodyAdmin />
            </ProtectedRoute>
          } />
        </Routes>
        <Footer></Footer>
      </Router>
       <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

export default App



