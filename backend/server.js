require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

const staticPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(staticPath));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Initial Match State (Fallback)
let matchState = {
  team1: "Fetching Live Data...",
  team2: "IPL 2026",
  score: 0,
  wickets: 0,
  overs: 0,
  balls: 0,
  target: 0,
  currentBatter: "Loading...",
  currentBowler: "Loading...",
  lastEvent: "Syncing with Stadium...",
  winProbability: { team1: 50, team2: 50 }
};

let insights = [];

// Cricbuzz API Integration
const fetchLiveScores = async () => {
  try {
    const options = {
      method: 'GET',
      url: `https://${process.env.RAPIDAPI_HOST}/mcenter/v1/${process.env.MATCH_ID}/scard`,
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': process.env.RAPIDAPI_HOST
      }
    };

    const response = await axios.request(options);
    const data = response.data;

    // Minimal mapping logic - adjust based on actual API response structure
    if (data && data.matchScoreDetails) {
      const scoreObj = data.matchScoreDetails.inningsScoreList[0];
      matchState = {
        ...matchState,
        team1: data.matchHeader.team1.shortName,
        team2: data.matchHeader.team2.shortName,
        score: scoreObj.score,
        wickets: scoreObj.wickets,
        overs: scoreObj.overs,
        lastEvent: data.status || "Match in Progress",
      };
      
      io.emit('match_update', matchState);
      console.log(`Updated Match State: ${matchState.team1} vs ${matchState.team2} - ${matchState.score}/${matchState.wickets}`);
    }
  } catch (error) {
    console.error("API Fetch Error:", error.message);
    // Fallback to simulation logic if API fails or Match ID is inactive
    simulateBall(); 
  }
};

// Simulated Insights (Still Agentic!)
const generateAIInsight = () => {
  const tacticalInsights = [
    "Projected score based on current run rate is 175.",
    "The dew factor might come into play in the next 30 minutes.",
    "Captain bringing in the spinner to exploit the rough patch.",
    "Fielding changes: Deep mid-wicket moving finer to prevent the sweep."
  ];
  const insight = tacticalInsights[Math.floor(Math.random() * tacticalInsights.length)];
  io.emit('ai_insight', insight);
};

// Simulation fallback for interactive demo if API is quiet
const simulateBall = () => {
  matchState.balls += 1;
  if (matchState.balls >= 6) {
    matchState.overs += 1;
    matchState.balls = 0;
  }
  io.emit('ball_result', { outcome: Math.floor(Math.random() * 7), matchState });
  setTimeout(() => io.emit('next_ball_start'), 3000);
};

// Polling and Insight Cycles
setInterval(fetchLiveScores, 60000); // Poll every minute
setInterval(generateAIInsight, 45000); // New insight every 45s

io.on('connection', (socket) => {
  socket.emit('match_update', matchState);
  
  socket.on('submit_prediction', (data) => {
    console.log(`Prediction from ${data.username}: ${data.prediction}`);
  });
});

app.use((req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

server.listen(PORT, HOST, () => {
  console.log(`Agentic Premier League Backend running on port ${PORT}`);
  fetchLiveScores(); // Initial fetch
});
