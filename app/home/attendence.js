import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import moment from 'moment'; 
import { AntDesign } from '@expo/vector-icons'; 
import authfetch from "./authfetch";

const Attendance = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const formattedDate = currentDate.format("MMMM, YYYY");
  const [monthc, yearc] = formattedDate.split(", ");
  const monthnumber = moment(monthc, 'MMMM').month() + 1;
  const [month, setMonth] = useState(monthnumber);
  const [year, setYear] = useState(yearc);
  const [total, setTotal] = useState();
  const [status, setStatus] = useState([]);

  const MyFlatList = ({ data }) => {
    const renderItem = ({ item }) => {
      const textColor = item.status === 'absent' || item.status === 'holiday' ? 'red' : 'green';
      return(
      <View style={styles.itemContainer}>
       <Text style={[styles.itemText, { color: textColor }]}>{item.status} - {item.count}</Text>
      </View>
      )
    };
  
    return (
      <FlatList
        data={data} 
        renderItem={renderItem} 
      />
    );
  };
  
  
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
  
    const fetchAttendance = async () => {
      try {
        const response = await authfetch.get("/attendence-report",{params:{
         date:formatDate(currentDate)
        }});
        const result = response.data.report[0]; 
        if(!result){
          setTotal(0)
          setStatus([]);
        }
        else{
        const { statuses, total } = result; 
        setTotal(total);
        setStatus([...statuses]);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchAttendance();
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
      {status.length>0 &&(
        <View>
      <Text style={styles.totalText}>Total members attendance marked: <Text style={styles.totalCount}>{total}</Text></Text>
      <MyFlatList data={status}/>
      </View>
      )
     }
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
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  totalText: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 34,
    color: 'orange',
  },
  totalCount: {
    fontWeight: 'bold',
    color: '#333',
  },
  itemContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize:28 ,
    color: '#333',
  },
});
