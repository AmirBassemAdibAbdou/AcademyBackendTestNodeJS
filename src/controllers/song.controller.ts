import { Request, Response, NextFunction } from 'express';
import { SongRepository } from '../repositories/song.repository';
import { AppError } from '../middleware/errorHandler';

const songRepo = new SongRepository();

export const createSong = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, artist, duration } = req.body;

    if (!title || !artist || !duration) {
      throw new AppError(400, 'Title, artist, and duration are required');
    }

    const newSong = await songRepo.create({ title, artist, duration });
    
    res.status(201).json({
      status: 'success',
      data: newSong
    });
  } catch (error) {
    next(error);
  }
};

export const getSongs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const songs = await songRepo.findAll();
    
    res.status(200).json({
      status: 'success',
      results: songs.length,
      data: songs
    });
  } catch (error) {
    next(error);
  }
};