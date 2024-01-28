import './App.css';
import * as React from 'react'

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react'

import Home from "./pages/Home";
import Login from './pages/Login';

function App() {
  return (
    <div className="App">
      <ChakraProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path ="/home" element={<Home />}/>
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
      
    </div>
  );
}

export default App;
