import { createContext, useContext, useState } from "react";
import "../styles/Toast.css";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && <div className="toast">{toast}</div>}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);