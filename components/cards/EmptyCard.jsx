import Link from "next/link";

const EmptyCard = ({ icon, message, linkText, goTo }) => {
  return (
    <div className="bg-gray-100/50 flex flex-col items-center justify-center mt-6 py-9 rounded-lg">
      <div className="">{icon}</div>
      <p className="w-2/3 text-xs md:text-[14px] text-slate-900 text-center leading-6 mt-4">
        {message}
      </p>
      {linkText && (
        <Link href={goTo} className="btn-small px-6 py-2 mt-4">
          {linkText}
        </Link>
      )}
    </div>
  );
};

export default EmptyCard;
