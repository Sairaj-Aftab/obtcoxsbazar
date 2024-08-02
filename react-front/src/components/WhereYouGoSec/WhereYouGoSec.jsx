import { useSelector } from "react-redux";
import { schedulesData } from "../../features/schedules/schedulesSlice";
import { Link } from "react-router-dom";

const WhereYouGoSec = () => {
  const { destinationPlaces } = useSelector(schedulesData);

  return (
    <section className="container mx-auto my-8 p-4 bg-white md:shadow-lg md:rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Where To Go</h3>
      <div className="flex gap-2 md:gap-5 flex-wrap">
        {destinationPlaces &&
          destinationPlaces?.map((place, index) => (
            <Link
              to={`/${place.slug}/${place.id}`}
              className="bg-primary-color text-white text-base py-1 px-2 rounded-md"
              key={index}
            >
              {place.placeName}
            </Link>
          ))}
      </div>
    </section>
  );
};

export default WhereYouGoSec;
