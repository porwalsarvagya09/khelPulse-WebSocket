import { useMatches } from "../hooks/useMatches";

function HomePage() {
  const { data, isLoading, error } = useMatches();

  if (isLoading) {
    return <h1 className="text-2xl">Loading matches...</h1>;
  }

  if (error) {
    return <h1 className="text-2xl text-red-500">Failed to load matches</h1>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Live Matches
      </h1>

      <div className="space-y-4">
        {data?.data?.map((match) => (
          <div
            key={match.id}
            className="p-4 rounded-lg bg-gray-900 border border-gray-800"
          >
            <h2 className="text-2xl font-semibold">
              {match.homeTeam} vs {match.awayTeam}
            </h2>

            <p className="text-gray-400">
              {match.sport}
            </p>

            <p className="text-green-400 mt-2">
              {match.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;