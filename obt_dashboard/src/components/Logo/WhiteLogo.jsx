import whitelogo from "../../assets/img/logo-white.png";

const WhiteLogo = (cssClass) => {
  return (
    <>
      <img src={whitelogo} alt="Logo" className={cssClass} />
    </>
  );
};

export default WhiteLogo;
