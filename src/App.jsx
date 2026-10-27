import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Admin from "./pages/adminPage";
import { DemoDataProvider } from './demoData';

function App() {
  return (
    <DemoDataProvider>
    <div className="w-full h-screen">
      <Toaster position="top-center" />
      <Routes>
        <Route path="/admin/*" element={<Admin />} />        
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </div>
    </DemoDataProvider>
  );
}

export default App;
