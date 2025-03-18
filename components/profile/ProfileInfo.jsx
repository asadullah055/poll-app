const ProfileInfo = ({ user }) => {
  return (
    <div className="p-2">
      <div className="">
        <label className="font-medium text-sm" htmlFor="fullName">
          Full Name
        </label>
        <p className="border border-primary/20 p-2 rounded mt-2">
          {user.user.fullname}
        </p>
      </div>
      <div className="mt-2">
        <label className="font-medium text-sm" htmlFor="fullName">
          User Name
        </label>
        <p className="border border-primary/20 p-2 rounded mt-2">
          @{user.user.username}
        </p>
      </div>
      <div className="mt-2">
        <label className="font-medium text-sm" htmlFor="fullName">
          Email
        </label>
        <p className="border border-primary/20 p-2 rounded mt-2">
          {user.user.email}
        </p>
      </div>
    </div>
  );
};

export default ProfileInfo;
