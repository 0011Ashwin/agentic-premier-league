import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import './App.css';

const SOCKET_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';

interface MatchState {
  team1: string;
  team2: string;
  score: number;
  wickets: number;
  overs: number;
  balls: number;
  target: number;
  currentBatter: string;
  currentBowler: string;
  lastEvent: string;
  winProbability: { team1: number; team2: number };
}

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [prediction, setPrediction] = useState<string>('');
  const [insights, setInsights] = useState<string[]>([]);
  const [lastResult, setLastResult] = useState<string>('');
  const [isBettingOpen, setIsBettingOpen] = useState<boolean>(true);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('match_update', (data: MatchState) => {
      setMatchState(data);
    });

    newSocket.on('ball_result', (data: { outcome: any; matchState: MatchState }) => {
      setMatchState(data.matchState);
      setLastResult(`Ball Outcome: ${data.outcome}`);
      setIsBettingOpen(false);
    });

    newSocket.on('next_ball_start', () => {
      setLastResult('');
      setIsBettingOpen(true);
      setPrediction('');
    });

    newSocket.on('ai_insight', (insight: string) => {
      setInsights(prev => [insight, ...prev].slice(0, 5));
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handlePredict = (val: string) => {
    if (!isBettingOpen) return;
    setPrediction(val);
    socket?.emit('submit_prediction', { username: 'Fan_1', prediction: val });
  };

  if (!matchState) return <div className="loading">Connecting to Stadium...</div>;

  return (
    <div className="app-container">
      <header className="header">
        <h1>Agentic Premier League</h1>
        <div className="live-tag">LIVE</div>
      </header>

      <main className="dashboard">
        <section className="scorecard-panel">
          <div className="teams">
            <span className={matchState.winProbability.team1 > 50 ? 'dominant' : ''}>{matchState.team1}</span>
            <span className="vs">vs</span>
            <span className={matchState.winProbability.team2 > 50 ? 'dominant' : ''}>{matchState.team2}</span>
          </div>
          
          <div className="main-score">
            <h2>{matchState.score}/{matchState.wickets}</h2>
            <p className="overs">Overs: {matchState.overs}.{matchState.balls}</p>
          </div>

          <div className="win-prob">
            <div className="prob-bar">
              <div className="team1-fill" style={{ width: `${matchState.winProbability.team1}%` }}></div>
            </div>
            <div className="prob-labels">
              <span>{matchState.team1} {matchState.winProbability.team1}%</span>
              <span>{matchState.winProbability.team2}% {matchState.team2}</span>
            </div>
          </div>

          <div className="last-event">
            <strong>Last Ball:</strong> {matchState.lastEvent}
          </div>
        </section>

        <section className="interaction-panel">
          <div className="prediction-box">
            <h3>Predict Next Ball</h3>
            {isBettingOpen ? (
              <div className="options">
                {['Dot', 'Single', 'Boundary', 'Wicket'].map(opt => (
                  <button 
                    key={opt} 
                    className={prediction === opt ? 'selected' : ''}
                    onClick={() => handlePredict(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div className="result-lock">
                <p>Waiting for result...</p>
                {lastResult && <p className="outcome-text">{lastResult}</p>}
              </div>
            )}
            {prediction && <p className="your-pick">Your pick: <strong>{prediction}</strong></p>}
          </div>

          <div className="insights-box">
            <h3>AI Tactical Insights</h3>
            <ul>
              {insights.map((insight, i) => (
                <li key={i} className="insight-item">{insight}</li>
              ))}
              {insights.length === 0 && <li className="placeholder">Awaiting AI analysis...</li>}
            </ul>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Built with AI for IPL Fans</p>
      </footer>
    </div>
  );
}

export default App;
