import { Triangle } from "react-loader-spinner";

const PageLoader = () => {
  return (
    <div className="fixed top-0 left-0 z-[99999] w-full h-screen bg-white flex justify-center items-center">
      <Triangle
        visible={true}
        height="100"
        width="100"
        color="#00a653"
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default PageLoader;
