import request from 'supertest';
import app from '../../app';
import { SongRepository } from '../song.repository';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
// Mock the repository layer so we don't make real network calls to Supabase.
// Notice the path is exactly the same as the import above it!
jest.mock('../song.repository');

describe('Feature: Song API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Scenario: Creating a new song via POST /api/songs', () => {
    it('should return a 201 Created status and the new song data', async () => {
      // GIVEN a valid JSON request body
      const newSong = { title: 'Integration Test Song', artist: 'Test Artist', duration: 180 };
      
      // Mock the repository to simulate a successful database insert
      (SongRepository.prototype.create as jest.Mock<(...args: any[]) => Promise<any>>).mockResolvedValue({
        id: 1,
        ...newSong,
        created_at: new Date()
      });

      // WHEN we send the POST request to the Express app
      const response = await request(app)
        .post('/api/songs')
        .send(newSong);

      // THEN the API should respond with standard RESTful success patterns
      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.title).toBe('Integration Test Song');
    });

    it('should return a 400 Bad Request if required fields are missing', async () => {
      // GIVEN a request body missing the 'duration' field
      const invalidSong = { title: 'Incomplete Song', artist: 'Test Artist' };

      // WHEN we send the POST request
      const response = await request(app)
        .post('/api/songs')
        .send(invalidSong);

      // THEN the custom error handler should catch it and return a 400
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('required');
    });
  });

  describe('Scenario: Fetching songs via GET /api/songs', () => {
    it('should return a 200 OK status and a list of songs', async () => {
      // GIVEN the database has existing songs
      const mockSongs = [
        { id: 1, title: 'Song A', artist: 'Artist A', duration: 200 },
        { id: 2, title: 'Song B', artist: 'Artist B', duration: 250 }
      ];
      (SongRepository.prototype.findAll as jest.MockedFunction<
        typeof SongRepository.prototype.findAll
      >).mockResolvedValue(mockSongs as any);

      // WHEN we send the GET request
      const response = await request(app).get('/api/songs');

      // THEN the API should return the correctly formatted JSON payload
      expect(response.status).toBe(200);
      expect(response.body.results).toBe(2);
      expect(response.body.data[0].title).toBe('Song A');
    });
  });
});
