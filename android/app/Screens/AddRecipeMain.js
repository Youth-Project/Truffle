{/* 부족한 부분: 항목이 채워진 조건하에 버튼이 채워지게, 조리시간 & 별컴 db연결, 요리이름 인풋창 한쪽으로만 늘어나게하기, 사진추가 누르면 갤러리연동 */}

{/**
전체 map
조리 시간 array
포토
난이도
조리 과정 array
재료 map
*/}
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, StyleSheet, Modal, Image } from 'react-native';

const AddRecipeMain = ({navigation}) => {
  const [food, onChangeFood] = useState('');
  const [hour, setHour] = useState('');
  const [min, setMin] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [userRecipeImage, setUserRecipeImage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [userIngredients, setUserIngredients] =useState([]);

{/* 별컴포넌트 */}
  const [star, setStar] = useState({
    button1: false,
    button2: false,
    button3: false,
  });

  const handleSmallButtonClick = (buttonName) => {
    setStar((prevStates) => ({
      ...prevStates,
      [buttonName]: !prevStates[buttonName],
    }));
  }; 

  let recipe_difficulty = 1;

  const getImageForButton = (buttonName) => {
    if (star[buttonName]) {
      // 작은 버튼이 눌렸을 때의 이미지 경로
      switch (buttonName) {
        case 'button2':
          recipe_difficulty = 2;
          return require('../assets/icons/star2.png');
        case 'button3':
          recipe_difficulty = 3;
          return require('../assets/icons/star3.png');
        default:
          recipe_difficulty = 1
          return require('../assets/icons/star1.png');
      }
    } 
  };

{/* 조리시간 업뎃 */}
  const updateCookingTime = () => {
  const hasHour = hour && hour !== '0';
  const hasMinute = min && min !== '0';

  if (hasHour || hasMinute) {
    const newCookingTime = `${hasHour ? hour + '시간' : ''} ${hasMinute ? min + '분' : ''}`;
    setCookingTime(newCookingTime);
  } else {
    setCookingTime('조리시간');
  }

  setModalVisible(false);
};


  return (
    <View style={styles.container}>
    {/* 요리시간 팝업 */}
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={{fontSize: 15,bottom: 20,right: 85,}}>요리 소요 시간</Text>
      {/* 시간 입력하고 원본화면에 어떻게 저장하는지 모르겠음 */}
      <View style={{flexDirection: 'row'}}>
      <TextInput
            style={{fontSize: 15,
            borderWidth: 0.5,
            height: 28,
            top: 5,
            width: 55,
            right: 30,
            color: '#878787',
            textAlign: 'center',
            borderTopWidth: 0,
            borderLeftWidth: 0,
            borderRightWidth:0,
            marginLeft: 5}}
            placeholder="0" 
            keyboardType="numeric"

value={hour}
            onChangeText={(text) => setHour(text)}
            />
          <Text style={{ right: 16,fontSize: 15,top: 12,}}>시간</Text>

          <TextInput
            style={{fontSize: 15,
            borderWidth: 0.5,
            height: 28,
            top: 5,
            width: 55,
            left: 4,
            color: '#878787',
            textAlign: 'center',
            borderTopWidth: 0,
            borderLeftWidth: 0,
            borderRightWidth:0,
            marginLeft: 5}}
            placeholder="0" 
            keyboardType="numeric" 
            
value={min}

onChangeText={(text) => setMin(text)}
            />
          <Text style={{ left: 20,fontSize: 15,top: 12,}} >분</Text>
          </View>
            
      <TouchableOpacity
        style={styles.modButton}
        onPress={updateCookingTime}
>
        <Text style={styles.modButtonText}>완료</Text>
      </TouchableOpacity>
              
      </View>
     </View>
    </Modal>


      <TouchableOpacity
        style={{top: 83,
    marginBottom: 20, 
    paddingTop: 4, borderRadius: 7, position: 'absolute', backgroundColor: '#EDEDED', width: 350, height: 139,}} >
      <Text style={{top: 60,
    fontSize: 12,
    color: '#9C9C9C',
    textAlign: 'center',
    }}>사진 추가</Text>
    </TouchableOpacity>

{/*<ScrollView style={{top: 100, height: 'auto'}}> */}

{/*텍스트박스 어떻게 한쪽으로만 늘어나게하지 */}
      <TextInput
        style={{
          top: 240, right: 130, 
          fontSize: 20, 
        backgroundColor: '#FFFFFF',
        
        borderRadius: 10,
        paddingLeft: 6, paddingRight: 6, paddingTop: 7, paddingBottom: 7, 
        marginBottom: 17, textDecorationLine: 'underline', textDecorationColor: '#FEA655', 
          }}
        onChangeText={onChangeFood}
        value={food}
        placeholder="요리이름"
      />
    
{/* 필요한 재료 */}
  <TouchableOpacity
    style={{ right: 62, top: 240,
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    width: 215,
    height: 330,
    borderRadius: 10, }}
    onPress={() => navigation.navigate('Ingredients')}>
    <Image style={{right: 180, top: 10, zIndex: 2, position: 'absolute' }} source={require('../assets/icons/bowl.png')}/>
    <Text style={{
      top: 150,
      color: '#9C9C9C', 
      fontSize: 12, 
      textAlign: 'center',
     }}>
     필요한 재료</Text>
    </TouchableOpacity>


  {/* 조리시간 */}
<TouchableOpacity
        style={{ left: 115, bottom: 91,
        backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    width: 112,
    height: 150,
    borderRadius: 10,
    marginBottom: 15, }}
        onPress={() => setModalVisible(true)}>
        <Image style={{left: 45, top: 15, position: 'absolute', alignItems: 'center',  }} source={require('../assets/icons/clock.png')}/>
        <Text style={{
          top: 78,
          color: '#9C9C9C', 
        fontSize: 18, 
        textAlign: 'center',
        
        }}> {cookingTime || '조리시간'} </Text>
      </TouchableOpacity>

      <View
        style={{ left: 115, bottom: 91,
        backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    width: 112,
    height: 166,
    borderRadius: 10, }} >
        <Text style={{
          top: 5,
          color: '#000000', 
        fontSize: 18, 
        textAlign: 'center',
        }}>
        
        난이도</Text>
    <View style={{flexDirection: 'row', gap: 0}}>

    
    {/* 별컴포넌트 1 */}
        <TouchableOpacity style={{width: 24, height: 24, backgroundColor: 'transparent', marginLeft: 10, marginTop: 50, }}
        onPress={() => handleSmallButtonClick('button1')}        >
        <Image  source={require('../assets/icons/star1.png')}/>
        </TouchableOpacity>
        

        <TouchableOpacity style={{width: 24, height: 24, backgroundColor: 'transparent', marginLeft: 10, marginTop: 50}}
        onPress={() => handleSmallButtonClick('button2')}        >
        <Image style={{right: 34}} source={getImageForButton('button2')} />
        </TouchableOpacity>

        <TouchableOpacity style={{width: 24, height: 24, backgroundColor: 'transparent', marginLeft: 10, marginTop: 50}}
        onPress={() => handleSmallButtonClick('button3')} >
       <Image style={{right: 68}} source={getImageForButton('button3')} />
        </TouchableOpacity>
      </View>
      </View>

<View style={styles.row}>
      <TouchableOpacity
        style={{ top: 85,
        
    borderWidth: 1,
    borderColor: '#CCCCCC',
    paddingVertical: 10,
    width: 140,
    borderRadius: 25,
    marginBottom: 20, }}
        onPress={() => navigation.goBack()}>
 
        <Text style={{
        color: '#CCCCCC', 
        fontSize: 15, 
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'NanumGothic' 
        }}>
        뒤로가기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonUnfill}
        onPress={() =>navigation.navigate('AddProgress', {cookingTime: cookingTime,  recipe_difficulty:  recipe_difficulty, food:food})
      }>
        <Text style={styles.buttonColorText}>다음</Text>
      </TouchableOpacity>
  </View>
</View>
  );
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#F8F9FA', // 배경색상 추가
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    width: 304,  
    height: 189,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 500,
      height: 500,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 500,
  },

  row: {
    position: 'absolute',
    top: 570,
    flexDirection: 'row', 
    justifyContent: 'space-evenly',
    gap: 25,
  },

  buttonUnfill: {
    top: 85,
    width: 140,
    borderWidth: 1,
    borderColor: '#FEA655',
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 20,

  },
  buttonColorText: {
    color: '#FEA655',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'NanumGothic',
  },
  modButton: {
    top: 30,
    width: 90,
    borderWidth: 1,
    borderColor: '#FEA655',
    paddingVertical: 5,
    borderRadius: 25,
  },
  modButtonText: {
    color: '#FEA655',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'NanumGothic',
  },



});

export default AddRecipeMain;