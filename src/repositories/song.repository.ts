import pool from '../config/db';
import { Song, CreateSongDTO } from '../types';

export class SongRepository {
  async create(song: CreateSongDTO): Promise<Song> {
    const query = `
      INSERT INTO songs (title, artist, duration)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [song.title, song.artist, song.duration];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async findAll(): Promise<Song[]> {
    const query = `SELECT * FROM songs ORDER BY created_at DESC;`;
    const result = await pool.query(query);
    return result.rows;
  }

  async findById(id: number): Promise<Song | null> {
    const query = `SELECT * FROM songs WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM songs WHERE id = $1 RETURNING id;`;
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}