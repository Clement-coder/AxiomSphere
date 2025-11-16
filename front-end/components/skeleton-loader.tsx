export default function SkeletonLoader() {
  return (
    <div className="flex-1 p-8">
      <div className="h-12 bg-gray-700 rounded w-full mb-8 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="h-48 bg-gray-700 rounded animate-pulse"></div>
        <div className="h-48 bg-gray-700 rounded animate-pulse"></div>
        <div className="h-48 bg-gray-700 rounded animate-pulse"></div>
        <div className="h-48 bg-gray-700 rounded animate-pulse"></div>
        <div className="h-48 bg-gray-700 rounded animate-pulse"></div>
        <div className="h-48 bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
  );
}
