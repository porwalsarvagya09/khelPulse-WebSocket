import { Link } from "react-router-dom";

function MatchCard({ match }) {
  return (
    <Link to={`/matches/${match.id}`}>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-green-500 transition-all duration-300 hover:scale-[1.02]">
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm uppercase text-green-400 font-semibold">
            {match.sport}
          </span>

          <span className="text-sm text-gray-400">
            {match.status}
          </span>
        </div>

        <h2 className="text-2xl font-bold mb-2">
          {match.homeTeam}
        </h2>

        <p className="text-center text-gray-500 font-semibold my-2">
          VS
        </p>

        <h2 className="text-2xl font-bold">
          {match.awayTeam}
        </h2>

        <div className="mt-5 flex justify-between text-gray-400 text-sm">
          <span>
            {match.homeScore ?? 0}
          </span>

          <span>
            {match.awayScore ?? 0}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default MatchCard;