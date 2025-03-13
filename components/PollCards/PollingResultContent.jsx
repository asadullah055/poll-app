import moment from "moment";
import Image from "next/image";
const PollOptionVoteResult = ({ label, optionVotes, totalVotes }) => {
  const progress =
    totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;

  return (
    <div className="w-full bg-[#E6ECF3] rounded-md h-6 relative mb-3">
      <div
        className="bg-sky-900/10 h-6 rounded-md"
        style={{ width: `${progress}%` }}
      ></div>
      <span className="absolute inset-0 flex items-center justify-between text-gray-800 text-[12px] font-medium mx-4">
        {label} <span className="text-[11px] text-[#444A60]">{progress}%</span>
      </span>
    </div>
  );
};
const ImagePollResult = ({ imgUrl, optionVotes, totalVotes }) => {
  return (
    <div className="">
      <div className="w-full bg-gray-800 flex items-center gap-2 mb-4 rounded-md overflow-hidden">
        <Image
          src={imgUrl}
          alt="poll image"
          width={200}
          height={100}
          className="w-full h-36 object-contain"
        />
      </div>
      <PollOptionVoteResult optionVotes={optionVotes} totalVotes={totalVotes} />
    </div>
  );
};
const OpenEndedPollResponse = ({
  profileImgUrl,
  userFullName,
  response,
  createdAt,
}) => {
  return (
    <div className="mb-8 ml-3">
      <div className="flex gap-3 items-center">
        {profileImgUrl && (
          <Image
            src={profileImgUrl}
            alt=""
            height={100}
            width={100}
            className="rounded-full"
          />
        )}

        <p className="text-[13px] text-black">
          {userFullName}{" "}
          <span className="mx-1 text-[10px] text-slate-500">.</span>
          <span className="text-[10px] text-slate-500">{createdAt}</span>
        </p>
      </div>
      <p className="text-xs text-slate-700 mt-2 ml-[44px]">{response}</p>
    </div>
  );
};

const PollingResultContent = ({ type, options, voter, response }) => {
  switch (type) {
    case "single-choice":
    case "yes/no":
    case "rating":
      return (
        <>
          {options.map((option, i) => (
            <PollOptionVoteResult
              key={i}
              label={`${option.optionText} ${type === "rating" ? "Star" : ""}`}
              optionVotes={option.votes}
              totalVotes={voter || 0}
            />
          ))}
        </>
      );
    case "image-based":
      return (
        <div className="grid grid-cols-2 gap-4">
          {options.map((option, index) => (
            <ImagePollResult
              key={index}
              imgUrl={option.optionText || ""}
              optionVotes={option.votes}
              totalVotes={voter || 0}
            />
          ))}
        </div>
      );

    case "open-ended":
      return response.map((item, i) => (
        <OpenEndedPollResponse
          key={i}
          profileImgUrl={item.voterId?.profileImageUrl}
          userFullName={item.voterId?.fullName || "Asadullah Ahmed"}
          response={item.responseText || ""}
          createdAt={item.createdAt ? moment(item.createdAt).fromNow() : ""}
        />
      ));

    default:
      return null;
  }
};

export default PollingResultContent;
