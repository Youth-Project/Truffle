{/* 부족한 부분: 항목이 채워진 조건하에 버튼이 채워지게, 조리시간 & 별컴 db연결, 요리이름 인풋창 한쪽으로만 늘어나게하기, 사진추가 누르면 갤러리연동 */}
{/* 전체 맵 안에 포로 url 재료 map 조리시간 array, 난이도 , 과정 array */}
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, StyleSheet, Modal, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AddRecipeMain = ({navigation}) => {
  const [food, onChangeFood] = useState('');
  const [hour, setHour] = useState('');
  const [min, setMin] = useState('');
  const [cookingTime, setCookingTime] = useState('');

  const [modalVisible, setModalVisible] = useState(false);


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



{/* 재료업뎃 모달  */}
  const [data, setData] = useState([]);
  const [modal2Visible, setModal2Visible] = useState(false);

  const [ingred, setIngred] = useState('');
  const [amount, setAmount] = useState('');

const saveData = async () => {
    // AsyncStorage에 데이터 저장
  if(data.length!==0 && cookingTime.length!==0){
    try {
      await AsyncStorage.setItem('ingredients', data);
      await AsyncStorage.setItem('time', cookingTime);
      await AsyncStorage.setItem('difficulty', String(recipe_difficulty));
      navigation.navigate('AddProgress');
    } catch (error) {
      console.error('사용자 정보를 저장할 수 없습니다: ', error);
    }
  }
  };

    const openModal = () => {
    setModal2Visible(true)
    // 모달 열릴 때마다 입력값 초기화
    setIngred('');
    setAmount('');
  };


    const handleAddItem = () => {
    if (ingred.trim() !== '' && amount.trim() !== '') {
      setData((prevData) => [...prevData, `${ingred}       ${amount} ${foodUnits}`]);
      setIngred('');
      setAmount('');
      setFoodUnits('개');
    }
    setModal2Visible(false);
  };

  const [conversion, setConversion] = useState('');
  const [isPressed, setIsPressed] = useState(false);
  const [foodUnits, setFoodUnits] = useState('개');
    const handleUnitPress = (unit) => {
        setFoodUnits(unit);
        setIsPressed(!isPressed);
    };

const changeConversion = (foodUnits) =>{
    switch (foodUnits) {
        case '개':
            setConversion('unit_to_gram');
            break;
        case '스푼':
            setConversion('gram_to_spoon');
            break;
        case 'ml':
            setConversion('ml_to_gram');
            break;
        case 'g':
            setConversion('gram_to_gram');
            break;
        default:
            break;
      }
}


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

      <View style={{flexDirection: 'row', marginTop: 8 }}>
      <TextInput
            style={{fontSize: 15,
            borderWidth: 0.5,
            height: 38,
            width: 55,
            right: 30,
            color: '#878787',
            textAlign: 'center',
            borderTopWidth: 0,
            borderLeftWidth: 0,
            borderRightWidth:0,
            paddingTop: 6,
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
            height: 38,
            width: 55,
            left: 4,
            color: '#878787',
            textAlign: 'center',
            borderTopWidth: 0,
            borderLeftWidth: 0,
            borderRightWidth:0,
            paddingTop: 6,
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

{/* 냉장고 예시 모달 */}
<Modal visible={modal2Visible} style={styles.buttonContainer}>
        <ColorButton
          color="red"
          onPress={() => handleColorSelection('red')}
          selected={selectedColors.includes('red')}
        />
        <ColorButton
          color="green"
          onPress={() => handleColorSelection('green')}
          selected={selectedColors.includes('green')}
        />
        <ColorButton
          color="blue"
          onPress={() => handleColorSelection('blue')}
          selected={selectedColors.includes('blue')}
        />
        {/* Add more ColorButtons as needed */}
      
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
 </Modal>

{/* 사진추가 모달 */}
<Modal
      animationType="slide"
      transparent={true}
      visible={modal3Visible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModal3Visible(!modal3Visible);
      }}>
      <View style={styles.centeredViewPhoto}>
        <View style={styles.modalViewPhoto}>
          <Text style={{fontSize: 15, paddingVertical: 10}}>카메라로 촬영하기</Text>
          <Text style={{fontSize: 15, paddingVertical: 10}}>사진 선택하기</Text>
      
            
      <TouchableOpacity
        style={styles.modButton}
        onPress={handlePhoto}
>
        <Text style={styles.modButtonText}>완료</Text>
      </TouchableOpacity>
              
      </View>
     </View>
    </Modal>


{/* 냉장고 예시 모달 */}
<Modal
      animationType="slide"
      transparent={true}
      visible={modal2Visible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalVisible(!modal2Visible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView2}>
          <Text style={{fontSize: 15,bottom: 20,right: 85,}}>재료 입력하기</Text>

      <View style={{flexDirection: 'row', marginTop: 8, marginLeft: 16 }}>

      <Text style={{ right: 16,fontSize: 15,top: 42,}}>재료명: </Text>
      <TextInput

            style={{fontSize: 15,
            borderWidth: 0.5,
            height: 38,
            width: 55,
            right: 30,
            color: '#878787',
            textAlign: 'center',
            borderTopWidth: 0,
            borderLeftWidth: 0,
            borderRightWidth:0,
            paddingTop: 6,
            marginLeft: 15,
            top: 30}}
            placeholder="감자" 
            value={ingred} 

            onChangeText={(text) => setIngred(text)}
            />
          <Text style={{ marginLeft: 7, right: 10, fontSize: 15,top: 42,}}>재료 양: </Text>
          <TextInput
            style={{fontSize: 15,
            borderWidth: 0.5,
            height: 38,
            width: 55,
            color: '#878787',
            textAlign: 'center',
            borderTopWidth: 0,
            borderLeftWidth: 0,
            borderRightWidth:0,
            paddingTop: 6,
            top: 30}}
            placeholder="5" 
            keyboardType='numeric'
            
value={amount}

onChangeText={(text) => setAmount(text)}
            />
          </View>
              <Text style={styles.textGray}>
                    단위:
                </Text>
                <View style={styles.bottomContainer}>
                    <View style={styles.unitsContainer}>
                    <TouchableOpacity style={[styles.button, foodUnits === '개' ? styles.buttonPressed : null]} onPress={() => {changeConversion('개'); handleUnitPress('개')}}>
                            <Text style= {styles.unitSelect}>개</Text>
                            <View style={[styles.button, isPressed ? styles.buttonPressed : null]}></View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, foodUnits === '스푼' ? styles.buttonPressed : null]} onPress={() => {handleUnitPress('스푼'); changeConversion('스푼')}}>
                            <Text style= {styles.unitSelect}>스푼</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, foodUnits === 'ml' ? styles.buttonPressed : null]} onPress={() => {handleUnitPress('ml'); changeConversion('ml')}}>
                            <Text style= {styles.unitSelect}>ml</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, foodUnits === 'g' ? styles.buttonPressed : null]} onPress={() => {handleUnitPress('g'); changeConversion('g')}}>
                            <Text style= {styles.unitSelect}>g</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
              
                    <TouchableOpacity style= {styles.nextButton} onPress={handleAddItem} >
                            <Text style={styles.next}>추가하기</Text>
                    </TouchableOpacity> 
                    </View>
                </View>
            
      </View>
     </View>
    </Modal>

