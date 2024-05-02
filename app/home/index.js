import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import authfetch from "./authfetch";
const Index = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <LinearGradient colors={["#4CAF50", "#2196F3"]} style={styles.gradient}>
        <Text style={styles.title}>Employee Management System</Text>
      </LinearGradient>

      <View style={styles.section}>
        <View style={styles.subSection}>
          <Pressable onPress={()=>{router.push("/home/employees")}}>
            <Text style={styles.listItem}>Employee List</Text>
          </Pressable>
          <Pressable onPress={()=>{router.push("/home/markattendence")}}>   
            <Text style={styles.listItem}>Mark Attendance</Text>
          </Pressable>
        </View>
        <Pressable onPress={()=>{router.push("/home/summary")}}>
          <Text style={styles.sectionItem}>Summary Report</Text>
        </Pressable>
        <Pressable onPress={()=>{router.push("/home/attendence")}}>
          <Text style={styles.sectionItem}>Attendance Report</Text>
        </Pressable>
        <Pressable onPress={()=>{router.push("/home/allgenerate")}}>
          <Text style={styles.sectionItem}>All Generate Report</Text>
        </Pressable>
        <Pressable>
          <Text style={styles.sectionItem}>Overtime Employees</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <View style={styles.card}>
          <Feather name="bar-chart" size={24} color="#FFF" />
          <Text style={styles.cardText}>Attendance Criteria</Text>
        </View>

        <View style={[styles.card, {marginTop: 10}]}>
          <Feather name="bar-chart" size={24} color="#FFF" />
          <Text style={styles.cardText}>Increased Workflow</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.card}>
          <MaterialCommunityIcons name="guy-fawkes-mask" size={24} color="#FFF" />
          <Text style={styles.cardText}>Cost Savings</Text>
        </View>

        <View style={styles.card}>
          <Feather name="bar-chart" size={24} color="#FFF" />
          <Text style={styles.cardText}>Employee Performance</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: "#FFF",
    padding: 20
  },
  gradient: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  section: {
    marginBottom: 20,
  },
  subSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  listItem: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  sectionItem: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    backgroundColor: "#2196F3",
    textAlign: "center",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  card: {
    backgroundColor: "#2196F3",
    borderRadius: 6,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  cardText: {
    marginTop: 7,
    fontWeight: 'bold',
    color: '#FFF',
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default Index;
