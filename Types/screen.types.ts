import { AnimeResponseItem } from "./animedata.types";

 export interface ErrorScreenProps {
  onRetry: () => void;
  onGoBack?: () => void;
  screenName?: string;
  errorMessage?: string;
  showGoBack?: boolean;
}


// screen.types.ts
export type AniCategoriesProps = {
  categoryTitle: string;
  animeObject?: AnimeResponseItem[] | ProfileSummaryResponse[];
  renderCard?: (item: any) => React.ReactElement; // optional override
  keyExtractor?: (item: any) => string;           // optional override
};


  export type ProfileErrorType = {
    details:string
    message: string
  }

  export type profileFavoritesResponse = {
    userId: string
    animeId: string
    addedAt: Date
  }

  export type ProfileSummaryResponse = {
    title: string
    main_picture:{
      medium: string
      large: string
    }
    id: number
  }

  export interface ProfileDataResponse {
     watchlistCount: number,
      totalWatchedCount: number,
      watchedThisYearCount: number,
      favoritesCount: number,
      favorites: profileFavoritesResponse[],
      recentFavorites: profileFavoritesResponse[],
      _id: string,
      profileImage: string,
      coverImage: string,
  }

  export type SignInFormData = {
    email: string;
    password: string;
  }

  export type SignUpFormData = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }