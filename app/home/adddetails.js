import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import authfetch from "./authfetch";
import axios from "axios";

const AddDetails = () => {
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [dob, setDob] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [salary, setSalary] = useState("");
  const [address, setAddress] = useState("");
  const [designation, setDesignation] = useState("");

  const handleRegister = () => {
    const employeeData = {
      employeeName: name,
      employeeId: employeeId,
      designation: designation,
      phoneNumber: mobileNo,
      dateOfBirth: dob,
      joiningDate: joiningDate,
      activeEmployee: true,
      salary: salary,
      address: address,
    };

    authfetch
      .post("/addEmployee", employeeData)
      .then((response) => {
        Alert.alert(
          "Registration Successful",
          "You have been registered successfully"
        );
        setName("");
        setEmployeeId("");
        setDob("");
        setMobileNo("");
        setSalary("");
        setAddress("");
        setJoiningDate("");
        setDesignation("");
      })
      .catch((error) => {
        Alert.alert(
          "Registration Fail",
          "An error occurred during registration"
        );
        console.log("register failed", error);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add a New Employee</Text>
        <TextInput
          value={name}
          onChangeText={(text) => setName(text)}
          style={styles.input}
          placeholder="Full Name (First and last Name)"
        />
        <TextInput
          value={employeeId}
          onChangeText={(text) => setEmployeeId(text)}
          style={styles.input}
          placeholder="Employee Id"
        />
        <TextInput
          value={designation}
          onChangeText={(text) => setDesignation(text)}
          style={styles.input}
          placeholder="Designation"
        />
        <TextInput
          value={mobileNo}
          onChangeText={(text) => setMobileNo(text)}
          style={styles.input}
          placeholder="Mobile Number"
        />
        <TextInput
          value={dob}
          onChangeText={(text) => setDob(text)}
          style={styles.input}
          placeholder="Date of Birth"
        />
        <TextInput
          value={joiningDate}
          onChangeText={(text) => setJoiningDate(text)}
          style={styles.input}
          placeholder="Joining Date"
        />
        <TextInput
          value={salary}
          onChangeText={(text) => setSalary(text)}
          style={styles.input}
          placeholder="Salary"
        />
        <TextInput
          value={address}
          onChangeText={(text) => setAddress(text)}
          style={styles.input}
          placeholder="Address"
        />
        <Pressable onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Add Employee</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    padding: 10,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#ABCABA",
    padding: 10,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
  },
});

export default AddDetails;
