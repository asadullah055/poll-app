import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children }) => {
  const user = true;
  return (
    <div>
      <Navbar />
      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <SideMenu />
          </div>
          <div className="grow mx-5">{children}</div>
          <div className="hidden md:block mr-5"></div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
