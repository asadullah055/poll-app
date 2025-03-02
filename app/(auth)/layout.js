export default function AuthLayout({ children }) {
  return (
    <div className="min-w-screen min-h-screen flex justify-center items-center bg-gray">
      <div className="w-[350px] md:w-[400px] p-2 border border-gray-100 shadow-rounded rounded-md bg-white">
      { children }
      </div>
    </div>
  );
}
