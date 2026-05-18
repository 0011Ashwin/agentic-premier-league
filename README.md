# 🏏 Agentic Premier League

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://agentic-premier-league-136344673885.us-central1.run.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/0011Ashwin/agentic-premier-league)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Agentic Premier League** is a modern, real-time "second-screen" application designed to transform how fans experience live sporting events. Moving beyond passive viewing, this platform enables interactive engagement through real-time match data, AI-driven tactical insights, and gamified play-by-play predictions.

---

## ✨ Key Features

### 📊 Real-Time Live Dashboard
Experience the match with a high-fidelity IPL-themed interface.
- **Live Scorecard**: Real-time updates for scores, wickets, and overs.
- **Dynamic Win Probability**: Visual representation of the match momentum shifting ball-by-ball.
- **Cricbuzz Integration**: Powered by real stadium data via RapidAPI.

### 🤖 AI Tactical Insights
An "Agentic" layer that analyzes the match context to provide:
- **Strategic Commentary**: Contextual insights on bowling changes and field placements.
- **Projected Outcomes**: Predicted scores and win/loss analysis based on current run rates.
- **Fan Trivia**: Intelligent prompts triggered by key match moments.

### 🎯 Play-By-Play Predictions
Engage with every ball.
- **Interactive Gamification**: Fans predict the outcome of the next ball (Dot, Single, Boundary, or Wicket).
- **Instant Feedback**: Results are processed immediately after the ball is bowled in the live feed.
- **Live Leaderboard**: Compete with other fans in real-time.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Vanilla CSS (Modern aesthetic with high performance).
- **Backend**: Node.js, Express, Socket.io (Low-latency real-time communication).
- **Data Source**: Cricbuzz API (via RapidAPI).
- **Infrastructure**: Docker & Google Cloud Run (Serverless scalability).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- A RapidAPI Key (Cricbuzz API)

### Local Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/0011Ashwin/agentic-premier-league.git
   cd agentic-premier-league
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   # Create a .env file with your credentials
   echo "RAPIDAPI_KEY=your_key\nRAPIDAPI_HOST=cricbuzz-cricket.p.rapidapi.com\nMATCH_ID=101683" > .env
   npm start
   ```

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## ☁️ Deployment

The project is optimized for **Google Cloud Run**.

```bash
gcloud run deploy agentic-premier-league \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="RAPIDAPI_KEY=your_key,RAPIDAPI_HOST=cricbuzz-cricket.p.rapidapi.com,MATCH_ID=101683"
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ for IPL Fans everywhere.**
