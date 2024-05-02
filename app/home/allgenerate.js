import { StyleSheet, Text, View, FlatList, TouchableOpacity,ScrollView} from 'react-native';
import React, { useEffect, useState } from 'react';
import moment from 'moment'; 
import { AntDesign } from '@expo/vector-icons'; 
import authfetch from "./authfetch";

const Attendance = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [present,setpresent] = useState([])
  const [absent,setabsent] = useState([])
  const [halfday,sethalfday] = useState([])
  const[holiday,setholiday] = useState([])

  const goToNextMonth = () => {
    const nextMonth = moment(currentDate).add(1, "days");
    setCurrentDate(nextMonth);
  };

  const goToPrevMonth = () => {
    const prevMonth = moment(currentDate).subtract(1, "days");
    setCurrentDate(prevMonth);
  };

  const formatDate = (date) => {
    return date.format("MMMM D, YYYY");
  };


  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await authfetch.get("/attendence-info",{params:{date:formatDate(currentDate)}});
        if(response.data.length<=0){
            setpresent([]);
            setabsent([]);
            sethalfday([]);
            setholiday([]);
        }
        for(let i=0;i<response.data.length;i++){
         const doc = response.data[i];
         if(doc._id==="present"){
              setpresent(doc.names)
         }
         if(doc._id==="absent"){
              setabsent(doc.names)
         }
         if(doc._id==="halfday"){
              sethalfday(doc.names)
         }
         if(doc._id==="holiday"){
              setholiday(doc.names)
         }
        }
      } catch (error) {
        console.log("error fetching employee data", error);
      }
    };
    fetchEmployeeData();

  }, [currentDate]);


  return (
    <View style={styles.container}>
  <View style={styles.header}>
    <TouchableOpacity onPress={goToPrevMonth}>
      <AntDesign name="left" size={24} color="#333" />
    </TouchableOpacity>
    <Text style={styles.headerText}>{formatDate(currentDate)}</Text>
    <TouchableOpacity onPress={goToNextMonth}>
      <AntDesign name="right" size={24} color="#333" />
    </TouchableOpacity>
  </View> 

  <View style={styles.categoryContainer}>
    {present.length>0&&(<View>
        <Text style={styles.categoryTitle}>PRESENT</Text>
    {present.map((item, index) => (
      <Text style={styles.listItem} key={index}>{item}</Text>
    ))}
    </View>)}
  </View>

  <View style={styles.categoryContainer}>
    {absent.length>0&&(<View>
        <Text style={styles.categoryTitle}>ABSENT</Text>
    {absent.map((item, index) => (
      <Text style={styles.listItem} key={index}>{item}</Text>
    ))}
    </View>)}
  </View>

  <View style={styles.categoryContainer}>
    {halfday.length>0&&(<View>
        <Text style={styles.categoryTitle}>HALF DAY</Text>
    {halfday.map((item, index) => (
      <Text style={styles.listItem} key={index}>{item}</Text>
    ))}
    </View>)}
  </View>

  <View style={styles.categoryContainer}>
    {holiday.length>0&&(<View>
        <Text style={styles.categoryTitle}>HOLIDAY</Text>
    {holiday.map((item, index) => (
      <Text style={styles.listItem} key={index}>{item}</Text>
    ))}
    </View>)}
    
  </View>
</View>

  );
}

export default Attendance;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
    },
    categoryContainer: {
      marginBottom: 20,
    },
    categoryTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
    },
    listItem: {
      fontSize: 16,
      marginBottom: 5,
      color: '#555',
      backgroundColor: '#f0f0f0',
      padding: 10,
      borderRadius: 5,
    },
  });
  