import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { DataTable } from "react-native-paper";
import authfetch from "./authfetch";

const Summary = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentDate, setCurrentDate] = useState(moment());
  const formattedDate = currentDate.format("MMMM, YYYY");
  const [monthc, yearc] = formattedDate.split(", ");
  const monthnumber = moment(monthc, 'MMMM').month() + 1;
  const [month, setMonth] = useState(monthnumber);
  const [year, setYear] = useState(yearc);

  const goToNextMonth = () => {
    const nextMonth = moment(currentDate).add(1, "months");
    const nextMonthNumber = nextMonth.month() + 1;
    setMonth(nextMonthNumber);
    setCurrentDate(nextMonth);
  };

  const goToPrevMonth = () => {
    const prevMonth = moment(currentDate).subtract(1, "months");
    const prevMonthNumber = prevMonth.month() + 1;
    setMonth(prevMonthNumber);
    setCurrentDate(prevMonth);
  };

  const formatDate = (date) => {
    return date.format("MMMM, YYYY");
  };

  const fetchAttendanceReport = async () => {
    try {
      const response = await authfetch.get(
        `/attendance-report-all-employees`,
        {
          params: {
            month: month,
            year: year,
          },
        }
      );

      setAttendanceData(response.data.report);
    } catch (error) {
      console.log("Error fetching attendance");
    }
  };

  useEffect(() => {
    fetchAttendanceReport();
  }, [currentDate]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <AntDesign
          onPress={goToPrevMonth}
          name="left"
          size={24}
          color="black"
        />
        <Text style={styles.headerText}>{formatDate(currentDate)}</Text>
        <AntDesign
          onPress={goToNextMonth}
          name="right"
          size={24}
          color="black"
        />
      </View>

      <View style={styles.content}>
        {attendanceData?.map((item, index) => (
          <View key={index} style={styles.employeeContainer}>
            <View style={styles.employeeInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item?.name?.charAt(0)}</Text>
              </View>
              <View>
                <Text style={styles.employeeName}>{item?.name}</Text>
                <Text style={styles.employeeDetails}>
                  {item?.designation} ({item?.employeeId})
                </Text>
              </View>
            </View>

            <View style={styles.dataTableContainer}>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>P</DataTable.Title>
                  <DataTable.Title>A</DataTable.Title>
                  <DataTable.Title>HD</DataTable.Title>
                  <DataTable.Title>H</DataTable.Title>
                  <DataTable.Title>NW</DataTable.Title>
                </DataTable.Header>
                <DataTable.Row>
                  <DataTable.Cell>{item?.present}</DataTable.Cell>
                  <DataTable.Cell>{item?.absent}</DataTable.Cell>
                  <DataTable.Cell>{item?.halfday}</DataTable.Cell>
                  <DataTable.Cell>1</DataTable.Cell>
                  <DataTable.Cell>8</DataTable.Cell>
                </DataTable.Row>
              </DataTable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
  },
  content: {
    marginHorizontal: 12,
  },
  employeeContainer: {
    marginVertical: 10,
  },
  employeeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#4b6cb7",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 16,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  employeeDetails: {
    marginTop: 5,
    color: "gray",
  },
  dataTableContainer: {
    marginTop: 15,
    margin: 5,
    padding: 5,
    backgroundColor: "#A1FFCE",
    borderRadius: 5,
  },
});

export default Summary;
