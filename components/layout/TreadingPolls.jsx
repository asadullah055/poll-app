import { formateNumber } from "@/helper/numberFormater";

const TreadingPolls = (props) => {
  return (
    <div className="bg-slate-100/50  rounded-lg mt-6 overflow-hidden sticky top-[80px] p-5">
      <h6 className="text-sm text-black font-medium">Treading</h6>
      <div className="mt-4">
        {props.stats.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg cursor-pointer mb-1 px-3 py-2 hover:bg-slate-300/30"
          >
            <p className="text-sm text-slate-900">{item.label}</p>
            <span className="text-xs text-slate-600 rounded py-[2px] px-4">
              {formateNumber(item.count)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TreadingPolls;
