import React, { useState, useEffect, } from 'react';
import { View, Text,  StyleSheet,  Dimensions, ScrollView} from 'react-native';
import TruffleLogo from "../assets/logo/TruffleLogo";

const CreditView = () => {
  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.Texts}>Credit</Text>
      </View>

      <View style={{justifyContent:'center', alignItems:'center', }}>
      <View style={{flexDirection:'row', gap:10}}>
        <Text style={{fontSize:40, color:'black'}}>Truffle</Text>
        <TruffleLogo marginTop={5} width={50} height={50}/>
      </View>
      
      <View style={{marginTop:20}}>
        <Text style={styles.HeaderText}>Project Leader</Text>
          <View style={styles.context}>
            <Text style={styles.contextText}>Brandon Kim   | 김상현</Text>
          </View>
      </View>

      <View style={{marginTop:20}}>
        <Text style={styles.HeaderText}>Front-end Developer Head</Text>
          <View style={styles.context}>
            <Text style={styles.contextText}>Dakyung Kang   | 강다경</Text>
          </View>
      </View>

      <View style={{marginTop:20}}>
        <Text style={styles.HeaderText}>Back-end Developer Head</Text>
          <View style={styles.context}>
            <Text style={styles.contextText}>Hayoung Im   | 임하영</Text>
          </View>
      </View>

      <View style={{marginTop:20}}>
        <Text style={styles.HeaderText}>Front-end Developers</Text>
          <View style={[styles.context, {height:100}]}>
            <Text style={styles.contextText}>YongHoon Kim   | 김용훈</Text>
            <Text style={styles.contextText}>Gyowon Song   | 송교원</Text>
          </View>
      </View>

      <View style={{marginTop:20}}>
        <Text style={styles.HeaderText}>Back-end Developers</Text>
          <View style={[styles.context, {height:100}]}>
            <Text style={styles.contextText}>Hongku Bae   | 배홍구</Text>
            <Text style={styles.contextText}>Brandon Kim   | 김상현</Text>
          </View>
      </View>

      <View style={{marginTop:20}}>
        <Text style={styles.HeaderText}>Designers</Text>
          <View style={[styles.context, {height:100}]}>
            <Text style={styles.contextText}>Jiwon Lee   | 이지원</Text>
            <Text style={styles.contextText}>Yuri Lee   | 이유리</Text>
          </View>
      </View>

      <View style={{marginTop:20, marginBottom:40}}>
        <Text style={styles.HeaderText}>Marketing</Text>
          <View style={[styles.context, {height:100}]}>
            <Text style={styles.contextText}>Dawon Kyoung   | 경다원</Text>
            <Text style={styles.contextText}>Jin Heo   | 허진</Text>
          </View>
      </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height:Dimensions.get('window').height,
    backgroundColor: '#F8F9FA',
  },
  Texts: {
    color: '#474646',
    //font-family: NanumGothic,
    fontSize: 24,
    marginLeft: 22,
    marginTop: 20,
  },
  context:{
    width: Dimensions.get('window').width-60,
    height:40,
    backgroundColor: 'white',
    borderRadius:8,
    marginTop:5
  },
  HeaderText:{
    fontSize:16,
    fontWeight:'bold'
  },
  contextText:{
    fontSize:16,
    padding:8,
  }
})

export default CreditView;