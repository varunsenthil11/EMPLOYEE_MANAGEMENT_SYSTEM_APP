import { Pressable, StyleSheet, Text, View, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import SearchResults from "./SearchResults";
import authfetch from "./authfetch";
const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [input, setInput] = useState("");

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
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          onPress={() => router.back()}
          style={styles.backIcon}
          name="arrow-back"
          size={24}
          color="black"
        />
        <Pressable
          style={styles.searchContainer}
        >
          <AntDesign
            style={styles.searchIcon}
            name="search1"
            size={20}
            color="black"
          />
          <TextInput
            value={input}
            onChangeText={(text) => setInput(text)}
            style={styles.input}
            placeholder="Search"
          />
          {employees.length > 0 && (
            <View style={styles.plusIconContainer}>
              <Pressable onPress={() => router.push("/home/adddetails")}>
                <AntDesign name="pluscircle" size={30} color="#0072b1" />
              </Pressable>
            </View>
          )}
        </Pressable>
      </View>
      {employees.length > 0 ? (
        <SearchResults data={employees} input={input} setInput={setInput} />
      ) : (
        <View style={styles.noDataContainer}>
          <Text>No Data</Text>
          <Text>Press on the plus button and add your Employee</Text>
          <Pressable onPress={() => router.push("/home/adddetails")}>
            <AntDesign
              style={styles.plusIcon}
              name="pluscircle"
              size={24}
              color="black"
            />
          </Pressable>
        </View>
      )}
    </View>
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
    backgroundColor: "white",
  },
  backIcon: {
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 7,
    gap: 10,
    backgroundColor: "white",
    borderRadius: 3,
    height: 40,
    flex: 1,
  },
  searchIcon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
  },
  plusIconContainer: {
    marginLeft: 10,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  plusIcon: {
    marginTop: 30,
  },
});

export default Employees;
