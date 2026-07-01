# AcademyBackendTestNodeJS

**Author:** Amir Bassem

A robust, TypeScript-based RESTful API built with Node.js, Express, and PostgreSQL. This project manages a music catalog and user playlists, adhering to SOLID principles and clean architecture.

##  Technologies Used
* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** PostgreSQL (Supabase)
* **Testing:** Jest & Supertest

##  Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/AmirBassemAdibAbdou/AcademyBackendTestNodeJS.git](https://github.com/AmirBassemAdibAbdou/AcademyBackendTestNodeJS.git)
   cd AcademyBackendTestNodeJS

2. Install dependencies:
    ```bash
    npm install 

3. Environment Variables:
Create a .env file in the root directory and add the PostgreSQL connection string I sent in the email. It will have database setup and example info inserted for manual testing


## Run the application in developer mode:
```bash
npm run dev
```

## Run unit and integration tests:
```bash
npm run test
```

## API Endpoints

### Songs
* `POST /api/songs` - Create a new song
* `GET /api/songs` - Fetch all songs

### Playlists
* `POST /api/playlists` - Create a new playlist
* `GET /api/playlists?user_id={id}` - Fetch playlists for a specific user
* `PUT /api/playlists/:id` - Rename a playlist (Bonus)
* `DELETE /api/playlists/:id` - Delete a playlist (Bonus)

### Playlist-Song Management
* `POST /api/playlists/:id/songs` - Add a song to a playlist
* `GET /api/playlists/:id/songs` - View all songs in a playlist
* `DELETE /api/playlists/:id/songs/:songId` - Remove a song from a playlist (Bonus)