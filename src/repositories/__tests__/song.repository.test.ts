import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { SongRepository } from '../song.repository';
import pool from '../../config/db';

// Mock the database pool entirely so we do not hit the real database
jest.mock('../../config/db', () => ({
  query: jest.fn(),
}));

describe('Feature: Song Repository Database Operations', () => {
  let songRepo: SongRepository;

  beforeEach(() => {
    songRepo = new SongRepository();
    // Clear mock history before each test to prevent data leakage
    jest.clearAllMocks();
  });

  describe('Scenario: Creating a new song', () => {
    it('should successfully execute the INSERT query and return the new song', async () => {
      // GIVEN a valid song data transfer object and a mocked database response
      const newSongDto = { title: 'Mocked Rhapsody', artist: 'Mocked Queen', duration: 300 };
      const mockDbResponse = {
        rows: [{ id: 1, ...newSongDto, created_at: new Date() }],
      };
      
      // Override the mocked pool.query to return our specific response
      (pool.query as unknown as jest.MockedFunction<typeof pool.query>).mockResolvedValue(mockDbResponse as never);

      // WHEN the repository's create method is called
      const result = await songRepo.create(newSongDto);

      // THEN the database connection should be called exactly once
      expect(pool.query).toHaveBeenCalledTimes(1);
      
      // AND it should be called with the correct parameterized SQL variables
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO songs'),
        [newSongDto.title, newSongDto.artist, newSongDto.duration]
      );
      
      // AND the result should match the mocked database row
      expect(result.id).toBe(1);
      expect(result.title).toBe('Mocked Rhapsody');
    });
  });

  describe('Scenario: Fetching all songs', () => {
    it('should execute the SELECT query and return an array of songs', async () => {
      // GIVEN a mocked database response containing multiple rows
      const mockDbResponse = {
        rows: [
          { id: 1, title: 'Song 1', artist: 'Artist 1', duration: 100 },
          { id: 2, title: 'Song 2', artist: 'Artist 2', duration: 200 }
        ],
      };
      (pool.query as unknown as jest.MockedFunction<typeof pool.query>).mockResolvedValue(mockDbResponse as never);

      // WHEN the repository's findAll method is called
      const results = await songRepo.findAll();

      // THEN it should execute a SELECT query without parameters
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM songs')
      );
      
      // AND it should return the correct number of records
      expect(results.length).toBe(2);
      expect(results[1].title).toBe('Song 2');
    });
  });
  describe('Scenario: Fetching a single song by ID', () => {
    it('should execute the SELECT query with ID and return a single song', async () => {
      // GIVEN a mocked database response for a specific ID
      const mockDbResponse = {
        rows: [{ id: 1, title: 'Bohemian Rhapsody', artist: 'Queen', duration: 354 }],
      };
      (pool.query as jest.Mock).mockResolvedValue(mockDbResponse as never);

      // WHEN the repository's findById method is called
      const result = await songRepo.findById(1);

      // THEN it should execute a SELECT query with the correct parameter
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM songs WHERE id = $1'),
        [1]
      );
      
      // AND it should return the correct song object
      expect(result).not.toBeNull();
      expect(result?.title).toBe('Bohemian Rhapsody');
    });
  });

  describe('Scenario: Deleting a song', () => {
    it('should execute the DELETE query and return true if a row was affected', async () => {
      // GIVEN a mocked database response indicating one row was deleted
      const mockDbResponse = { rowCount: 1 };
      (pool.query as jest.Mock).mockResolvedValue(mockDbResponse as never);

      // WHEN the repository's delete method is called
      const result = await songRepo.delete(1);

      // THEN it should execute the DELETE query with the correct ID
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM songs WHERE id = $1'),
        [1]
      );
      
      // AND it should return true
      expect(result).toBe(true);
    });
  });
});