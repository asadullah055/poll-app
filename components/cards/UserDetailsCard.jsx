import { formateNumber } from "@/helper/numberFormater";
import Image from "next/image";

const StatusInfo = ({ label, value }) => {
  return (
    <div className="text-center">
      <p className="font-medium text-gray-950">{formateNumber(value)}</p>
      <p className="text-xs text-slate-700/80 mt-[2px]">{label}</p>
    </div>
  );
};

const UserDetailsCard = ({
  profileImageUrl,
  fullName,
  username,
  totalBookmarkedPolls,
  totalPollsCreated,
  totalPollsVote,
}) => {
  return (
    <div className="bg-slate-100/50 rounded-lg mt-16 overflow-hidden ">
      <div className="w-full h-32 flex justify-center bg-primary relative">
        <div className="absolute -bottom-10 rounded-full overflow-hidden border-2 border-primary">
          {
            profileImageUrl && (
              <Image
                height={200}
                width={200}
                src={profileImageUrl || ""}
                alt="profile image"
                className="w-20 h-20 bg-slate-400 rounded-full"
              />
            ) /* : (
            <CharAvatar
              fullName={fullName}
              width="w-20"
              height="h-20"
              style="text-lg"
            /> */
          }
        </div>
      </div>
      <div className="mt-12 px-5">
        <div className="text-center pt-1">
          <h2 className="text-lg text-gray-950 font-medium leading-6">
            {fullName}
          </h2>
          <span className="text-[13px] font-medium text-slate-700/60">
            @{username}
          </span>
        </div>
        <div className="flex items-center justify-center gap-5 flex-wrap my-6">
          <StatusInfo label="Polls Created" value={totalPollsCreated || 0} />
          <StatusInfo label="Polls Voted" value={totalPollsVote || 0} />
          <StatusInfo
            label="Polls Bookmarked"
            value={totalBookmarkedPolls || 0}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDetailsCard;
