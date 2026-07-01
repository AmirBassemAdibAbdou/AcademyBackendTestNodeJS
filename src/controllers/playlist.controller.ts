import { Request, Response, NextFunction } from 'express';
import { PlaylistRepository } from '../repositories/playlist.repository';
import { AppError } from '../middleware/errorHandler';

const playlistRepo = new PlaylistRepository();

export const createPlaylist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, user_id } = req.body;

    if (!name || !user_id) {
      throw new AppError(400, 'Playlist name and user_id are required');
    }

    const newPlaylist = await playlistRepo.create({ name, user_id });
    
    res.status(201).json({
      status: 'success',
      data: newPlaylist
    });
  } catch (error) {
    next(error);
  }
};

export const getUserPlaylists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // We expect the user_id to be passed as a query parameter: /api/playlists?user_id=123
    const { user_id } = req.query;

    if (!user_id) {
      throw new AppError(400, 'user_id query parameter is required to fetch playlists');
    }

    const playlists = await playlistRepo.findByUserId(user_id as string);
    
    res.status(200).json({
      status: 'success',
      results: playlists.length,
      data: playlists
    });
  } catch (error) {
    next(error);
  }
  
};

export const addSongToPlaylist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const playlistId = parseInt(req.params.id as string, 10);
    const { song_id } = req.body;

    if (!playlistId || !song_id) {
      throw new AppError(400, 'Playlist ID in URL and song_id in body are required');
    }

    await playlistRepo.addSong(playlistId, song_id);
    
    res.status(201).json({
      status: 'success',
      message: 'Song successfully added to the playlist'
    });
  } catch (error) {
    // If a foreign key constraint fails (e.g., the song_id doesn't exist), PostgreSQL throws code '23503'
    if ((error as any).code === '23503') {
      next(new AppError(404, 'The requested song or playlist does not exist in the database'));
    } else {
      next(error);
    }
  }
};
export const getPlaylistSongs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const playlistId = parseInt(req.params.id as string, 10);

    if (!playlistId) {
      throw new AppError(400, 'Playlist ID is required in the URL');
    }

    const songs = await playlistRepo.getSongs(playlistId);
    
    res.status(200).json({
      status: 'success',
      results: songs.length,
      data: songs
    });
  } catch (error) {
    next(error);
  }
};
export const updatePlaylist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { name } = req.body;

    if (!id || !name) {
      throw new AppError(400, 'Playlist ID in URL and new name in body are required');
    }

    const updatedPlaylist = await playlistRepo.update(id, name);
    
    if (!updatedPlaylist) {
      throw new AppError(404, 'Playlist not found');
    }

    res.status(200).json({
      status: 'success',
      data: updatedPlaylist
    });
  } catch (error) {
    next(error);
  }
};

export const deletePlaylist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);

    if (!id) {
      throw new AppError(400, 'Playlist ID is required');
    }

    const deleted = await playlistRepo.delete(id);
    
    if (!deleted) {
      throw new AppError(404, 'Playlist not found');
    }

    // 204 No Content is the standard RESTful status for a successful deletion
    res.status(204).send(); 
  } catch (error) {
    next(error);
  }
};

export const removeSongFromPlaylist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const playlistId = parseInt(req.params.id as string, 10);
    const songId = parseInt(req.params.songId as string, 10);

    if (!playlistId || !songId) {
      throw new AppError(400, 'Playlist ID and Song ID are required in the URL');
    }

    const removed = await playlistRepo.removeSong(playlistId, songId);
    
    if (!removed) {
      throw new AppError(404, 'Record not found in the playlist');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};