import pool from '../config/db';
import { Playlist, CreatePlaylistDTO } from '../types';

export class PlaylistRepository {
  
  // Create a playlist
  async create(playlist: CreatePlaylistDTO): Promise<Playlist> {
    const query = `
      INSERT INTO playlists (name, user_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await pool.query(query, [playlist.name, playlist.user_id]);
    return result.rows[0];
  }

  // Fetch playlists belonging to a specific user
  async findByUserId(userId: string): Promise<Playlist[]> {
    const query = `SELECT * FROM playlists WHERE user_id = $1 ORDER BY created_at DESC;`;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // Update a playlist's name (Bonus Deliverable)
  async update(id: number, name: string): Promise<Playlist | null> {
    const query = `
      UPDATE playlists
      SET name = $1
      WHERE id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [name, id]);
    return result.rows[0] || null;
  }

  // Delete a playlist entirely (Bonus Deliverable)
  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM playlists WHERE id = $1 RETURNING id;`;
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }
  // Add a song to a playlist
  async addSong(playlistId: number, songId: number): Promise<boolean> {
    const query = `
      INSERT INTO playlist_songs (playlist_id, song_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING; -- Prevents duplicate entries from crashing the app
    `;
    const result = await pool.query(query, [playlistId, songId]);
    return (result.rowCount ?? 0) > 0;
  }

  // Remove a song from a playlist (Bonus Deliverable)
  async removeSong(playlistId: number, songId: number): Promise<boolean> {
    const query = `
      DELETE FROM playlist_songs
      WHERE playlist_id = $1 AND song_id = $2;
    `;
    const result = await pool.query(query, [playlistId, songId]);
    return (result.rowCount ?? 0) > 0;
  }
  // Fetch all songs inside a specific playlist
    async getSongs(playlistId: number): Promise<any[]> {
    const query = `
      SELECT s.id, s.title, s.artist, s.duration, ps.added_at
      FROM songs s
      JOIN playlist_songs ps ON s.id = ps.song_id
      WHERE ps.playlist_id = $1
      ORDER BY ps.added_at DESC;
    `;
    const result = await pool.query(query, [playlistId]);
    return result.rows;
  }
}