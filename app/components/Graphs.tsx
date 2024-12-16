import { BarChart, LineChart } from "react-native-chart-kit";
import { useAppTheme } from "@/utils/useAppTheme";

type ChartData = {
  labels: string[];
  datasets: {
    data: number[];
  }[];
};

export const GraphBar = ({ data, screenWidth }: { data: ChartData; screenWidth: number }) => {
  const { theme } = useAppTheme();

  const chartConfig = {
    backgroundGradientFrom: theme.colors.background,
    backgroundGradientTo: theme.colors.background,
    color: (opacity = 1) => theme.colors.text,
    strokeWidth: 0.2,
    barPercentage: 1,
    propsForLabels: {
      fontSize: 10,
      color: theme.colors.text,
    },
  };

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
  );
};

export const GraphLine = ({ data, screenWidth }: { data: ChartData; screenWidth: number }) => {
  const { theme } = useAppTheme();

  const chartConfig = {
    backgroundGradientFrom: theme.colors.background,
    backgroundGradientTo: theme.colors.background,
    color: (opacity = 1) => theme.colors.text,
    strokeWidth: 0.2,
    barPercentage: 1,
    propsForLabels: {
      fontSize: 10,
      color: theme.colors.text,
    },
  };

  return (
    <LineChart
      data={data}
      width={screenWidth}
      height={520}
      chartConfig={chartConfig}
    />
  );
};
