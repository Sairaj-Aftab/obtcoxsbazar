import { Triangle } from "react-loader-spinner";

const ComponentLoader = () => {
  return (
    <div className="w-full h-full bg-white flex justify-center items-center">
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

export default ComponentLoader;
