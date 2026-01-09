function NoFoodFound() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center animate-pulse">
      <div className="text-6xl">🍔</div>
      <h2 className="mt-4 text-xl font-semibold text-gray-700">
        No Food Items Found
      </h2>
      <p className="text-gray-500 text-sm">
        Try another search
      </p>
    </div>
  );
}

export default NoFoodFound;
