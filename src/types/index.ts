export interface Song {
  id: number;
  title: string;
  artist: string;
  duration: number;
  created_at: Date;
}

export interface CreateSongDTO {
  title: string;
  artist: string;
  duration: number;
}
export interface Playlist {
  id: number;
  name: string;
  user_id: string;
  created_at: Date;
}

export interface CreatePlaylistDTO {
  name: string;
  user_id: string;
}