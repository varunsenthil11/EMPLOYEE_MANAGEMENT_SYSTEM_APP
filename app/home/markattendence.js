import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import authfetch from "./authfetch";

const markattendance = () => {
 
  const [currentDate, setCurrentDate] = useState(moment());

  const goToNextDay = () => {
    const nextDate = moment(currentDate).add(1, "days");
    setCurrentDate(nextDate);
  };

  const goToPrevDay = () => {
    const prevDate = moment(currentDate).subtract(1, "days");
    setCurrentDate(prevDate);
  };

  const formatDate = (date) => {
    return date.format("MMMM D, YYYY");
  };

  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await authfetch.get("/employees");
        setEmployees(response.data);
      } catch (error) {
        console.log("error fetching employee data", error);
      }
    };
    fetchEmployeeData();
  }, [currentDate]);
  const [attendance, setAttendance] = useState([]);
  const fetchAttendanceData = async () => {
    try {
      const response = await authfetch.get(`/attendance`, {
        params: {
          date: currentDate.format("MMMM D, YYYY"),
        },
      });
      setAttendance(response.data);
    } catch (error) {
      console.log("error fetching attendance data", error);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [currentDate]);

  const employeeWithAttendance = employees.map((employee) => {
    const attendanceRecord = attendance.find(
      (record) => record.employeeId === employee.employeeId
    );

    return {
      ...employee,
      status: attendanceRecord ? attendanceRecord.status : "", 
    };
  });
  return (
    <View style={styles.container}>
      <Pressable>
        <View style={styles.dateNavigationContainer}>
          <AntDesign
            onPress={goToPrevDay}
            name="left"
            size={24}
            color="black"
          />
          <Text>{formatDate(currentDate)}</Text>
          <AntDesign
            onPress={goToNextDay}
            name="right"
            size={24}
            color="black"
          />
        </View>

        <View style={styles.employeeContainer}>
          {employeeWithAttendance.map((item, index) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "home/user",
                  params: {
                    date:currentDate,
                    name: item.employeeName,
                    id: item.employeeId,
                    salary: item?.salary,
                    designation: item?.designation,
                  },
                })
              }
              key={index}
              style={styles.employeeItem}
            >
              <View style={styles.employeeAvatar}>
                <Text style={styles.avatarText}>
                  {item?.employeeName?.charAt(0)}
                </Text>
              </View>
              <View style={styles.employeeDetails}>
                <Text style={styles.employeeName}>
                  {item?.employeeName}
                </Text>
                <Text style={styles.designation}>
                  {item?.designation} ({item?.employeeId})
                </Text>
              </View>
              {item?.status && (
                <View style={styles.attendanceStatus}>
                  <Text style={styles.attendanceStatusText}>
                    {item.status.charAt(0)}
                  </Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </Pressable>
    </View>
  );
};

export default markattendance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  dateNavigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
    marginHorizontal: "auto",
  },
  employeeContainer: {
    marginHorizontal: 12,
  },
  employeeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  employeeAvatar: {
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
    marginLeft: 10,
  },
  designation: {
    marginTop: 5,
    color: "gray",
  },
  attendanceStatus: {
    width: 50,
    height: 50,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#FF69B4",
    alignItems: "center",
    justifyContent: "center",
  },
  attendanceStatusText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});
