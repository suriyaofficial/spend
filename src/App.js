import './App.css';
import React, { useState, useEffect } from "react";
import Login from './components/Login';
import Test from './components/Test';
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';

function App() {
  useEffect(() => {
    checkLogin()
  }, [0]);
  const [login, setLogin] = useState(false)
  const checkLogin = () => {
    let userData = localStorage.getItem("user")
    console.log("🚀 ~ file: App.js:10 ~ checkLogin ~ userData:", userData)
    if (userData) {
      setLogin(true)
      console.log("truuuuu");
    } else {
      console.log("false");
      setLogin(false)
    }
  }
  return (
    <>
      {login ?
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Test />} />
            <Route path="home" element={<Test />} />
            {/* <Route path="templates/temp1" element={<Preview />} />
            <Route path="templates/temp2" element={<Templete2 />} />
            <Route path="templates/temp3" element={<Developing />} />
            <Route path="templates/temp4" element={<Developing />} />
            <Route path="templates" element={<TemplateSelection />} /> */}
            {/* <Route path="about" element={<Aboutus />} /> */}
          </Routes>
        </Router> : <Login />}
    </>
  );
}

export default App;
