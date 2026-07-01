# AcademyBackendTestNodeJS

**Author:** Amir Bassem

A robust, TypeScript-based RESTful API built with Node.js, Express, and PostgreSQL. This project manages a music catalog and user playlists, adhering to SOLID principles and clean architecture.

##  Technologies Used
* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** PostgreSQL (Supabase)
* **Testing:** Jest & Supertest

##  Architectural Thought Process

When designing this backend environment, my primary goal was to build a system that is not only functional but also highly scalable, strictly typed, and aligned with standard business requirements. 

* **TypeScript & Express.js:** I opted for TypeScript over vanilla JavaScript to enforce strict contract boundaries via Interfaces and Data Transfer Objects (DTOs). This catches errors at compile-time rather than run-time. Express was chosen for its lightweight nature, allowing me to explicitly define a clean routing architecture without unnecessary overhead.
* **Database (PostgreSQL via Supabase):** A relational database is the most logical choice for this domain. The relationship between Users, Playlists, and Songs requires strict foreign-key constraints to prevent orphaned records. Utilizing PostgreSQL ensures data integrity at the database level, while the `JOIN` tables elegantly handle the many-to-many relationship of playlist songs.
* **Design Pattern:** I implemented a **Repository Pattern** to separate the core business logic from the HTTP transport layer. The Express Controllers only handle request validation and response formatting, while the Repositories execute the raw SQL. This makes the code highly modular and easily testable.
* **Testing Strategy:** I integrated Jest and Supertest to create a robust safety net. I specifically structured the automated test suites using a Behavior-Driven Development (BDD) approach, utilizing `Given-When-Then` scenarios. This directly bridges the gap between the underlying code and Agile product requirements, proving that the API endpoints deliver exactly what the feature demands.

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
