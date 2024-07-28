import logo from "../../assets/img/black_logo.png";

const SmallLogo = ({ width, height }) => {
  return (
    <>
      <img src={logo} alt="Logo" width={width} height={height} />
    </>
  );
};

export default SmallLogo;
