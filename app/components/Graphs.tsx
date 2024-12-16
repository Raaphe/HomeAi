import { BarChart, LineChart } from "react-native-chart-kit"

type ChartData = {
  labels: string[]
  datasets: {
    data: number[]
  }[]
}
export const GraphBar = ({ data, screenWidth }: { data: ChartData; screenWidth: number }) => {
  return (
    <BarChart
      data={data}
      width={screenWidth}
      height={220}
      chartConfig={{
        backgroundGradientFrom: "gray",
        backgroundGradientTo: "blue",
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 0.2,
        barPercentage: 1,
        propsForLabels: {
          fontSize: 10,
        },
      }}
      style={{
        marginVertical: 8,
        padding: 15,
        borderRadius: 20,
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
      height={220}
      chartConfig={{
        backgroundGradientFrom: "gray",
        backgroundGradientTo: "blue",
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      }}
    />
  )
}
