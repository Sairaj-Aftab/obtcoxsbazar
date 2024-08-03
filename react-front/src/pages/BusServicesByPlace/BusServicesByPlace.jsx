import { useEffect, useState } from "react";
import { LiaBusSolid } from "react-icons/lia";
import { useSelector } from "react-redux";
import { busData } from "../../features/bus/busSlice";
import NoticeFromAdmin from "../../components/NoticeFromAdmin";
import { Link, useParams } from "react-router-dom";

const BusServicesByPlace = () => {
  const params = useParams();
  const { bus } = useSelector(busData);

  const [busByPlace, setBusByPlace] = useState([]);

  useEffect(() => {
    const getBusesByDestinationId = (destinationId) => {
      return bus?.filter((bus) =>
        bus.destination.some((dest) => dest.id === destinationId)
      );
    };
    const buses = getBusesByDestinationId(String(params.id));

    setBusByPlace(buses);
  }, [bus, params.id]);

  return (
    <div className="container mx-auto bg-white rounded-lg my-5">
      <h1 className="text-lg font-semibold text-white bg-primary-color text-center py-1 rounded-t-lg mb-2">
        Cox&apos;s Bazar to {params?.place?.toUpperCase()}
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
