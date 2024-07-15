"use client";
import { busData } from "@/lib/features/bus/busSlice";
import Link from "next/link";
import { useSelector } from "react-redux";

const AllBusListed = () => {
  const { bus } = useSelector(busData);
  return (
    <section className="container mx-auto my-8 p-4 bg-white shadow-lg rounded-lg">
      <h3 className="text-xl font-semibold mb-4">All Bus Services</h3>
      <div className="flex gap-2 md:gap-5 flex-wrap">
        {bus &&
          bus?.map((data, index) => (
            <Link
              href={`/all-bus-services/${data.slug}/${data.id}`}
              className="bg-primary-color text-white text-sm sm:text-base py-1 px-2 rounded-md"
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
