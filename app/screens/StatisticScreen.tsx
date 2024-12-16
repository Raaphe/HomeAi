import { observer } from "mobx-react-lite"
import React, { useEffect, useState,FC } from "react"
import { View, Text, ActivityIndicator, StyleSheet, Dimensions,ViewStyle } from "react-native"
import { GestureHandlerRootView, PanGestureHandler, ScrollView } from "react-native-gesture-handler"
import * as api from "../api/generated-client/api"
import {
  GraphBar as GraphPriceBySize,
  GraphBar as GraphPriceByBed,
  GraphLine,
} from "@/components/Graphs"
import {Screen } from "../components"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
// Type pour les données de chaque maison
type Data = {
  brokered_by: string
  status: string
  price: number
  bed: number
  bath: number
  acre_lot: number
  street: string
  city: string
  state: string
  zip_code: string
  house_size: number
  prev_sold_date: number
}


export const StatisticScreen: FC<any> = observer(function StatisticScreen(_props) {
  const screenWidth = Dimensions.get("window").width
  const [priceBySize, setPriceBySize] = useState<Data[] | any>()
  const [avgPriceByBed, setAvgPriceByBed] = useState<Data[] | any>()
  const [salesByYear, setSalesByYear] = useState<Data[] | any>()
  const [loading, setLoading] = useState<boolean>(true)
  const [currentIndexSize, setCurrentIndexSize] = useState<number>(0)
  const [currentIndexBed, setCurrentIndexBed] = useState<number>(0)
  const [currentIndexYear, setCurrentIndexYear] = useState<number>(0)

  //--------------------------------------------------------------------------

  const simulatedData = [
    { house_size: 1000, price: 250000, bed: 2, averagePrice: 200000, year: 2020, count: 5 },
    { house_size: 1500, price: 350000, bed: 3, averagePrice: 280000, year: 2021, count: 7 },
    { house_size: 1200, price: 275000, bed: 2, averagePrice: 225000, year: 2022, count: 6 },
    { house_size: 1800, price: 450000, bed: 4, averagePrice: 350000, year: 2021, count: 8 },
    { house_size: 1100, price: 270000, bed: 2, averagePrice: 220000, year: 2023, count: 9 },
  ];

  const handleSwipe = (
    direction: "left" | "right",
    setIndex: React.Dispatch<React.SetStateAction<number>>,
    dataLength: number,
  ) => {
    setIndex((prevIndex) => {
      if (direction === "left") {
        return Math.max(prevIndex - 5, 0)
      } else {
        return Math.min(prevIndex + 5, dataLength - 5)
      }
    })
  }

  const setChartDataSize = () => {
    if (!priceBySize) return { labels: [], datasets: [] }
    const currentData = priceBySize.slice(currentIndexSize, currentIndexSize + 5)
    return {
      labels: simulatedData.map((e) => `${e.house_size} ft²`),
      datasets: [
        {
          data: simulatedData.map((e) => e.price),
        },
      ],
    }
  }

  const setChartDataBed = () => {
    if (!avgPriceByBed) return { labels: [], datasets: [] }

    const currentData = avgPriceByBed.slice(currentIndexBed, currentIndexBed + 5)

    return {
      labels: simulatedData.map((e: any) => `${e.bed} bed`),
      datasets: [
        {
          data: simulatedData.map((e: any) => e.averagePrice),
        },
      ],
    }
  }
  const setChartDataYear = () => {
    if (!salesByYear) return { labels: [], datasets: [] }

    const currentData = salesByYear.slice(currentIndexYear, currentIndexYear + 5)

    return {
      labels: simulatedData.map((e: any) => `${e.year} year`),
      datasets: [
        {
          data: simulatedData.map((e: any) => e.count),
        },
      ],
    }
  }

  const fetchData = async () => {
    try {
      // const client = new api.HistoricDataApi()
      // const resPriceBySize = await client.historyPropertiesCountBySizeGet()
      // const resAvgPriceByBed = await client.historyAveragePriceByBedroomsGet()
      // const resSalesByYear = await client.historySalesByYearGet()

      setPriceBySize("resPriceBySize")
      setAvgPriceByBed("resAvgPriceByBed")
      setSalesByYear("resSalesByYear")

      setLoading(false)
    } catch (error) {
      console.error("Erreur lors du chargement ou des données :", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  return (
    <Screen preset="auto" contentContainerStyle={themed($screenContentContainer)}>
      <GestureHandlerRootView style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <Text style={styles.title}>Prix des maisons par taille en ft²</Text>
            <PanGestureHandler
              onGestureEvent={(event) => {
                const { translationX } = event.nativeEvent
                if (translationX > 100) {
                  handleSwipe("right", setCurrentIndexSize, priceBySize?.length ?? 0)
                } else if (translationX < -100) {
                  handleSwipe("left", setCurrentIndexSize, priceBySize?.length ?? 0)
                }
              }}
            >
              <View style={styles.graphContainer}>
                <GraphPriceBySize data={setChartDataSize()} screenWidth={screenWidth} />
              </View>
            </PanGestureHandler>

            <Text style={styles.title}>Moyenne du prix des maisons par nombre de chambres</Text>
            <PanGestureHandler
              onGestureEvent={(event) => {
                const { translationX } = event.nativeEvent
                if (translationX > 100) {
                  handleSwipe("right", setCurrentIndexBed, avgPriceByBed?.length ?? 0)
                } else if (translationX < -100) {
                  handleSwipe("left", setCurrentIndexBed, avgPriceByBed?.length ?? 0)
                }
              }}
            >
              <View style={styles.graphContainer}>
                <GraphPriceByBed data={setChartDataBed()} screenWidth={screenWidth} />
              </View>
            </PanGestureHandler>

            <Text style={styles.title}>Moyenne du prix des maisons par ans</Text>
            <PanGestureHandler
              onGestureEvent={(event) => {
                const { translationX } = event.nativeEvent
                if (translationX > 100) {
                  handleSwipe("right", setCurrentIndexYear, salesByYear?.length ?? 0)
                } else if (translationX < -100) {
                  handleSwipe("left", setCurrentIndexYear, salesByYear?.length ?? 0)
                }
              }}
            >
              <View style={styles.graphContainer}>
                <GraphLine data={setChartDataYear()} screenWidth={screenWidth} />
              </View>
            </PanGestureHandler>
          </ScrollView>
        )}
      </GestureHandlerRootView>
    </Screen>
  )
})

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  container: {
    backgroundColor: "#f5f5f5",
    flex: 1,
    padding: 20,
  },
  scrollViewContainer: {
    alignItems: "center",
  },
  title: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  // eslint-disable-next-line react-native/sort-styles
  graphContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
})

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.xxl
})

