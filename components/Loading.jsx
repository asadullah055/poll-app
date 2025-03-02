const Loading = ({ text }) => {
  return (
    <div className="flex items-center justify-center text-white gap-2">
      <div
        className="inline-block h-6 w-6 animate-spin rounded-full border-3 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        role="status"
      ></div>
      <span>{text}</span>
    </div>
  );
};

export default Loading;
