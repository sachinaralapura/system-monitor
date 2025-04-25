import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import useStatistics from "./useStatistics";

// Extended Statistics with calculated percentages
type FormattedStatistic = Statistics & {
  cpuPercentage: number;
  ramPercentage: number;
  storagePercentage: number;
  index: number;
};

// Props for StatCard component
interface StatCardProps {
  title: string;
  value: string;
  color: string;
}

// Storage data for pie chart
type StorageDataItem = {
  name: string;
  value: number;
};

function DashBoard(props: { dataPoint: number }) {
  const [staticData, setStaticData] = useState<StaticData | null>(null);
  const statistics = useStatistics(props.dataPoint); // Keep 30 data points

  const [view, SetView] = useState<Views>({
    CPU: true,
    RAM: true,
    STORAGE: true,
    STORAGESTATIC: true,
  });

  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const data = await window.electron.getStaticData();
        setStaticData(data);
      } catch (error) {
        console.error("Failed to fetch static data:", error);
      }
    };
    fetchStaticData();

    // subscribe for change view
    const cb = window.electron.subscribeChangeView((view) => {
      SetView(view);
    });

    // unscribe changeview
    return cb;
  }, []);

  if (!staticData) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="text-xl font-semibold">
          Loading system information...
        </div>
      </div>
    );
  }

  // Calculate percentages for usage
  // Based on sample data, values appear to be already in decimal form (0-1 range)
  const formattedStatistics: FormattedStatistic[] = statistics.map(
    (stat, index) => ({
      ...stat,
      // Convert decimal to percentage (0-100 range)
      cpuPercentage: stat.cpuUsage * 100,
      ramPercentage: stat.ramUsage * 100,
      storagePercentage: stat.storageData * 100,
      index,
    })
  );

  // Current values (most recent data point)
  const currentStats: FormattedStatistic =
    formattedStatistics.length > 0
      ? formattedStatistics[formattedStatistics.length - 1]
      : {
          cpuUsage: 0,
          ramUsage: 0,
          storageData: 0,
          cpuPercentage: 0,
          ramPercentage: 0,
          storagePercentage: 0,
          index: 0,
        };

  // Data for storage usage pie chart - assuming storageData is a percentage of used storage
  const storageData: StorageDataItem[] = [
    { name: "Used", value: staticData.totalStorage * currentStats.storageData },
    {
      name: "Free",
      value: staticData.totalStorage * (1 - currentStats.storageData),
    },
  ];

  return (
    // Removed max-width constraint to use full screen width
    <div className="bg-gray-100 min-h-screen w-full p-4">
      <div className="w-full">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            System Resource Monitor
          </h1>
          <div className="mt-2 text-gray-600">
            <p>CPU: {staticData.cpuModel}</p>
            <p>Total Memory: {staticData.totalMemoryGB} GB</p>
            <p>Total Storage: {staticData.totalStorage} GB</p>
          </div>
        </header>

        {/* Current Usage Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="CPU Usage"
            value={`${currentStats.cpuPercentage.toFixed(1)}%`}
            color={COLORS[0]}
          />
          <StatCard
            title="RAM Usage"
            value={`${currentStats.ramPercentage.toFixed(1)}%`}
            color={COLORS[1]}
          />
          <StatCard
            title="Storage Usage"
            value={`${currentStats.storagePercentage.toFixed(1)}%`}
            color={COLORS[2]}
          />
        </div>

        {/* Charts */}
        <div
          className={
            (view.CPU || view.RAM) && view.STORAGE
              ? `grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4`
              : "w-full"
          }
        >
          {/* CPU & RAM Line Chart */}
          {(view.CPU || view.RAM) && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">
                CPU & RAM Usage Over Time
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formattedStatistics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="index"
                      label={{
                        value: "Time",
                        position: "insideBottom",
                        offset: -5,
                      }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      label={{
                        value: "Usage %",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip
                      formatter={(value: number) =>
                        `${Number(value).toFixed(1)}%`
                      }
                    />
                    <Legend />
                    {view.CPU && (
                      <Line
                        type="monotone"
                        dataKey="cpuPercentage"
                        name="CPU %"
                        stroke={COLORS[0]}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    )}
                    {view.RAM && (
                      <Line
                        type="monotone"
                        dataKey="ramPercentage"
                        name="RAM %"
                        stroke={COLORS[1]}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          {/* Storage Pie Chart */}
          {view.STORAGE && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Storage Usage</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={storageData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({
                        name,
                        percent,
                      }: {
                        name: string;
                        percent: number;
                      }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {storageData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `${value.toFixed(2)} GB`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Storage Usage Area Chart */}
        {view.STORAGESTATIC && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">
              Storage Usage Over Time
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedStatistics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="index" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    formatter={(value: number) =>
                      `${Number(value).toFixed(1)}%`
                    }
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="storagePercentage"
                    name="Storage %"
                    stroke={COLORS[2]}
                    fill={COLORS[2]}
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Constant for colors
const COLORS: string[] = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Stat Card Component
function StatCard({ title, value, color }: StatCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <div className="text-2xl md:text-3xl font-semibold" style={{ color }}>
          {value}
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
