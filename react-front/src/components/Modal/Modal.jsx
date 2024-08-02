import { BiX } from "react-icons/bi";

const Modal = ({ title, children, close }) => {
  return (
    <div className="bg-black/5 fixed z-50 top-0 left-0 w-full h-screen flex items-center justify-center ">
      <div className="bg-white max-w-[500px] w-full h-auto rounded-xl shadow-xl">
        <div className="flex justify-between items-center p-3 border-b border-[#ccc]">
          <h1 className="text-lg font-semibold">{title}</h1>
          <BiX className="cursor-pointer" size={30} onClick={close} />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