{/* 사진추가 */}
    <TouchableOpacity
        style={{top: 35,
    marginBottom: 20, 
    paddingTop: 4, borderRadius: 7, position: 'absolute', backgroundColor: '#FFFFFF', width: 350, height: 139, justifyContent: 'center', alignItems: 'center'}} >
    <Image style={{width: 100, height: 100}} source={require('../assets/icons/truffle.png')}/>
    <Image style={{width: 25, height: 25, position: 'absolute', left: 310, bottom: 20 }} source={require('../assets/icons/profile.png')}/>
    </TouchableOpacity>

{/*<ScrollView style={{top: 100, height: 'auto'}}> */}

{/*텍스트박스 어떻게 한쪽으로만 늘어나게하지 */}
      <TextInput
        style={{
          top: 190, right: 130, 
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
        style={{ right: 62, top: 190,
        backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    width: 215,
    height: 330,
    borderRadius: 10, }}
        onPress={() => setModal2Visible(true)}
        >
        <Image style={{right: 180, top: 10, zIndex: 2, position: 'absolute' }} source={require('./assets/bowl.png')}/>
        <Text style={{
          top: 150,
          color: '#9C9C9C', 
        fontSize: 12, 
        textAlign: 'center',
        }}>필요한 재료</Text>
        {displayColors && selectedColors.length > 0 && (
          <View>
        

         {selectedColors.map((color, index) => (
           <ScrollView style={{justifyContent: 'center'}}>
            <Text key={index} style={{ color }}>{color || '필요한 재료'}</Text>
            </ScrollView>
            ))}
           </View>
           )}
      </TouchableOpacity>


  {/* 조리시간 */}
<TouchableOpacity
        style={{ left: 115, bottom: 140,
        backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    width: 112,
    height: 150,
    borderRadius: 10,
    marginBottom: 15, }}
        onPress={() => setModalVisible(true)}>
        <Image style={{left: 45, top: 15, position: 'absolute', alignItems: 'center',  }} source={require('./assets/clock.png')}/>
        <Text style={{
          top: 78,
          color: '#9C9C9C', 
        fontSize: 18, 
        textAlign: 'center',
        }}> {cookingTime || '조리시간'} </Text>
</TouchableOpacity>

      <View
        style={{ left: 115, bottom: 140,
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
        <Image source={require('./assets/star1.png')}/>
        </TouchableOpacity>
        

        <TouchableOpacity style={{width: 24, height: 24, backgroundColor: 'transparent', marginLeft: 10, marginTop: 50}}
        onPress={() => handleSmallButtonClick('button2')}>
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
        onPress={saveData}>
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
  modalView2: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    width: 304,  
    height: 389,
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
  centeredViewPhoto: {

    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    top: 82,
  },
  modalViewPhoto: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    width: 130,  
    height: 80,
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
    top: 530,
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
    top: 40,
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

//modal eg 
buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  textGray:{
      margin: 20,
      top: 78,
      color: '#000',
      fontSize: 15
  },
  grayBorderContainer:{
      borderBottomColor: '#EDEDED',
      borderBottomWidth: 1.5,
      height: '20%',
      display: 'flex',
      alignItems: 'center'
  },
  input:{
      marginTop: 10,
      borderBottomColor: '#BCBCBC',
      borderBottomWidth: 1,
      width: 99,
      height: 40,
      textAlign: 'center',
      fontSize:18
  },
  units:{
      height: 24,
      // width: 24,
      paddingLeft: 5,
      paddingRight: 5,
      marginLeft: 20,
      marginTop: 22,
      fontSize: 15,
      borderColor: '#D9D9D9',
      borderWidth: 1,
      display: 'flex',
      justifyContent: 'center',
      textAlign:'center',
      borderRadius: 5
  },
  bottomContainer:{
      // backgroundColor: 'yellow',
      width: '100%',
      height: '100%',
  },
  unitsContainer:{
      display:'flex',
      flexDirection:'row',
      gap: 20,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      marginTop: 40,
      top: 46,
  },
  unitSelect:{
      fontSize: 15,
      width: 40,
      height: 40,
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center',
      top: 6
  },   
  buttonContainer:{
      display:'flex',
      flexDirection:'row',
      marginTop: 50,
      gap: 30,
      justifyContent:'center'
  },
  deleteButton:{
      borderWidth:1,
      borderRadius: 25,
      borderColor: '#CCC',
      width: 112,
      height: 34,
  },
  delete:{
      textAlign:'center',
      padding: 5,
      color: '#CCC',
      fontWeight: '700',
      fontSize: 15
  },
  nextButton:{
      top: 20,
      borderWidth:1,
      borderRadius: 25,
      borderColor: '#FEA655',
      width: 112,
      height: 34,
  },
  next:{
      color: '#FEA655',
      paddingVertical: 5,
      borderRadius: 25,
      textAlign:'center',
      padding: 5,
      fontWeight: '700',
      fontSize: 15
  },
  buttonPressed: {
    backgroundColor: '#EDEDED',
    borderRadius: 10,
  },

});

export default AddRecipeMain;
