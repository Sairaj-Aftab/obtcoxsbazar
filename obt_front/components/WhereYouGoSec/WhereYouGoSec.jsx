"use client";
import { schedulesData } from "@/lib/features/schedules/schedulesSlice";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

const WhereYouGoSec = () => {
  const { destinationPlaces } = useSelector(schedulesData);

  return (
    <section className="container mx-auto my-8 p-4 bg-white shadow-lg rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Where You Go</h3>
      <div className="flex gap-2 md:gap-5 flex-wrap">
        {destinationPlaces &&
          destinationPlaces.map((place, index) => (
            <Link
              href={`/${place.slug}/${place.id}`}
              className="bg-primary-color text-white text-sm sm:text-base py-1 px-2 rounded-md"
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
