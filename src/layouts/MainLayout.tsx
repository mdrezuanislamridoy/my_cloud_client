import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <div className="main-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <h1>MyCloud App</h1>
      </header>
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <footer style={{ padding: '1rem', borderTop: '1px solid #ccc', textAlign: 'center' }}>
        <p>&copy; {new Date().getFullYear()} MyCloud</p>
      </footer>
    </div>
  );
};

export default MainLayout;
