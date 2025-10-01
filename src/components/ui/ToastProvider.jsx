import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
  } from "react";
  import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
  
  const ToastContext = createContext({
    success: () => {},
    error: () => {},
    info: () => {},
  });
  
  function Toast({ id, type = "info", message, duration = 3000, onClose }) {
    const palette = {
      success: {
        border: "border-l-4 border-green-500",
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      },
      error: {
        border: "border-l-4 border-red-500",
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      },
      info: {
        border: "border-l-4 border-blue-500",
        icon: <Info className="h-5 w-5 text-blue-600" />,
      },
    }[type] || {
      border: "border-l-4 border-gray-400",
      icon: <Info className="h-5 w-5 text-gray-600" />,
    };
  
    // Auto dismiss
    useEffect(() => {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }, [duration, id, onClose]);
  
    return (
      <div
        className={`relative flex items-start gap-3 rounded-lg bg-white px-4 py-3 shadow-md ring-1 ring-black/5 animate-slide-in ${palette.border}`}
      >
        <div className="mt-0.5">{palette.icon}</div>
        <div className="flex-1 text-sm text-gray-900">{message}</div>
        <button
          onClick={() => onClose(id)}
          className="ml-2 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
  
  export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const idRef = useRef(0);
  
    const remove = useCallback((id) => {
      setToasts((list) => list.filter((t) => t.id !== id));
    }, []);
  
    const push = useCallback(
      (type, message, duration = 3000) => {
        const id = ++idRef.current;
        setToasts((list) => [...list, { id, type, message, duration }]);
      },
      []
    );
  
    const api = {
      success: (msg, ms) => push("success", msg, ms),
      error: (msg, ms) => push("error", msg, ms),
      info: (msg, ms) => push("info", msg, ms),
    };
  
    return (
      <ToastContext.Provider value={api}>
        {children}
        {/* Toast viewport */}
        <div className="pointer-events-none fixed top-5 right-5 z-50 flex flex-col gap-3">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="pointer-events-auto animate-fade-in-up"
            >
              <Toast {...t} onClose={remove} />
            </div>
          ))}
        </div>
      </ToastContext.Provider>
    );
  }
  
  export function useToast() {
    return useContext(ToastContext);
  }
  