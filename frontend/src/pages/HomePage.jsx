import { useMatches } from "../hooks/useMatches";

import MatchCard from "../components/match/MatchCard";

function HomePage() {
  const { data, isLoading, error } = useMatches(50);

  if (isLoading) {
    return (
      <div className="text-white text-2xl">
        Loading matches...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-2xl">
        Failed to load matches
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-5xl font-bold">
          KhelPulse
        </h1>

        <p className="text-gray-400">
          Real-Time Sports Updates
        </p>
      </div>

      {data?.data?.length === 0 ? (
        <div className="text-gray-400">
          No matches found
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.data?.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;