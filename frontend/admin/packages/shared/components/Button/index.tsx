import * as React from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  color?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, color }) => {
  return (
    <button
      className={`btn ${color ? `btn-${color}` : 'btn-primary'} `}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
