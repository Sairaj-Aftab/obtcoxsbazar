// import { Triangle } from "react-loader-spinner";

const PageLoader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-white flex justify-center items-center">
      {/* <Triangle
        visible={true}
        height="100"
        width="100"
        color="#00a653"
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
      /> */}
      <h1 className="text-3xl text-black">Loading...</h1>
    </div>
  );
};

export default PageLoader;
