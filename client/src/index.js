import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Home from "./components/Home/Home";
import AddJob from "./components/addJob/AddJob";
import Job from "./components/job/Job";

import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/addjob" element={<AddJob />} />
        <Route path="/job/:id" element={<Job />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


reportWebVitals();
