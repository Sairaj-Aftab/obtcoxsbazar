import { Link } from "react-router-dom";
const BusEntryPermissionList = () => {
  return (
    <section className="container w-full mx-auto my-8 p-4 bg-white border border-primary-color md:rounded-lg">
      <div className="flex flex-col sm:flex-row gap-1 justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Recent entry list</h3>
        <Link
          to="/tourist-bus-entry-permission"
          className="bg-primary-color rounded-md py-1 px-2 text-white text-sm font-medium"
        >
          Apply tourist bus permission
        </Link>
      </div>
    </section>
  );
};

export default BusEntryPermissionList;
