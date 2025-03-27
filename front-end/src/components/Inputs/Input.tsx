import React, { useEffect, useState } from "react";
import "./style.scss"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    model: string;
    setChange?: (name:string, value: string) => void;
}

const Input: React.FC<InputProps> = ({ model, setChange, name, ...props }) => {
    const [value, setValue] = useState(model);
  
    useEffect(() => {
      setValue(model);
    }, [model]);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
  
      if (setChange && name) {
        setChange(name, newValue); 
      }
    };
  
    return (
      <input
        className="w-full h-12 border-b-3 border-[#1E1E1E] p-3 font-bold focus:outline-none"
        {...props}
        value={value}
        onChange={handleChange}
      />
    );
  };
  
  export default Input;
  