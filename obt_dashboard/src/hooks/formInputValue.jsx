import { useState } from "react";

const FormInputValue = (fields) => {
  const [input, setInput] = useState(fields);

  const handleChangeValue = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const formReset = () => {
    setInput(fields);
  };
  return { input, handleChangeValue, formReset, setInput };
};

export default FormInputValue;
