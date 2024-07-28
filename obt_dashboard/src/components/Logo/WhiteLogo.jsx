import blacklogo from "../../assets/img/black_logo.png";

const WhiteLogo = (cssClass) => {
  return (
    <>
      <img
        src={blacklogo}
        alt="Logo"
        className={cssClass}
        style={{ width: "300px" }}
      />
    </>
  );
};

export default WhiteLogo;
