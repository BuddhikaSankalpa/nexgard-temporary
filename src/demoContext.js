import { createContext, useContext } from 'react';

export const DemoDataContext = createContext(null);

export function useDemoData() {
  const context = useContext(DemoDataContext);
  if (!context) throw new Error('useDemoData must be used within DemoDataProvider');
  return context;
}
