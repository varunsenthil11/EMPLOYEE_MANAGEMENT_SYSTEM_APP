import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import moment from "moment";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import authfetch from "./authfetch";

const User = () => {
  const params = useLocalSearchParams();
  const [attendanceStatus, setAttendanceStatus] = useState("present");
  const [currentDate, setCurrentDate] = useState(moment(params.date));

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

  const submitAttendance = async () => {
    try {
      const attendanceData = {
        employeeId: params?.id,
        employeeName: params?.name,
        date: currentDate.format("MMMM D, YYYY"),
        status: attendanceStatus,
      };
      const response = await authfetch.post("/attendance", attendanceData);

      if (response.status === 200) {
        Alert.alert(`Attendance submitted successfully for ${params?.name}`);
      }
    } catch (error) {
      console.log("error submitting attendance", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateNavigationContainer}>
        <AntDesign onPress={goToPrevDay} name="left" size={24} color="black" />
        <Text>{formatDate(currentDate)}</Text>
        <AntDesign onPress={goToNextDay} name="right" size={24} color="black" />
      </View>

      <Pressable style={[styles.infoContainer, styles.card]}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{params?.name.charAt(0)}</Text>
        </View>
        <View style={styles.infoTextContainer}>
          <Text style={styles.nameText}>{params?.name}</Text>
          <Text style={styles.designationText}>
            {params?.designation} ({params?.id})
          </Text>
        </View>
      </Pressable>

      <Text style={styles.basicPayText}>Basic Pay: {params?.salary}</Text>

      <View style={styles.attendanceContainer}>
        <Text style={styles.attendanceHeaderText}>ATTENDANCE</Text>
        <View style={styles.attendanceOptionsContainer}>
          <AttendanceOptionButton
            status="present"
            onPress={() => setAttendanceStatus("present")}
            selected={attendanceStatus === "present"}
            text="Present"
          />
          <AttendanceOptionButton
            status="absent"
            onPress={() => setAttendanceStatus("absent")}
            selected={attendanceStatus === "absent"}
            text="Absent"
          />
          <AttendanceOptionButton
            status="halfday"
            onPress={() => setAttendanceStatus("halfday")}
            selected={attendanceStatus === "halfday"}
            text="Half Day"
          />
          <AttendanceOptionButton
            status="holiday"
            onPress={() => setAttendanceStatus("holiday")}
            selected={attendanceStatus === "holiday"}
            text="Holiday"
          />
        </View>
      </View>

      <View style={styles.additionalInputsContainer}>
        <TextInput style={styles.input} placeholder="Advance / Loans" />
        <TextInput style={styles.input} placeholder="Extra Bonus" />
      </View>

      <Pressable onPress={submitAttendance} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit Attendance</Text>
      </Pressable>
    </View>
  );
};

const AttendanceOptionButton = ({ onPress, selected, text }) => {
  return (
    <Pressable onPress={onPress} style={[styles.attendanceOptionButton, selected && styles.selected]}>
      {selected ? <FontAwesome5 name="dot-circle" size={24} color="black" /> : <Entypo name="circle" size={24} color="black" />}
      <Text>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 12,
  },
  dateNavigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  card: {
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#4b6cb7",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 16,
  },
  infoTextContainer: {
    marginLeft: 10,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  designationText: {
    marginTop: 5,
    color: "gray",
  },
  basicPayText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  attendanceContainer: {
    marginBottom: 10,
  },
  attendanceHeaderText: {
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 3,
    marginBottom: 7,
  },
  attendanceOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  attendanceOptionButton: {
    backgroundColor: "#C4E0E5",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    marginBottom: 10,
    flex: 1,
  },
  selected: {
    backgroundColor: "#4b6cb7",
  },
  additionalInputsContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    padding: 10,
    marginRight: 10,
  },
  submitButton: {
    padding: 15,
    backgroundColor: "#00c6ff",
    width: 200,
    alignSelf: "center",
    borderRadius: 6,
  },
  submitButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "500",
  },
});

export default User;
