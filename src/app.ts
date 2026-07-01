import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import { createSong, getSongs } from './controllers/song.controller';
import { createPlaylist, getUserPlaylists, addSongToPlaylist, getPlaylistSongs } from './controllers/playlist.controller';
import { 
  updatePlaylist,
  deletePlaylist,
  removeSongFromPlaylist
} from './controllers/playlist.controller';
const app = express();

app.use(express.json());

// Routes
app.post('/api/songs', createSong);
app.get('/api/songs', getSongs);

// Playlist Routes
app.post('/api/playlists', createPlaylist);
app.get('/api/playlists', getUserPlaylists);
app.post('/api/playlists/:id/songs', addSongToPlaylist);


// Bonus Endpoints
app.get('/api/playlists/:id/songs', getPlaylistSongs);
app.put('/api/playlists/:id', updatePlaylist);
app.delete('/api/playlists/:id', deletePlaylist);
app.delete('/api/playlists/:id/songs/:songId', removeSongFromPlaylist);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.use(errorHandler);

// Replace the bottom lines with this:
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;