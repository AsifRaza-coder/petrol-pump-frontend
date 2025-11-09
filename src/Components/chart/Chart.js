import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

//Data required for the implementation of chart
const data = [
  { name: "January", Total: 1200 },
  { name: "Feburary", Total: 2100 },
  { name: "March", Total: 800 },
  { name: "April", Total: 1600 },
  { name: "May", Total: 900 },
  { name: "June", Total: 1700 },
];
const Chart = ({ aspect, title, startColor, endColor }) => {
  console.log("Start Color => ", startColor, "End Color => ", endColor)
  return (
    <div className="flex-[4] shadow-[2px_4px_10px_1px_rgba(201,201,201,0.47)] p-2.5 text-gray-500">
      <div className="mb-2.5">{title}</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={startColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={endColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" />

          <CartesianGrid strokeDasharray="3 3" stroke="rgb(228, 225, 225)" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
