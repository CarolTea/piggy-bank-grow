import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface BalanceContextType {
  balance: number;
  dailyYield: number;
  addBalance: (amount: number) => void;
  removeBalance: (amount: number) => void;
}

const BalanceContext = createContext<BalanceContextType | null>(null);

export const BalanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState(347.52);
  const dailyYield = balance * (5.87 / 100 / 365);

  // Simulate daily yield every 10 seconds for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setBalance(b => parseFloat((b + b * (5.87 / 100 / 365 / 24)).toFixed(2)));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const addBalance = useCallback((amount: number) => {
    setBalance(b => parseFloat((b + amount).toFixed(2)));
  }, []);

  const removeBalance = useCallback((amount: number) => {
    setBalance(b => parseFloat(Math.max(0, b - amount).toFixed(2)));
  }, []);

  return (
    <BalanceContext.Provider value={{ balance, dailyYield, addBalance, removeBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const ctx = useContext(BalanceContext);
  if (!ctx) throw new Error('useBalance must be used within BalanceProvider');
  return ctx;
};
