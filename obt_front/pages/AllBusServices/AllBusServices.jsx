"use client";
import NoticeFromAdmin from "@/components/NoticeFromAdmin";
import { busData } from "@/lib/features/bus/busSlice";
import Link from "next/link";
import { LiaBusSolid } from "react-icons/lia";
import { useSelector } from "react-redux";
const AllBusServices = ({ title }) => {
  const { bus } = useSelector(busData);
  return (
    <div className="container mx-auto bg-white rounded-lg my-5">
      <h1 className="text-lg font-semibold text-white bg-primary-color text-center py-1 rounded-t-lg mb-2">
        {title}
      </h1>
      <NoticeFromAdmin />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 p-5">
        {bus &&
          bus?.map((data, index) => (
            <Link
              href={`/all-bus-services/${data.slug}/${data.id}`}
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
    </div>
  );
};

export default AllBusServices;
