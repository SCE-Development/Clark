export const formatDetails = (details) => {
  if (!details || Object.keys(details).length === 0) return null;

  return (
    <div className="mt-3 p-4 bg-gray-700 rounded-lg border border-gray-600">
      <h4 className="font-semibold text-gray-300 mb-2">Details:</h4>
      <div className="space-y-1">
        {Object.entries(details).map(([key, value]) => (
          <div key={key} className="text-sm text-gray-300">
            <span className="font-medium text-gray-200">{key}:</span> {String(value)}
          </div>
        ))}
      </div>
    </div>
  );
};
