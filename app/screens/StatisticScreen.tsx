import { observer } from "mobx-react-lite";
import React, { useEffect, useState, FC } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Dimensions, ScrollView, ViewStyle } from "react-native";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import * as api from "../api/generated-client/api";
import { GraphBar as GraphPriceBySize, GraphBar as GraphPriceByBed, GraphLine } from "@/components/Graphs";
import { Screen } from "../components";
import { useAppTheme } from "@/utils/useAppTheme";
import type { ThemedStyle } from "@/theme";

type Data = {
  brokered_by: string;
  status: string;
  price: number;
  bed: number;
  bath: number;
  acre_lot: number;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  house_size: number;
  prev_sold_date: number;
};

export const StatisticScreen: FC<any> = observer(function StatisticScreen(_props) {
  const screenWidth = Dimensions.get("window").width;
  const [priceBySize, setPriceBySize] = useState<Data[] | any>();
  const [avgPriceByBed, setAvgPriceByBed] = useState<Data[] | any>();
  const [avgPriceByState, setAvgPriceByState] = useState<Data[] | any>();
  const [salesByYear, setSalesByYear] = useState<Data[] | any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndexSize, setCurrentIndexSize] = useState<number>(0);
  const [currentIndexBed, setCurrentIndexBed] = useState<number>(0);
  const [currentIndexState, setCurrentIndexState] = useState<number>(0);
  const [currentIndexYear, setCurrentIndexYear] = useState<number>(0);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    }
    return num.toString();
  };

  const handleSwipe = (
    direction: "left" | "right",
    setIndex: React.Dispatch<React.SetStateAction<number>>,
    dataLength: number,
  ) => {
    setIndex((prevIndex) => {
      if (direction === "left") {
        return Math.max(prevIndex - 5, 0);
      } else {
        return Math.min(prevIndex + 5, dataLength - 5);
      }
    });
  };

  const setChartDataSize = () => {
    if (!priceBySize) return { labels: [], datasets: [] };
    const currentData = priceBySize.slice(currentIndexSize, currentIndexSize + 3);
    
    return {
      labels: currentData.map((e: any) => `${formatNumber(e.min)} - ${formatNumber(e.max)} h`),
      datasets: [
        {
          data: currentData.map((e: any) => e.count),
        },
      ],
    };
  };

  const setChartDataBed = () => {
    if (!avgPriceByBed) return { labels: [], datasets: [] };
    const currentData = avgPriceByBed.slice(currentIndexBed, currentIndexBed + 5);
    return {
      labels: currentData.map((e: any) => `${e.bed} bed`),
      datasets: [
        {
          data: currentData.map((e: any) => e.averagePrice),
        },
      ],
    };
  };

  const setChartDataYear = () => {
    if (!salesByYear) return { labels: [], datasets: [] };
    const currentData = salesByYear.slice(currentIndexYear, currentIndexYear + 5);
    return {
      labels: currentData.map((e: any) => `${e.year} year`),
      datasets: [
        {
          data: currentData.map((e: any) => e.count),
        },
      ],
    };
  };

  const setChartDataState = () => {
    if (!avgPriceByState) return { labels: [], datasets: [] };
    const currentData = avgPriceByState.slice(currentIndexState, currentIndexState + 5);
    
    return {
      labels: currentData.map((e: any) => `${e.state}`),
      datasets: [
        {
          data: currentData.map((e: any) => e.averagePrice),
        },
      ],
    };
  };

  const fetchData = async () => {
    try {
      const client = new api.HistoricDataApi();
      const resPriceBySize = await client.historyPropertiesCountBySizeGet();
      const resAvgPriceByBed = await client.historyAveragePriceByBedroomsGet();
      const restAvgPriceByState = await client.historyAveragePriceByStateGet();
      const resSalesByYear = await client.historySalesByYearGet();

      setPriceBySize(resPriceBySize.data);
      setAvgPriceByBed(resAvgPriceByBed.data);
      setAvgPriceByState(restAvgPriceByState.data);
      setSalesByYear(resSalesByYear.data);

      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const {
    themed,
    theme,
  } = useAppTheme();

  return (
    <Screen preset="scroll" contentContainerStyle={themed($screenContentContainer)}>
      <GestureHandlerRootView style={[styles.container, {backgroundColor: theme.colors.background}]}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFD700" />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <Text style={[styles.title, {color: theme.colors.text}]}>House prices per square ft²</Text>
            <PanGestureHandler
              onGestureEvent={(event) => {
                const { translationX } = event.nativeEvent;
                if (translationX > 100) {
                  handleSwipe("right", setCurrentIndexSize, priceBySize?.length ?? 0);
                } else if (translationX < -100) {
                  handleSwipe("left", setCurrentIndexSize, priceBySize?.length ?? 0);
                }
              }}
            >
              <View>
                <GraphPriceBySize data={setChartDataSize()} screenWidth={screenWidth} />
              </View>
            </PanGestureHandler>

            <Text style={[styles.title, {color: theme.colors.text}]}>Average House prices by number of bedrooms</Text>
            <PanGestureHandler
              onGestureEvent={(event) => {
                const { translationX } = event.nativeEvent;
                if (translationX > 100) {
                  handleSwipe("right", setCurrentIndexBed, avgPriceByBed?.length ?? 0);
                } else if (translationX < -100) {
                  handleSwipe("left", setCurrentIndexBed, avgPriceByBed?.length ?? 0);
                }
              }}
            >
              <View>
                <GraphPriceByBed data={setChartDataBed()} screenWidth={screenWidth} />
              </View>
            </PanGestureHandler>

            <Text style={[styles.title, {color: theme.colors.text}]}>Average house price by year</Text>
            <PanGestureHandler
              onGestureEvent={(event) => {
                const { translationX } = event.nativeEvent;
                if (translationX > 100) {
                  handleSwipe("right", setCurrentIndexYear, salesByYear?.length ?? 0);
                } else if (translationX < -100) {
                  handleSwipe("left", setCurrentIndexYear, salesByYear?.length ?? 0);
                }
              }}
            >
              <View >
                <GraphLine data={setChartDataYear()} screenWidth={screenWidth} isbezier={false} />
              </View>
            </PanGestureHandler>

            <Text style={[styles.title, { color: theme.colors.text }]}>
              Average house price by state
            </Text>
            <PanGestureHandler
              onGestureEvent={(event) => {
                const { translationX } = event.nativeEvent;
                if (translationX > 100) {
                  handleSwipe("right", setCurrentIndexState, salesByYear?.length ?? 0);
                } else if (translationX < -100) {
                  handleSwipe("left", setCurrentIndexState, salesByYear?.length ?? 0);
                }
              }}
            >
              <View >
                <GraphLine data={setChartDataState()} screenWidth={screenWidth} isbezier={true} />
              </View>
            </PanGestureHandler>
          </ScrollView>
        )}
      </GestureHandlerRootView>
    </Screen>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  scrollViewContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
});

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.xxl,
});
