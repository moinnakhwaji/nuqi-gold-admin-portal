import CoinLoader from "./CoinLoader";


const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 backdrop-blur-lg">
        <CoinLoader />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 font-medium">Please wait while we process your request</p>
        </div>
      </div>
    </div>
  );
};
export default FullScreenLoader;