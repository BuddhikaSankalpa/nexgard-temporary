import { useEffect, useState } from 'react';
import { DemoDataContext } from './demoContext';

const STORAGE_KEY = 'security-grid-demo-v2';

const sampleAlerts = [
  { _id: 'sample-button-1', type: 'Button Emergency', status: 'Pending', location: 'A1 - A101', createdAt: '2026-06-30T23:26:14+05:30', description: 'Triggered via MQTT Button Alert' },
  { _id: 'sample-button-2', type: 'Button Emergency', status: 'Resolved', location: 'A1 - A101', createdAt: '2026-06-30T23:25:56+05:30', description: 'Triggered via MQTT Button Alert' },
  { _id: 'sample-button-3', type: 'Button Emergency', status: 'Resolved', location: 'A1 - A101', createdAt: '2026-06-30T23:25:56+05:30', description: 'Triggered via MQTT Button Alert' },
  { _id: 'sample-button-4', type: 'Button Emergency', status: 'Resolved', location: 'A1 - A101', createdAt: '2026-06-30T23:25:18+05:30', description: 'Triggered via MQTT Button Alert' },
  { _id: 'sample-button-5', type: 'Button Emergency', status: 'Resolved', location: 'A1 - A101', createdAt: '2026-06-30T23:24:03+05:30', description: 'Triggered via MQTT Button Alert' },
];

const initialData = {
  employees: [
    { _id: 'emp-1', employeeId: 'EMP-001', firstName: 'Kasun', lastName: 'Perera', email: 'kasun@example.com', phone: '0771234567', emergencyContactName: 'Nimali Perera', emergencyContactNumber: '0772345678' },
    { _id: 'emp-2', employeeId: 'EMP-002', firstName: 'Nadeesha', lastName: 'Silva', email: 'nadeesha@example.com', phone: '0773456789', emergencyContactName: 'Saman Silva', emergencyContactNumber: '0774567890' },
    { _id: 'emp-3', employeeId: 'EMP-003', firstName: 'Ravindu', lastName: 'Fernando', email: 'ravindu@example.com', phone: '0711234567', emergencyContactName: 'Tharushi Fernando', emergencyContactNumber: '0712345678' },
    { _id: 'emp-4', employeeId: 'EMP-004', firstName: 'Dinuka', lastName: 'Jayasinghe', email: 'dinuka@example.com', phone: '0761234567', emergencyContactName: 'Malini Jayasinghe', emergencyContactNumber: '0762345678' },
    { _id: 'emp-5', employeeId: 'EMP-005', firstName: 'Hiruni', lastName: 'Wijesinghe', email: 'hiruni@example.com', phone: '0751234567', emergencyContactName: 'Amal Wijesinghe', emergencyContactNumber: '0752345678' },
    { _id: 'emp-6', employeeId: 'EMP-006', firstName: 'Chamika', lastName: 'Bandara', email: 'chamika@example.com', phone: '0701234567', emergencyContactName: 'Dulani Bandara', emergencyContactNumber: '0702345678' },
    { _id: 'emp-7', employeeId: 'EMP-007', firstName: 'Dilshan', lastName: 'Rathnayake', email: 'dilshan@example.com', phone: '0721234567', emergencyContactName: 'Shalini Rathnayake', emergencyContactNumber: '0722345678' },
  ],
  personnel: [
    { _id: 'user-1', firstName: 'Buddhika', lastName: 'Sankalpa', email: 'buddhika@example.com', phone: '0779876543', role: 'Main Security Officer', isAdmin: true, isBlocked: false },
    { _id: 'user-2', firstName: 'Amila', lastName: 'Fernando', email: 'amila@example.com', phone: '0718765432', role: 'Security Officer', isAdmin: false, isBlocked: false },
    { _id: 'user-3', firstName: 'Sachini', lastName: 'Perera', email: 'sachini@example.com', phone: '0767654321', role: 'Field Operator', isAdmin: false, isBlocked: false },
  ],
  alerts: sampleAlerts,
  sensors: [
    { sensorId: 'TMP-A101', type: 'Temperature Sensor', location: 'Flow 01 - Room 01', status: 'Online', battery: '94%', lastPing: '2026-10-28T09:00:00', issue: '' },
    { sensorId: 'AIR-A102', type: 'Air Quality Sensor', location: 'Flow 01 - Room 02', status: 'Online', battery: '88%', lastPing: '2026-10-28T09:00:00', issue: '' },
    { sensorId: 'NOS-A201', type: 'Noise Sensor', location: 'Flow 02 - Room 01', status: 'Online', battery: '82%', lastPing: '2026-10-28T09:00:00', issue: '' },
    { sensorId: 'FIR-A301', type: 'Fire Sensor', location: 'Flow 03 - Room 01', status: 'Online', battery: '96%', lastPing: '2026-10-28T09:00:00', issue: '' },
    { sensorId: 'BTN-A401', type: 'Emergency Button', location: 'Flow 04 - Room 01', status: 'Online', battery: '91%', lastPing: '2026-10-28T09:00:00', issue: '' },
  ],
  settings: { firstName: 'Buddhika', lastName: 'Sankalpa', email: 'buddhika@example.com', phone: '0779876543', autoAlarm: true, maintenanceMode: false, systemMuted: false },
};

function readInitialData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.employees) && Array.isArray(saved.personnel) && Array.isArray(saved.alerts) && Array.isArray(saved.sensors)) {
      return { ...initialData, ...saved, settings: { ...initialData.settings, ...saved.settings } };
    }
    const previous = JSON.parse(localStorage.getItem('security-grid-demo-v1'));
    if (previous && Array.isArray(previous.employees) && Array.isArray(previous.personnel) && Array.isArray(previous.alerts) && Array.isArray(previous.sensors)) {
      return {
        ...initialData, ...previous,
        alerts: [...sampleAlerts, ...previous.alerts],
        settings: { ...initialData.settings, ...previous.settings },
      };
    }
  } catch {
    // A malformed local copy should not stop the dashboard from opening.
  }
  return initialData;
}

export function DemoDataProvider({ children }) {
  const [data, setData] = useState(readInitialData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateCollection = (name, updater) => {
    setData(previous => ({ ...previous, [name]: updater(previous[name]) }));
  };

  const updateSettings = (patch) => {
    setData(previous => ({ ...previous, settings: { ...previous.settings, ...patch } }));
  };

  const resetData = () => setData(initialData);

  return (
    <DemoDataContext.Provider value={{ ...data, updateCollection, updateSettings, resetData }}>
      {children}
    </DemoDataContext.Provider>
  );
}

