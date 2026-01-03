import { ComposedChart, BarChart, Bar, Line, Area, XAxis, YAxis, ReferenceLine, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const MyChartTemp = ({chartData}) => {
  const avgPv3 = chartData.reduce((sum, item) => sum + item.pv3_temp, 0) / chartData.length
  const avgPv10 = chartData.reduce((sum, item) => sum + item.pv10_temp, 0) / chartData.length
  return (
    <ResponsiveContainer width="98%" height={400} margin="auto">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="pvm" />
        <YAxis
            tickFormatter={(value) =>
            typeof value === 'number' ? value.toFixed(1) : ''
            } />
        <Tooltip
            formatter={(value) =>
            value === null ? '-' : `${value.toFixed(2)} °C`
            } />
        <Legend />
        <Bar dataKey="pv3_temp" name="3 päivää" fill="#a3d8ff" />
        <Bar dataKey="pv10_temp" name="10 päivää" fill="#ffb74d" />
        <ReferenceLine y={avgPv3} stroke="#a3d8ff" strokeDasharray="3 3" />
        <ReferenceLine y={avgPv10} stroke="#ffb74d" strokeDasharray="3 3" />
      </BarChart>
    </ResponsiveContainer>
  )
}

const MyChartRain = ({chartData}) => {
  const avgPv3 = chartData.reduce((sum, item) => sum + item.pv3_rain, 0) / chartData.length
  const avgPv10 = chartData.reduce((sum, item) => sum + item.pv10_rain, 0) / chartData.length
  return (
    <ResponsiveContainer width="98%" height={400} margin="auto">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="pvm" />
        <YAxis
            tickFormatter={(value) =>
            typeof value === 'number' ? value.toFixed(2) : ''
            } />
        <Tooltip
            formatter={(value) =>
            value === null ? '-' : `${value.toFixed(2)} mm`
            } />
        <Legend />
        <Bar dataKey="pv3_rain" name="3 päivää" fill="#a3d8ff" />
        <Bar dataKey="pv10_rain" name="10 päivää" fill="#ffb74d" />
        <ReferenceLine y={avgPv3} stroke="#a3d8ff" strokeDasharray="3 3" />
        <ReferenceLine y={avgPv10} stroke="#ffb74d" strokeDasharray="3 3" />
      </BarChart>
    </ResponsiveContainer>
  )
}

const MyChartCloud = ({chartData}) => {
  const avgPv3 = chartData.reduce((sum, item) => sum + item.pv3_cloud, 0) / chartData.length
  const avgPv10 = chartData.reduce((sum, item) => sum + item.pv10_cloud, 0) / chartData.length
  return (
    <ResponsiveContainer width="98%" height={400} margin="auto">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="pvm" />
        <YAxis
            tickFormatter={(value) =>
            typeof value === 'number' ? value.toFixed(0) : ''
            } />
        <Tooltip
            formatter={(value) =>
            value === null ? '-' : `${value.toFixed(0)} %`
            } />
        <Legend />
        <Bar dataKey="pv3_cloud" name="3 päivää" fill="#a3d8ff" />
        <Bar dataKey="pv10_cloud" name="10 päivää" fill="#ffb74d" />
        <ReferenceLine y={avgPv3} stroke="#a3d8ff" strokeDasharray="3 3" />
        <ReferenceLine y={avgPv10} stroke="#ffb74d" strokeDasharray="3 3" />
      </BarChart>
    </ResponsiveContainer>
  )
}

const MixedChart = ({chartData}) => {
    return (
      <ResponsiveContainer width="98%" height={400} margin="auto">
        <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="pvm" />
            <YAxis />
            <Bar dataKey="pv3_temp" name="lämpötila 3pv" fill="#a3d8ff" />
            <Bar dataKey="pv10_temp" name="lämpötila 10pv" fill="#ffb74d" />
            <Line dataKey="pv3_rain" name="sade 3pv" stroke="#a3d8ff" />
            <Line dataKey="pv10_rain" name="sade 10pv" stroke="#ffb74d" />
            <Area dataKey="pv3_cloud" name="pilvisyys 3pv" yAxisId="right" fill="#a3d8ff" opacity={0.5} />
            <Area dataKey="pv10_cloud" name="pilvisyys 10pv" yAxisId="right" fill="#ffb74d" opacity={0.5} />
            <Tooltip formatter={(value, name) => {
                if (name.includes('lämpö')) return [`${value.toFixed(2)} °C`, name]
                if (name.includes('sade')) return [`${value.toFixed(2)} mm`, name]
                if (name.includes('pilvi')) return [`${value.toFixed(0)} %`, name]
            return [value, name]
            }} />
        </ComposedChart>
      </ResponsiveContainer>
    )
}

export { MyChartTemp, MyChartRain, MyChartCloud, MixedChart }
