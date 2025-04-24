import { useEffect, useState } from "react";
import useStatistics from "./useStatistics";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function DashBoard() {
  const Datapoint = 20;
  const statsData = useStatistics(Datapoint);
  const [staticData, setStaticData] = useState<StaticData | null>(null);

  useEffect(() => {
    if (window.electron) {
      window.electron.getStaticData().then(setStaticData);
    }
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">System Resource Monitor</h1>

      {staticData && (
        <div className="bg-white shadow-md p-4 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Static Info</h2>
          <p>
            <strong>CPU:</strong> {staticData.cpuModel}
          </p>
          <p>
            <strong>Total Memory:</strong> {staticData.totalMemoryGB} GB
          </p>
          <p>
            <strong>Total Storage:</strong> {staticData.totalStorage} GB
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 shadow-md rounded-xl">
          <h3 className="text-lg font-semibold mb-2">CPU Usage (%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={statsData}>
              <Line type="monotone" dataKey="cpuUsage" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="timestamp" tick={false} />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 shadow-md rounded-xl">
          <h3 className="text-lg font-semibold mb-2">RAM Usage (%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={statsData}>
              <Line type="monotone" dataKey="ramUsage" stroke="#82ca9d" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="timestamp" tick={false} />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 shadow-md rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Storage Usage (GB)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statsData}>
              <Bar dataKey="storageData" fill="#ffc658" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="timestamp" tick={false} />
              <YAxis />
              <Tooltip />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
