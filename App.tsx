
import React, { useState, useCallback } from 'react';
import { RecommendationResponse, AppStatus } from './types';
import { getMovieRecommendations } from './services/geminiService';
import MovieCard from './components/MovieCard';

const App: React.FC = () => {
  const [mood, setMood] = useState<string>('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRecommend = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood.trim()) return;

    setStatus(AppStatus.LOADING);
    setError(null);
    setResult(null);

    try {
      const data = await getMovieRecommendations(mood);
      setResult(data);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setStatus(AppStatus.ERROR);
    }
  }, [mood]);

  const reset = () => {
    setMood('');
    setStatus(AppStatus.IDLE);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500/30">
      {/* Background patterns */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <header className="text-center mb-12 space-y-4">
          <div className="inline-block px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium mb-4">
            ✨ Cinema Therapy for Your Soul
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight">
            The <span className="gradient-text">Mood-to-Movie</span> Specialist
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Tell me how you're feeling today. I'll listen and curate three films that speak directly to your heart.
          </p>
        </header>

        {/* Form Section */}
        {status !== AppStatus.SUCCESS && (
          <div className="glass-card rounded-3xl p-8 md:p-12 shadow-2xl">
            <form onSubmit={handleRecommend} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="moodInput" className="block text-sm font-medium text-slate-400 ml-1">
                  Describe your mood...
                </label>
                <textarea
                  id="moodInput"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  placeholder="e.g., I'm feeling a bit overwhelmed and need something cozy to lift my spirits, or maybe something nostalgic..."
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-5 text-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none h-32"
                  disabled={status === AppStatus.LOADING}
                />
              </div>

              <button
                type="submit"
                disabled={status === AppStatus.LOADING || !mood.trim()}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  status === AppStatus.LOADING
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-purple-500/20 active:scale-95'
                }`}
              >
                {status === AppStatus.LOADING ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Consulting the stars...
                  </>
                ) : (
                  'Find My Movies'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Error State */}
        {status === AppStatus.ERROR && (
          <div className="mt-8 p-4 bg-red-900/20 border border-red-500/50 rounded-2xl text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Success State - Suggestions */}
        {status === AppStatus.SUCCESS && result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="glass-card p-8 rounded-3xl border-blue-500/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-2xl">
                  👋
                </div>
                <h2 className="text-xl font-semibold text-blue-300">A Message for You</h2>
              </div>
              <p className="text-xl text-slate-200 font-light leading-relaxed italic">
                "{result.empatheticMessage}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {result.suggestions.map((movie, idx) => (
                <MovieCard key={idx} movie={movie} index={idx} />
              ))}
            </div>

            <div className="flex justify-center pt-8">
              <button
                onClick={reset}
                className="px-8 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-2 border border-slate-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Try a new mood
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 py-12 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} Mood-to-Movie Specialist • Powered by Gemini AI</p>
        <p className="mt-2 px-6 max-w-lg mx-auto">
          "Movies can change the way we feel. Let's find the one that changes yours today."
        </p>
      </footer>
    </div>
  );
};

export default App;
