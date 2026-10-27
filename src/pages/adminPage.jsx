import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { MdDashboard, MdSensors, MdOutlineSecurity, MdLogout, MdBuild } from "react-icons/md";
import { FaMapMarkedAlt, FaUsers } from "react-icons/fa";
import { IoAlertCircle, IoDocumentText, IoSettingsSharp } from "react-icons/io5";

import AdminDashboard from "./admin/adminDashboard";
import AdminLiveMonitoring from './admin/adminLiveMonitoring';
import AdminSensorsDevices from './admin/AdmineEployers';
import AdminAlertsEmergencies from './admin/adminAlertsEmergencies';
import AdminSecurityPersonnel from './admin/adminSecurityPersonnel';
import AdminReportsAnalytics from './admin/adminReportsAnalytics';
import AdminSettings from './admin/adminSettings';
import AdminSensorHealth from './admin/adminSensorHealth';
import { useDemoData } from '../demoContext';

export default function Admin() {
  const { alerts } = useDemoData();
  const hasActiveAlerts = alerts.some(alert => alert.status !== 'Resolved');

  return (
    <div className="w-screen h-screen flex overflow-hidden relative">
      {/* ── Sidebar ── */}
      <div className="fixed top-0 left-0 h-screen w-[250px] bg-[#0F172A] flex flex-col z-40">
        <Link className="w-full h-[60px] bg-[#0F172A] text-[#60A5FA] border-b border-white/10 flex items-center justify-center font-bold text-lg tracking-wide shrink-0 hover:text-white transition" to="/admin">
          <MdOutlineSecurity className="mr-2" size={24} /> Security Grid
        </Link>
        
        <nav className="flex flex-col p-4 gap-2 flex-1 overflow-y-auto mt-2">
          <Link className="h-[46px] flex items-center gap-3 px-4 text-gray-300 hover:text-white hover:bg-blue-600 rounded-lg transition text-sm font-medium" to="/admin">
            <MdDashboard size={20} /> Dashboard
          </Link>
          <Link className="h-[46px] flex items-center gap-3 px-4 text-gray-300 hover:text-white hover:bg-blue-600 rounded-lg transition text-sm font-medium" to="/admin/monitoring">
            <FaMapMarkedAlt size={18} /> Live Monitoring
          </Link>
          <Link className="h-[46px] flex items-center gap-3 px-4 text-gray-300 hover:text-white hover:bg-blue-600 rounded-lg transition text-sm font-medium" to="/admin/employers">
            <MdSensors size={20} /> Employers  
          </Link>
          
          <Link 
            className={`h-[46px] flex items-center gap-3 px-4 rounded-lg transition text-sm font-medium ${  
              hasActiveAlerts 
              ? 'bg-red-600/80 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-500' 
              : 'text-gray-300 hover:text-white hover:bg-red-600'
            }`} 
            to="/admin/alerts"
          >
            <IoAlertCircle size={20} /> Alerts & Emergencies 
            {hasActiveAlerts && <span className="ml-auto w-2 h-2 rounded-full bg-white"></span>}
          </Link>

          <Link className="h-[46px] flex items-center gap-3 px-4 text-gray-300 hover:text-white hover:bg-blue-600 rounded-lg transition text-sm font-medium" to="/admin/sensor-health">
            <MdBuild size={18} /> Hardware Health
          </Link>
          
          <Link className="h-[46px] flex items-center gap-3 px-4 text-gray-300 hover:text-white hover:bg-blue-600 rounded-lg transition text-sm font-medium" to="/admin/personnel">
            <FaUsers size={18} /> Security Personnel
          </Link>
          
          <Link className="h-[46px] flex items-center gap-3 px-4 text-gray-300 hover:text-white hover:bg-blue-600 rounded-lg transition text-sm font-medium" to="/admin/reports">
            <IoDocumentText size={18} /> Reports & Analytics
          </Link>

          <div className="mt-auto pt-4 border-t border-white/10 flex flex-col gap-1">
            <Link className="h-[46px] flex items-center gap-3 px-4 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition text-sm font-medium" to="/admin/settings">
              <IoSettingsSharp size={18} /> Settings
            </Link>
            
            <button 
              onClick={() => toast('This frontend has no login session.')} 
              className="w-full h-[46px] flex items-center gap-3 px-4 text-red-400 hover:text-white hover:bg-red-600/80 rounded-lg transition text-sm font-medium outline-none"
            >
              <MdLogout size={18} /> Logout
            </button>
          </div>
        </nav>
      </div>

      {/* ── Main Content Area ── */}
      <div className="ml-[250px] flex-1 h-screen overflow-y-auto bg-[#F9FAFB]">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/monitoring" element={<AdminLiveMonitoring />} />
          <Route path="/employers" element={<AdminSensorsDevices />} />
          <Route path="/alerts" element={<AdminAlertsEmergencies />} />
          <Route path="/personnel" element={<AdminSecurityPersonnel />} />
          <Route path="/sensor-health" element={<AdminSensorHealth />} />
          <Route path="/reports" element={<AdminReportsAnalytics />} />
          <Route path="/settings" element={<AdminSettings />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </div>
  );
}
