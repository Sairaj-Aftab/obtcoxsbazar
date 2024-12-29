import logo from "../../assets/image/primary_logo.png";
const PageLoader = () => {
  return (
    <div className="fixed top-0 left-0 z-[99999] w-full h-screen bg-white flex justify-center items-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-color"></div>
        <img
          src={logo}
          alt="OBT"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-cover w-full p-4"
        />
      </div>
    </div>
  );
};

export default PageLoader;
