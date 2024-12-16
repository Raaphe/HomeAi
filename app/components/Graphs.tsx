import { BarChart, LineChart } from "react-native-chart-kit"

type ChartData = {
  labels: string[]
  datasets: {
    data: number[]
  }[]
}
const chartConfig = {
    backgroundGradientFrom: "#000",
    backgroundGradientTo: "#333", 
    color: (opacity = 1) => `rgba(255, 255, 0, ${opacity})`,
    strokeWidth: 0.2,
    barPercentage: 1,
    propsForLabels: {
      fontSize: 10,
      color: "#FFD700",
    },
  }
export const GraphBar = ({ data, screenWidth }: { data: ChartData; screenWidth: number }) => {
  return (
    <BarChart
      data={data}
      width={screenWidth}
      height={520}
      chartConfig={chartConfig}
      style={{
        padding: 15,
        paddingLeft: '10%',
      }}
      yAxisLabel="$"
      yAxisSuffix=""
      yAxisInterval={1}
      fromZero={false}
    />
  )
}

export const GraphLine = ({ data, screenWidth }: { data: ChartData; screenWidth: number }) => {
  return (
    <LineChart
      data={data}
      width={screenWidth}
      height={520}
      chartConfig={chartConfig}
    />
  )
}
