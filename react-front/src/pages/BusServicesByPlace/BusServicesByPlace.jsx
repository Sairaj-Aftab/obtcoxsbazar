import { useEffect, useState } from "react";
import { LiaBusSolid } from "react-icons/lia";
import { useSelector } from "react-redux";
import { busData } from "../../features/bus/busSlice";
import NoticeFromAdmin from "../../components/NoticeFromAdmin";
import { Link, useParams } from "react-router-dom";
import { schedulesData } from "../../features/schedules/schedulesSlice";

const BusServicesByPlace = () => {
  const params = useParams();
  const { bus } = useSelector(busData);
  const { destinationPlaces } = useSelector(schedulesData);

  const [busByPlace, setBusByPlace] = useState([]);
  const [currentDestination, setCurrentDestination] = useState(null);

  useEffect(() => {
    const getBusesByDestinationId = (destinationId) => {
      return bus?.filter((bus) =>
        bus.destination.some((dest) => dest.id === destinationId)
      );
    };
    // Get destination place by ID
    const getDestinationById = (destinationId) => {
      return destinationPlaces?.find((place) => place.id === destinationId);
    };
    const buses = getBusesByDestinationId(String(params.id));
    const destination = getDestinationById(String(params.id));

    setBusByPlace(buses);
    setCurrentDestination(destination);
  }, [bus, destinationPlaces, params.id]);

  return (
    <div className="container mx-auto bg-white rounded-lg my-5">
      <h1 className="flex justify-center items-center sm:gap-1 flex-col sm:flex-row text-lg font-semibold text-white bg-primary-color py-1 rounded-t-lg mb-2">
        <p>
          Cox&apos;s Bazar to{" "}
          <span className="text-yellow">
            {currentDestination?.placeName?.toUpperCase()}
          </span>
        </p>
        {currentDestination?.destinationKM && (
          <p>&#10132; {currentDestination?.destinationKM} KM</p>
        )}
      </h1>
      <p className="text-base font-medium text-black mb-3">
        <NoticeFromAdmin status="Passenger" />
      </p>
      {busByPlace.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 p-5">
          {busByPlace?.map((data, index) => (
            <Link
              to={`/all-bus-services/${data.slug}/${data.id}`}
              className="p-2 rounded shadow flex flex-col gap-1 items-center justify-center hover:shadow-lg"
              key={index}
            >
              <LiaBusSolid className="text-5xl" />
              <p className="text-lg font-semibold text-primary-color text-center">
                {data.paribahanName}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-red font-medium">
          No bus found for {params?.place?.toUpperCase()}
        </p>
      )}
    </div>
  );
};

export default BusServicesByPlace;
