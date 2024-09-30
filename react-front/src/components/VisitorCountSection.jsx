import { useSelector } from "react-redux";
import bizman from "../assets/image/bizman.jpg";
import { visitorCountData } from "../features/visitorCount/visitorCountSlice";

const VisitorCountSection = () => {
  const { visitorStats } = useSelector(visitorCountData);
  return (
    <div className="bg-primary-color mt-8">
      <div className="container mx-auto p-4 grid grid-cols-2 md:grid-cols-none md:flex flex-col md:flex-row gap-5 justify-center md:justify-between">
        <div className="flex flex-col items-center">
          <p className="text-white text-base md:text-lg font-medium">
            Total Visitor
          </p>
          <p className="text-yellow text-2xl md:text-4xl font-medium">
            {visitorStats.total}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-white text-base md:text-lg font-medium">
            Daily Visitor
          </p>
          <p className="text-yellow text-2xl md:text-4xl font-medium">
            {visitorStats.daily}
          </p>
        </div>
        <div className="flex flex-col col-span-2 items-center">
          <p className="text-white text-base md:text-lg font-medium">
            Brand Partner
          </p>
          <img src={bizman} alt="Bizman Media" className="w-32 md:w-36" />
        </div>
      </div>
    </div>
  );
};

export default VisitorCountSection;
