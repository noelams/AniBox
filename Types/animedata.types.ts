export interface AnimeLogData {
     review: string,
    status: "want to watch"| "watching"| "watched" | null,
    score: number,
    hasFavorite: boolean,
}

export interface AniCardProps{
  title: string,
  image:string,
  id:number,
}


export type AnimeResponse = {
  data: AnimeResponseItem[]
  paging: {
    next: string
  }
}

export type AnimeResponseItem = {
  node: {
    id: number
    title: string
    main_picture: {
      medium: string
      large: string
    }
  }
  ranking: {
    rank: number
  }
}

export type SearchSuggestionResponse = {
  mal_id: number;
  title: string;
}
