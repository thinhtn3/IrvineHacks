import './App.css';
import * as React from 'react'

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react'

import Home from "./pages/Home";
function App() {
  return (
    <div className="App">
      <ChakraProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
      
    </div>
  );
}

export default App;
