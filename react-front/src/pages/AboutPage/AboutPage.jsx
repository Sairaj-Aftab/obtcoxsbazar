import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About OBT - Online Bus Terminal</title>
        <meta
          name="description"
          content="Learn about the Online Bus Terminal (OBT) in Cox's Bazar. Discover its features, benefits, and how it enhances travel."
        />
      </Helmet>

      <section className="bg-white p-6 rounded-lg sm:shadow-lg max-w-3xl w-full mx-auto sm:my-5">
        <h2 className="text-2xl font-semibold mb-4">
          Online Bus Terminal (OBT)
        </h2>
        <p className="mb-2">
          Welcome to Cox&apos;s Bazar, home of the world&apos;s longest sandy
          beach where the sun, sand, sea and hills await you.
        </p>

        <p className="mb-2">
          We welcome you to Online Bus Terminal, Cox’s Bazar, an initiative by{" "}
          <span className="font-semibold">
            Traffic Division, Cox’s Bazar District Police
          </span>{" "}
          to make a smart, disciple, safe and tourism-friendly bus traffic
          management in tourist area.
        </p>
        <p className="mb-2">
          Our mission is to provide a safe, convenient, and enjoyable travel
          experience for every passenger. We aim to connect people and places,
          making travel more accessible and comfortable for everyone.
        </p>
        <p className="mb-6">
          Your safety is our priority. Thank you for choosing Safe Travels. We
          wish you a secure and wonderful journey ahead!
        </p>
        <h3 className="text-xl font-semibold mb-2">OBT, at a glance!</h3>
        <p className="mb-6">
          Online Bus Terminal (OBT) is a digital platform that facilitates the
          planning, booking, and management of bus travel. It serves as a
          virtual alternative to traditional bus terminals, offering users the
          convenience of accessing bus services from anywhere. with an internet
          connection.
        </p>

        <h3 className="text-xl font-semibold mb-2">
          Here are the key components and functionalities of OBT:
        </h3>
        <ul className="list-disc list-inside mb-6">
          <li>
            <span className="font-semibold">
              All Bus Services & destinations:
            </span>{" "}
            All bus services list and all destinations from Cox’s Bazar
            including types as AC, Non-AC & Sleeper Coach.
          </li>
          <li>
            <span className="font-semibold">Schedule Information:</span>{" "}
            Detailed bus schedules, including departure time, departure places
            and individual destinations.
          </li>
          <li>
            <span className="font-semibold">Bus Registration & Guide No:</span>{" "}
            User will get bus registration number and guide mobile number of
            desired bus.
          </li>
          <li>
            <span className="font-semibold">Seat Selection:</span> Options to
            choose preferred seats.
          </li>
          <li>
            <span className="font-semibold">Real-Time Updates:</span>{" "}
            Notifications about booking status, bus departures, and delays.
          </li>
          <li>
            <span className="font-semibold">Fare Comparison:</span> Ability to
            compare fares from different bus operators.
          </li>
          <li>
            <span className="font-semibold">Discounts and Offers:</span> Access
            to promotional discounts and offers.
          </li>
          <li>
            <span className="font-semibold">Reviews and Ratings:</span> User
            reviews and ratings for bus operators and specific routes.
          </li>
          <li>
            <span className="font-semibold">Tourist Bus Entry Permission:</span>{" "}
            Online application system for tourist bus entry in town area is
            available here.
          </li>
          <li>
            <span className="font-semibold">24/7 Customer Service:</span>{" "}
            Support through chat, or phone.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mb-2">
          Beneficiary Stakeholders:
        </h3>
        <ul className="list-decimal list-inside mb-6">
          <li>Passengers & Tourists</li>
          <li>Bus Operators</li>
          <li>Local Communities</li>
          <li>Tourism Industries</li>
          <li>Regulatory Bodies</li>
        </ul>

        <h3 className="text-xl font-semibold mb-2">Prospective Benefits:</h3>
        <ul className="list-disc list-inside mb-6">
          <li>
            <span className="font-semibold">Less Traffic Congestion:</span> With
            more passengers booking tickets online, the need for large, physical
            bus terminals in congested areas decreases, reducing traffic
            congestion around these hubs.
          </li>
          <li>
            <span className="font-semibold">Efficient Use of Space:</span>
            Physical space previously occupied by ticket counters can be
            repurposed for other traffic management solutions or public use.
          </li>
          <li>
            <span className="font-semibold">
              Optimized Bus Scheduling and Routing:
            </span>{" "}
            Online platforms can collect and analyze data on travel patterns,
            helping bus operators optimize routes and schedules to match demand,
            thereby avoiding over-crowding on certain routes and times.
          </li>
          <li>
            <span className="font-semibold">
              Encouraging Public Transportation Use:
            </span>{" "}
            Online bus terminals can integrate with other forms of public
            transportation, like trains and metros, to provide seamless travel
            solutions, further reducing the reliance on private vehicles.
          </li>
          <li>
            <span className="font-semibold">Real-Time Traffic Management:</span>
            Real-time tracking of buses can provide valuable data to city
            traffic management systems, helping to monitor and manage traffic
            flow more effectively.
          </li>
          <li>
            <span className="font-semibold">Environmental Benefits:</span> By
            promoting public transportation over private vehicle use, online bus
            terminals contribute to reducing overall vehicle emissions,
            improving air quality and reducing environmental impacts.
          </li>
          <li>
            <span className="font-semibold">
              Integration with Smart City Initiatives:
            </span>{" "}
            Online bus terminals can be part of broader smart city initiatives,
            integrating with other smart transportation and traffic management
            systems to create a more cohesive and efficient urban mobility
            network.
          </li>
        </ul>

        <p className="mt-6">
          In summary, this Online Bus Terminal (OBT) will revolutionize the bus
          traffic management system as well as the way people plan and book bus
          travel, enhancing convenience, efficiency, and user experience while
          posing new challenges in terms of comfort, reliability, and security
          in Cox&apos;s Bazar.
        </p>
        <div className="md:flex justify-between gap-10 mt-6">
          <div className="w-full md:w-1/2 text-center bg-gray-200 p-4 rounded-lg">
            <h3 className="text-base font-bold text-black mb-3">
              Planning & Direction
            </h3>
            <h3 className="text-base font-bold text-black">
              Md. Mahfuzul Islam, BPM, PPM(Bar)
            </h3>
            <h3 className="text-base font-bold text-black">
              Police Super, Cox&apos;s Bazar
            </h3>
          </div>
          <div className="w-full md:w-1/2 mt-2 md:mt-0 text-center bg-gray-200 p-4 rounded-lg">
            <h3 className="text-base font-bold text-black mb-3">Execution</h3>
            <h3 className="text-base font-bold text-black">
              Md. Jashim Uddin Chy, PPM
            </h3>
            <h3 className="text-base font-bold text-black">
              Addl SP (Traffic) Cox&apos;s Bazar
            </h3>
          </div>
        </div>
        <div className="md:flex justify-between gap-10 mt-2 sm:mt-3">
          <Link
            target="_blank"
            to="https://sairaj-aftab.vercel.app/"
            className="w-full md:w-1/2 mt-2 md:mt-0 text-center bg-gray-200 p-4 rounded-lg"
          >
            <h3 className="text-base font-bold text-black mb-3">
              Developed by
            </h3>
            <h3 className="text-base font-bold text-black">
              <Link target="_blank" to="https://sairaj-aftab.vercel.app/">
                Sairaj Aftab
              </Link>
            </h3>
            <h3 className="text-base font-bold text-black">
              sairajaftab@gmail.com
            </h3>
          </Link>
          <div className="w-full md:w-1/2 mt-2 md:mt-0 text-center bg-gray-200 p-4 rounded-lg">
            <h3 className="text-base font-bold text-black mb-3">Operated by</h3>
            <h3 className="text-base font-bold text-black">Traffic Division</h3>
            <h3 className="text-base font-bold text-black">
              Cox&apos;s Bazar District Police
            </h3>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
