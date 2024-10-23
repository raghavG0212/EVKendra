import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

export default function VotersJoinedGraph() {
  const [voterData, setVoterData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVotersJoinedData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/v1/voter/voters-per-month");
        setVoterData(response.data);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Error fetching voters data"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchVotersJoinedData();
  }, []);

  const chartData = {
    labels: voterData.map((data) => data.month),
    datasets: [
      {
        label: "Voters Joined",
        data: voterData.map((data) => data.count),
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Voters",
        },
      },
    },
  };

  return (
    <div className="mt-5">
      <div>
        <Line
          data={chartData}
          options={chartOptions}
        />
      </div>
    </div>
  );
}
