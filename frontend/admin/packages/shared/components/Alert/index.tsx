"use client";
import * as Icons from "@heroicons/react"
import { SVGProps, useEffect, useState } from "react";
import { motion } from "framer-motion";
import React from "react";
import { tAlert } from "@shared/utils/types/Alert";
import { useGlobalContext } from "@shared/context/GlobalContext";

interface AlertProps extends tAlert {
  onClose: () => void;
}

const alertStyles: Record<string, React.CSSProperties> = {
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  info: {
    backgroundColor: '#cce5ff',
    color: '#004085',
  },
  warning: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  default: {
    backgroundColor: '#e2e3e5',
    color: '#383d41',
  },
};


export function Alert({
  title,
  message,
  buttonText,
  iconName,
  onClose,
  type,
}: AlertProps) {
  const Icon = Icons[iconName] as React.FC<SVGProps<SVGSVGElement>>;
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  const alertStyle = alertStyles[type] || alertStyles.default;
  return (
    <motion.div
      role="alert"
      className='alert shadow-lg max-w-md w-screen'
      style={alertStyle}
      initial={{ opacity: 0, translateX: 100 }}
      animate={{ opacity: isExiting ? 0 : 1, translateX: isExiting ? 100 : 0 }}
      exit={{ opacity: 0, translateX: 100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="w-6">{Icon && <Icon className="h-6 w-6" />}</div>
      <div>
        <h3 className="font-bold">{title}</h3>
        <div className="text-xs">{message}</div>
      </div>
      <button className='btn btn-ghost btn-sm' onClick={handleClose}>
        {buttonText}
      </button>
    </motion.div>
  );
}

export function GlobalAlert() {
  const { alerts, removeAlert } = useGlobalContext();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          title={alert.title}
          message={alert.message}
          buttonText={alert.buttonText}
          iconName={alert.iconName}
          onClose={() => removeAlert(alert.id)}
          id={alert.id}
          type={alert.type}
        />
      ))}
    </div>
  );
}
