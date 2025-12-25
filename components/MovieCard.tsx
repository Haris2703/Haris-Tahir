
import React from 'react';
import { MovieSuggestion } from '../types';

interface MovieCardProps {
  movie: MovieSuggestion;
  index: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, index }) => {
  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col gap-4 transform transition-all duration-300 hover:scale-[1.02] hover:bg-slate-800/80 shadow-xl">
      <div className="flex items-start justify-between">
        <div className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          Recommendation #{index + 1}
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-1 leading-tight">{movie.title}</h3>
        <p className="text-sm font-medium text-purple-400 mb-3">{movie.genre}</p>
        <p className="text-slate-300 leading-relaxed italic">
          &ldquo;{movie.reason}&rdquo;
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
