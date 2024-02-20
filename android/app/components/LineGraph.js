import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import { Dropdown } from 'react-native-element-dropdown';
import moment from 'moment';
import firestore from "@react-native-firebase/firestore";

const monthlyLabels = ['일', '월', '화', '수', '목', '금', '토'];

const DropdownData = [
  { label: '최근 1주', value: '1' },
  { label: '최근 3개월', value: '3' },
  { label: '최근 6개월', value: '6' },
  { label: '최근 1년', value: '12' },
];

const LineGraph = () => {
  const [value, setValue] = useState(null);
  const [data1, setData1] = useState(null);
  const [data3, setData3] = useState(null);
  const [data6, setData6] = useState(null);
  const [data12, setData12] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = 'xxvkRzKqFcWLVx4hWCM8GgQf1hE3';
        const userRef = firestore().collection('users').doc(userId);
        const snapshot = await userRef.get();
        if (!snapshot.exists) {
          throw new Error("No monthly expenses data found");
        }
        const userData = snapshot.data();
        const currentYear = moment().year();
        const currentMonth = moment().month() + 1;
        const targetYear = currentMonth === 1 ? currentYear - 1 : currentYear;
        const targetMonth = currentMonth === 1 ? 12 : currentMonth - 1;

        // 최근 3개월 데이터 가져오기
        const data3Labels = [];
        const data3Values = [];
        for (let i = 0; i < 3; i++) {
          const month = currentMonth - i  + (currentMonth - i <= 0 ? 12 : 0);
          const year = currentYear - (currentMonth - i <= 0 ? 1 : 0);
          const label = `${year}-${String(month).padStart(2, '0')}`;
          data3Labels.push(label.split('-')[1]);
          const eatOut = userData.eatOut[label] || 0;
          const shopping = userData.shopping[label] || 0;
          const delivery = userData.delivery[label] || 0;
          const totalExpense = eatOut + shopping + delivery;

          data3Values.push(totalExpense);
        }
        setData3({
          labels: data3Labels.reverse(),
          datasets: [
            {
              data: data3Values.reverse(),
              color: (opacity = 1) => `rgba(254, 166, 85, ${opacity})`,
              strokeWidth: 3
            }
          ]
        });

        // 최근 6개월 데이터 가져오기
        const data6Labels = [];
        const data6Values = [];
        for (let i = 0; i < 6; i++) {
          const month = currentMonth - i + (currentMonth - i <= 0 ? 12 : 0);
          const year = currentYear - (currentMonth - i <= 0 ? 1 : 0);
          const label = `${year}-${String(month).padStart(2, '0')}`;
          data6Labels.push(label.split('-')[1]);
          const monthData = userData[label];
          const eatOut = userData.eatOut[label] || 0;
          const shopping = userData.shopping[label] || 0;
          const delivery = userData.delivery[label] || 0;
          const totalExpense = eatOut + shopping + delivery;
          data6Values.push(totalExpense);
        }
        setData6({
          labels: data6Labels.reverse(),
          datasets: [
            {
              data: data6Values.reverse(),
              color: (opacity = 1) => `rgba(254, 166, 85, ${opacity})`,
              strokeWidth: 3
            }
          ]
        });

        // 최근 1년 데이터 가져오기
        const data12Labels = [];
        const data12Values = [];
        for (let i = 0; i < 12; i++) {
          const month = currentMonth - i + (currentMonth - i <= 0 ? 12 : 0);
          const year = currentYear - (currentMonth - i <= 0 ? 1 : 0);
          const label = `${year}-${String(month).padStart(2, '0')}`;
          data12Labels.push(label.split('-')[1]);
          const monthData = userData[label];
          const eatOut = userData.eatOut[label] || 0;
          const shopping = userData.shopping[label] || 0;
          const delivery = userData.delivery[label] || 0;
          const totalExpense = eatOut + shopping + delivery;
          data12Values.push(totalExpense);
        }
        setData12({
          labels: data12Labels.reverse(),
          datasets: [
            {
              data: data12Values.reverse(),
              color: (opacity = 1) => `rgba(254, 166, 85, ${opacity})`,
              strokeWidth: 3
            }
          ]
        });

        const startDate = moment().startOf('isoWeek'); // 이번 주 시작일
        const endDate = moment().endOf('isoWeek'); // 이번 주 종료일
        const days = [];
        let currentDate = startDate;
        while (currentDate <= endDate) {
          const dateStr = currentDate.format('YYYY-MM-DD');
          const dailyData = await fetchDailyData(userId, dateStr);
          days.push(dailyData);
          currentDate = currentDate.clone().add(1, 'days');
        }
        setData1({
          labels: monthlyLabels,
          datasets: [
            {
              data: days,
              color: (opacity = 1) => `rgba(254, 166, 85, ${opacity})`,
              strokeWidth: 3
            }
          ]
        });

      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    fetchDailyData();
  }, []);

  const fetchDailyData = async (userId, dateStr) => {
    const docRef = firestore().collection(userId).doc(dateStr);
    const doc = await docRef.get();
    if (doc.exists) {
      return doc.data().amount || 0;
    } else {
      return 0;
    }
  };

  const renderDropdown = () => {
    switch (value) {
      case '1':
        return data1 ? 
        <ScrollView horizontal={true}>
        <LineChart data={data1} width={380} height={220} withVerticalLines={false} chartConfig={chartConfig} bezier />
        </ScrollView>
        : null;
      case '3':
        return data3 ?
        <ScrollView horizontal={true}>
          <LineChart data={data3} width={450} height={220} withVerticalLines={false} chartConfig={chartConfig} bezier />
          </ScrollView> : null;
      case '6':
        return data6 ?
        <ScrollView horizontal={true}>
          <LineChart data={data6} width={450} height={220} withVerticalLines={false} chartConfig={chartConfig} bezier />
          </ScrollView> : null;
      case '12':
        return data12 ?
        <ScrollView horizontal={true}>
          <LineChart data={data12} width={450} height={220} withVerticalLines={false} chartConfig={chartConfig} bezier />
          </ScrollView> : null;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row',}}>
        <View style={styles.dropdown_container}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={DropdownData}
            maxHeight={200}
            labelField="label"
            valueField="value"
            placeholder="최근 1주"
            value={value}
            onChange={(item) => {
              setValue(item.value);
            }}
          />
        </View>
      </View>
      {renderDropdown()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width*0.9,
    height: Dimensions.get('window').height * 0.35,
    backgroundColor: 'white',
    padding: 10,
    margin: 20,
    marginTop: 10,
    borderColor: 'black',
    borderRadius: 12,
  },

  Texts: {
    color: '#838383',
    fontSize: 12,
    marginLeft: 10,
  },

  dropdown_container: {
    marginLeft: 210,
    width: 130,
    height: 30,
    zIndex: 1000,
  },

  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
});

const chartConfig = {
  backgroundGradientFrom: "white",
  backgroundGradientFromOpacity: 1,
  backgroundGradientTo: "white",
  backgroundGradientToOpacity: 1,
  color: (opacity = 1) => `rgba(55, 55, 55, ${opacity})`,
  strokeWidth: 3,
  barPercentage: 11,
  useShadowColorFromDataset: true,
};

export default LineGraph;