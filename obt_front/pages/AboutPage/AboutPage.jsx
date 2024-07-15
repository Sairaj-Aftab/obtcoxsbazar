import React from "react";

const AboutPage = () => {
  return (
    <section className="bg-white p-6 rounded-lg sm:shadow-lg max-w-3xl w-full mx-auto sm:my-5">
      <h2 className="text-2xl font-semibold mb-4">Online Bus Terminal (OBT)</h2>
      <p className="mb-6">
        Online Bus Terminal (OBT) is a digital platform that facilitates the
        planning, booking, and management of bus travel. It serves as a virtual
        alternative to traditional bus terminals, offering users the convenience
        of accessing bus services from anywhere with an internet connection.
      </p>

      <h3 className="text-xl font-semibold mb-2">Key Facilities:</h3>
      <ul className="list-disc list-inside mb-6">
        <li>
          Schedule Information: Detailed bus schedules, including departure and
          arrival times.
        </li>
        <li>
          Bus Reg & Guide No: User will get bus registration number and guide
          mobile number of desired bus.
        </li>
        <li>Seat Selection: Options to choose preferred seats.</li>
        <li>
          Real-Time Updates: Notifications about booking status, bus departures,
          and delays.
        </li>
        <li>
          Fare Comparison: Ability to compare fares from different bus
          operators.
        </li>
        <li>
          Discounts and Offers: Access to promotional discounts and offers.
        </li>
        <li>
          Reviews and Ratings: User reviews and ratings for bus operators and
          specific routes.
        </li>
        <li>24/7 Customer Service: Support through chat, or phone.</li>
      </ul>

      <h3 className="text-xl font-semibold mb-2">Beneficiary Stakeholders:</h3>
      <ul className="list-decimal list-inside mb-6">
        <li>Passengers</li>
        <li>Bus Operators</li>
        <li>Local Communities</li>
        <li>Tourism Industries</li>
        <li>Regulatory Bodies</li>
      </ul>

      <h3 className="text-xl font-semibold mb-2">Prospective Benefits:</h3>
      <ul className="list-disc list-inside mb-6">
        <li>
          Less Traffic Congestion: With more passengers booking tickets online,
          the need for large, physical bus terminals in congested areas
          decreases, reducing traffic congestion around these hubs.
        </li>
        <li>
          Efficient Use of Space: Physical space previously occupied by ticket
          counters can be repurposed for other traffic management solutions or
          public use.
        </li>
        <li>
          Optimized Bus Scheduling and Routing: Online platforms can collect and
          analyze data on travel patterns, helping bus operators optimize routes
          and schedules to match demand, thereby avoiding over-crowding on
          certain routes and times.
        </li>
        <li>
          Encouraging Public Transportation Use: Online bus terminals can
          integrate with other forms of public transportation, like trains and
          metros, to provide seamless travel solutions, further reducing the
          reliance on private vehicles.
        </li>
        <li>
          Real-Time Traffic Management: Real-time tracking of buses can provide
          valuable data to city traffic management systems, helping to monitor
          and manage traffic flow more effectively.
        </li>
        <li>
          Environmental Benefits: By promoting public transportation over
          private vehicle use, online bus terminals contribute to reducing
          overall vehicle emissions, improving air quality and reducing
          environmental impacts.
        </li>
        <li>
          Integration with Smart City Initiatives: Online bus terminals can be
          part of broader smart city initiatives, integrating with other smart
          transportation and traffic management systems to create a more
          cohesive and efficient urban mobility network.
        </li>
      </ul>

      <p className="mt-6">
        In summary, an online bus terminal revolutionizes the way people plan
        and book bus travel, enhancing convenience, efficiency, and user
        experience while posing new challenges in terms of accessibility,
        reliability, and security.
      </p>
    </section>
  );
};

export default AboutPage;
