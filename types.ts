
export interface MovieSuggestion {
  title: string;
  genre: string;
  reason: string;
}

export interface RecommendationResponse {
  suggestions: MovieSuggestion[];
  empatheticMessage: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
