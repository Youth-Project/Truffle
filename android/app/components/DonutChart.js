import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import PieChart from 'react-native-pie-chart';
import TruffleLogo from "../assets/logo/TruffleLogo.svg";
import firestore from "@react-native-firebase/firestore";

const userId = 'xxvkRzKqFcWLVx4hWCM8GgQf1hE3';

function DonutChart () {
  const [userBudget, setUserBudget] = useState(0);
  const [expenses, setExpenses] = useState({
    eatOut: 0, // 외식
    shopping: 0, // 장보기
    delivery: 0, // 배달
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDoc = await firestore().collection("users").doc(userId).get();
        const userData = userDoc.data();
        setUserBudget(userData.user_budget || 0);

        const monthlyExpenseData = await fetchMonthlyExpenses();
        setExpenses(monthlyExpenseData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchMonthlyExpenses = async () => {
    try {
      const userRef = firestore().collection('users').doc(userId);
      const snapshot = await userRef.get();
      if (!snapshot.exists) {
        throw new Error("No monthly expenses data found");
      }

      const userData = snapshot.data();
      const currentMonthKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
      const currentMonthData = {
        eatOut: userData.eatOut[currentMonthKey] || 0,
        shopping: userData.shopping[currentMonthKey] || 0,
        delivery: userData.delivery[currentMonthKey] || 0,
      };

      const total = currentMonthData.eatOut + currentMonthData.shopping + currentMonthData.delivery;

      return {
        ...currentMonthData,
        total: total,
      };
    } catch (error) {
      console.error("Error fetching monthly expenses: ", error);
      return {
        eatOut: 0,
        shopping: 0,
        delivery: 0,
        total: 0,
      };
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const calculateRemainingBudget = () => {
    const total = expenses.eatOut + expenses.shopping + expenses.delivery;
    return userBudget - total;
  };

  const remainingBudget = calculateRemainingBudget();
  const totalBudget = userBudget;
  const { eatOut, shopping, delivery } = expenses;
  const extraBudget = Math.max(0, remainingBudget / totalBudget * 100); // 음수이면 0으로 설정

  const series = [
    shopping / totalBudget * 100,
    delivery / totalBudget * 100,
    eatOut / totalBudget * 100,
    extraBudget,
  ];
  const sliceColor = ['#D55A44', '#FEA655', '#FFD98E', '#ABABAB'];

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
      <TruffleLogo style={styles.logo}/>
        <PieChart
          widthAndHeight={200}
          series={series}
          sliceColor={sliceColor}
          coverRadius={0.65}
          coverFill={'white'}
        />
        {extraBudget === 0 && (
          <Text style={styles.warningText}>!예산을 초과했습니다</Text>
        )}
      </View>
      <View style={styles.legendContainer}>
        <View style={[styles.colorSlice,{backgroundColor:'#D55A44'}]}/>
        <Text>장보기</Text>
        <View style={[styles.colorSlice,{backgroundColor:'#FEA655'}]}/>
        <Text>배달</Text>
        <View style={[styles.colorSlice,{backgroundColor:'#FFD98E'}]}/>
        <Text>외식</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width*0.9,
    height:Dimensions.get('window').height *0.35,
    backgroundColor: 'white',
    padding: 10,
    margin:20,
    borderColor:'black',
    borderRadius:12,
  },
  text: {
    color: '#838383',
    fontSize: 12,
    marginLeft: 10,
  },
  chartContainer: {
    alignItems:'center',
    justifyContent:'center',
    marginTop:10,
  },
  logo:{
    position: 'absolute',
    zIndex:1,
  },
  legendContainer: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    marginTop: 10,
  },
  colorSlice:{
    height:12,
    width:12,
    marginRight:5,
    marginLeft:5
  },
  warningText: {
    color: 'red',
    fontSize: 12,
    marginTop: 2,
  }
});

export default DonutChart;