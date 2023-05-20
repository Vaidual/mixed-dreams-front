import React from 'react';
import './App.css';
import Header from './components/layout/header/Header';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Header/>
      <main className='px-4'>
        <Outlet/>
      </main>
    </div>
  );
}

export default App;
