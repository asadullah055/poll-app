import ProfileInfo from "./ProfileInfo";
import ProfilePhoto from "./ProfilePhoto";

const ProfileDetails = ({ user }) => {
  return (
    <div className="pt-4">
      <ProfilePhoto user={user} profileImage={user.user.profileImage} />
      <ProfileInfo user={user} />
    </div>
  );
};

export default ProfileDetails;
