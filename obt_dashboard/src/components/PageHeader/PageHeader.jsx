// eslint-disable-next-line react/prop-types
const PageHeader = ({ title }) => {
  return (
    <h1 className="text-xl md:text-2xl py-3 font-bold text-gray-800 dark:text-gray-100">
      {title}
    </h1>
  );
};

export default PageHeader;
