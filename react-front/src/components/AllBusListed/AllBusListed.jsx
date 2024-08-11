import { useSelector } from "react-redux";
import { busData } from "../../features/bus/busSlice";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

const AllBusListed = () => {
  const { bus, busLoader } = useSelector(busData);
  return (
    <section className="container mx-auto my-8 p-4 bg-white md:shadow-lg md:rounded-lg">
      <h3 className="text-xl font-semibold mb-4">All Bus Services</h3>
      <div className="grid gap-2 md:gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {busLoader && (
          <>
            <Skeleton height={35} className="rounded-md" />
            <Skeleton height={35} className="rounded-md" />
            <Skeleton height={35} className="rounded-md" />
            <Skeleton height={35} className="rounded-md" />
            <Skeleton height={35} className="rounded-md" />
            <Skeleton height={35} className="rounded-md" />
          </>
        )}
        {!busLoader &&
          bus &&
          bus?.map((data, index) => (
            <Link
              to={`/all-bus-services/${data.slug}/${data.id}`}
              className="bg-primary-color text-white text-sm font-bold text-center sm:text-base py-1 px-2 rounded-md"
              key={index}
            >
              {data.paribahanName}
            </Link>
          ))}
      </div>
    </section>
  );
};

export default AllBusListed;
