import { ProfileSummaryResponse } from "./screen.types";

export interface AnimeLogData {
  review: string;
  status: "want to watch" | "watching" | "watched" | null;
  score: number;
  hasFavorite: boolean;
}

export interface AniCardProps {
  title: string;
  image: string;
  id: number;
}

export type AnimeResponseItem = {
  node: {
    id: number;
    title: string;
    main_picture: {
      medium: string;
      large: string;
    };
  };
  ranking: {
    rank: number;
  };
};

export type AnimeDataType = {
  title: string;
  main_picture: {
    medium: string;
    large: string;
  };
  start_date: string;
  synopsis: string;
  mean: number;
  nsfw: string;
  status: string;
  num_episodes: number;
  average_episode_duration: number;
  related_anime: ProfileSummaryResponse[];
  recommendations: ProfileSummaryResponse[];
  studios: string[];
};

export type SearchSuggestionResponse = {
  mal_id: number;
  title: string;
};
