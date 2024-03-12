import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  PanResponder,
  TextInput,
  Image
} from 'react-native';
import Ingredients from "./Ingredients";

const BottomSheet = () => {

    // modal 열고 닫는 변수, 함수
    const [modalVisible, setModalVisible] = useState(false);
    const pressButton = () => {
        setModalVisible(true);
    };
    const closeModal = () => {
        closeBottomSheet.start(()=>{
            setModalVisible(false);
        })
    };
      const screenHeight = Dimensions.get("screen").height;
      const panY = useRef(new Animated.Value(screenHeight)).current;
      const translateY = panY.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [0, 0, 1],
      });
  
      const resetBottomSheet = Animated.timing(panY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
      });
  
    //   바텀시트 애니메이션
      const closeBottomSheet = Animated.timing(panY, {
          toValue: screenHeight,
          duration: 300,
          useNativeDriver: true,
      });
  
      const panResponders = useRef(PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onMoveShouldSetPanResponder: () => false,
          onPanResponderMove: (event, gestureState) => {
              panY.setValue(gestureState.dy);
          },
          onPanResponderRelease: (event, gestureState) => {
              if(gestureState.dy > 0 && gestureState.vy > 1.5) {
                  closeModal();
              }
              else {
                  resetBottomSheet.start();
              }
          }
      })).current;
  
      useEffect(()=>{
          if(modalVisible) {
              resetBottomSheet.start();
          }
      }, [modalVisible]);
  

      
    return (
        <>
    {/* 냉장고 재료추가 열기 버튼인데 아래서 끌어올리는거 안돼서 일단 만들어 놓음 */}
        <TouchableOpacity style={styles.button} onPress={pressButton}>
            <Text style={styles.addButton}>+</Text>
        </TouchableOpacity>
    {/* 냉장고 재료추가 바텀시트 */}
        <Modal
            visible={modalVisible}
            animationType={"fade"}
            transparent
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <TouchableWithoutFeedback
                    onPress={closeModal}
                >
                    <View style={styles.background} />
                </TouchableWithoutFeedback>
                <Animated.View
                    style={{ ...styles.bottomSheetContainer, transform: [{ translateY: translateY }] }}
                    {...panResponders.panHandlers}
                >
                    <View style={styles.container}> 
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <Text style={styles.title}>
                                냉장고 재료추가
                            </Text>
                            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                <Text>X</Text>
                                {/* X대신 이미지 */}
                            </TouchableOpacity>
                        </View>
                        {/* 재료 검색~재료들 */}
                        <View style={styles.foodContainer}>
                            <Ingredients/>
                        </View>
                    </View>
                </Animated.View>
            </View>
        </Modal></>
    )
}

const styles = StyleSheet.create({
    addButton:{
        width: 50,
        height: 50,
        marginBottom: 8,
        fontSize: 40,
        textAlign:'center',
        color:'white',
        display:'flex',
        justifyContent:'center',
        alignItems: 'center'
    },
    button:{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor:'#FEA655',
        display:'flex',
        justifyContent:'center'
    },
    container:{
        // backgroundColor:'pink',
        height: '100%',
        width:'100%',
        // marginTop: 100,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        // padding: 10
    },
    top:{
        display:'flex',
        flexDirection: 'row',
        marginTop: 16,
        marginLeft: 10,
    },
    title:{
        paddingTop: 16,
        paddingLeft: 10,
        fontSize: 15,
        width: 141
    },
    closeButton:{
      // marginTop: 16,
      position:'absolute',
      top: 16,
      right: 20,
      // marginLeft: 170,
      width: 38,
      height: 23,
      fontSize: 20,
      backgroundColor: '#F8F9FA',
      justifyContent: 'center',
      alignItems:'center',
      // backgroundColor:'yellow'
    },
    inputArea:{
        width:'100%',
        display:'flex',
        alignItems:'center',
        marginTop: 15,
    },
    wrapper:{
        width: 300,
        height: 48,
        display:'flex',
        flexDirection:'row',
        justifyContent: 'center',
        alignItems:'',
        backgroundColor:'white',
        borderRadius: 15,
        // backgroundColor:'gray'
    },
    searchImg:{
        width: 48,
        height: 50,
        // backgroundColor:'purple'
    },
    search:{
        // marginLeft: 50,
        width: 250,
        height: 48,
        display:'flex',
        // justifyContent: 'center',
        // textAlign:'center',
        // marginLeft: 100,
        // backgroundColor:'gray'
    },
    foodContainer:{
        width: '100%',
        // height: 400,
        // backgroundColor: 'yellow',
        display: 'flex',
        alignItems: 'center',
    },
    foodCategory:{
        width: 300,
        fontWeight: '400',
        fontSize: 20,
        marginTop: 28
    },
    itemContainer: {
        // borderBottomWidth: 1,
        // borderBottomColor: '#ccc',
        paddingVertical: 10,
        width: 70,
        marginTop: 10,
        display: 'flex',
        flexDirection:'column',
        // justifyContent:'center',
        alignItems: 'center',
        textAlign:'center',
        // backgroundColor:'gray'
    },
    circularView: {
        width: 50,   
        height: 50, 
        borderRadius: 25, 
        backgroundColor: 'white', 
        // marginRight: 10, 
        marginBottom: 5,
        backgroundColor: '#FEA655'
      },
    foodName:{
        flexDirection: 'row',
        flexWrap: 'wrap',   
        paddingHorizontal: 20,
        // backgroundColor: 'purple',
        gap: 5
    },
    scrollView: {
        height: 580, 
    },
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.4)"
      },
      background: {
          flex: 1,
      },
      bottomSheetContainer: {
          height: '85%',
          backgroundColor: "#F8F9FA",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          padding: 10
      },
})

export default BottomSheet;
