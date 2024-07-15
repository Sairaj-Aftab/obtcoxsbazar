import avatarProfile from "../../../public/profileavatar.png";

const Avatar = ({ src, classList, alt, width }) => {
  return (
    <img
      src={src ? src : avatarProfile}
      className={classList}
      alt={alt}
      width={width}
    />
  );
};

export default Avatar;
