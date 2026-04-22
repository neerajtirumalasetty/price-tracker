import React, { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

function App() {
  const [item, setItem] = useState("tomato");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState("vijayawada");

  const items = ["tomato", "onion", "potato"];
  const cities = ["vijayawada", "hyderabad", "bangalore"];

  const fetchTrend = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/trend?item=${item}`
      );
      setData(res.data);
    } catch (err) {
      console.error("API error:", err);
    }
    setLoading(false);
  };

  // Enter key support
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchTrend();
    }
  };

  const labels = [
    ...new Set(data.map((d) => new Date(d.date).toLocaleDateString())),
  ];

  const chartData = {
    labels,
    datasets: cities.map((city) => {
      const cityData = data.filter((d) => d.city === city);
      const isSelected = city === selectedCity;

      return {
        label: city,
        data: cityData.map((d) => d.price),
        borderColor: isSelected ? "#4CAF50" : "#666",
        backgroundColor: "transparent",
        tension: 0.4,
        borderWidth: isSelected ? 3 : 1,
      };
    }),
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: { color: "white" },
        grid: { color: "#444" },
      },
      y: {
        ticks: { color: "white" },
        grid: { color: "#444" },
      },
    },
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#121212",
        color: "white",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1>MarketPulse – Price Intelligence Dashboard</h1>

      {/* Controls */}
      <div style={{ marginBottom: "20px" }}>
        <select
          value={item}
          onChange={(e) => setItem(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{
            padding: "10px",
            marginRight: "10px",
            fontSize: "16px",
          }}
        >
          {items.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>

        <button
          onClick={fetchTrend}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Get Trend
        </button>
      </div>

      {/* Custom city selector */}
      <div style={{ marginBottom: "20px" }}>
        {cities.map((city) => (
          <span
            key={city}
            onClick={() => setSelectedCity(city)}
            style={{
              margin: "0 10px",
              cursor: "pointer",
              padding: "6px 12px",
              borderRadius: "20px",
              border: "2px solid",
              borderColor: city === selectedCity ? "#4CAF50" : "#555",
              color: city === selectedCity ? "#4CAF50" : "#aaa",
              fontSize: "14px",
            }}
          >
            ● {city}
          </span>
        ))}
      </div>

      {loading && <p>Loading...</p>}

      {data.length > 0 && (
        <Line key={item} data={chartData} options={chartOptions} />
      )}
    </div>
  );
}

export default App;