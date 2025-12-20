
# Streamflix

Streamflix is a modern, self-hosted movie streaming application that lets you stream your local video collection with a premium, Netflix-like user interface. It automatically scans your movie library and uses AI (Google Gemini) to fetch metadata.

## Features

- 🎥 **Local Streaming**: Stream movies directly from your local `movies` folder.
- 🤖 **AI-Powered Metadata**: Automatically extracts movie details (Title, Year, Genre, Description) from filenames using Google Gemini.
- 👥 **Multi-Profile Support**: Create multiple user profiles (including Kids profiles) for personalized experiences.
- ⏯️ **Smart Player**: Resume playback where you left off.
- 🎨 **Modern UI**: Built with a responsive, dark-themed design using Tailwind CSS and Framer Motion.
- 📱 **Responsive**: Works seamlessly on desktop and mobile devices.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Radix UI, Framer Motion, Wouter
- **Backend**: Express.js, WebSocket
- **Database**: PostgreSQL (via Drizzle ORM)
- **AI**: Google Gemini API
- **Language**: TypeScript

## Prerequisites

- Node.js (v20 or later)
- PostgreSQL database
- Google Gemini API Key

## Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/ArunkumarJ325/Streamflix.git
    cd Streamflix
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory with the following variables:
    ```env
    DATABASE_URL=postgres://user:password@host:port/dbname
    GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Database Migration**
    Push the schema to your database:
    ```bash
    npm run db:push
    ```

5.  **Add Movies**
    Place your video files (mp4, mkv, avi, etc.) in the `movies` folder in the project root.

6.  **Run the Server**
    ```bash
    npm run dev
    ```
    The application will start on `http://localhost:5000`.

## Usage

1.  Open the application in your browser.
2.  Create a user profile.
3.  Go to the Movies section. The app will automatically scan the `movies` folder and fetch metadata.
4.  Click on a movie to start streaming!

## License

MIT
