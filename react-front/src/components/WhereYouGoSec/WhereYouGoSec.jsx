import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import usePlaces from "../../store/usePlaces";

const WhereYouGoSec = () => {
  const { destinationPlaces, destinationPlacesLoader } = usePlaces();

  return (
    <section className="container mx-auto my-8 p-4 bg-white md:shadow-lg md:rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Where To Go</h3>
      <div className="grid gap-2 md:gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {destinationPlacesLoader && (
          <>
            <Skeleton height={35} className="rounded-md" />
            <Skeleton height={35} className="rounded-md" />
            <Skeleton height={35} className="rounded-md" />
            <Skeleton height={35} className="rounded-md" />
            <Skeleton height={35} className="rounded-md" />
            <Skeleton height={35} className="rounded-md" />
          </>
        )}
        {!destinationPlacesLoader &&
          destinationPlaces &&
          destinationPlaces?.places?.map((place) => (
            <Link
              to={`/${place.slug}/${place.id}`}
              className="bg-primary-color text-white text-base font-bold text-center py-1 px-2 rounded-md"
              key={place.id}
            >
              {place.placeName}
            </Link>
          ))}
      </div>
    </section>
  );
};

export default WhereYouGoSec;
