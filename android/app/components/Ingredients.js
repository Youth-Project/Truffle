import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  PanResponder,
  TextInput,
  Image,SafeAreaView, FlatList
} from 'react-native';
import  {  vegetable, bread, fruit, sausage, seafood, truffle, noodle, spice, bean, grain, meat, milk }  from './IngredientsArray';
import SearchIcon from "../assets/icons/SearchIcon";
import { switchUnitConversion, updateUsersRefrigeratorAddedFromIngredient, showOnRefrigerator } from '../BackFunc/RecipeFunc';

const Ingredients = () => {
  const screenHeight = Dimensions.get("screen").height;
  //--검색 쿼리--\\
  const [searchQuery, setSearchQuery] = useState('');
  const allIngredients = [...vegetable, ...bread, ...fruit, ...sausage, ...seafood, ...truffle, ...noodle, ...spice, ...bean, ...grain, ...meat, ...milk];
  const filteredData = searchQuery
    ? allIngredients.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allIngredients;
    const [isTextInput, setIsTextInput] = useState('');
  const checkInput = (text) =>{
    if(text.trim()===''){
      setIsTextInput(false)
    }
  }
  const [selectedIngredient, setSelectedIngredient] = useState([])

  const updateSelectedIngredient = async() => {
    try{
    const ingredientInRef = await showOnRefrigerator();
    await setSelectedIngredient(ingredientInRef);
    console.log('showOnOutput: ', ingredientInRef);
    console.log('updateSelectedIngredient: ', selectedIngredient);
    }
    catch(error){
      console.error('error in front: ', error)
    }
  }
  //--모달--\\
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [isInputSet,setIsInputSet] = useState(false);
  const isValidInput = (inputValue) =>{
      inputValue.trim()===''?setIsInputSet(true):setIsInputSet(false);
      return(isInputSet);
    }
    const [foodCategory, setFoodCategory] = useState('');
  const pressButton = () => {
      setModalVisible(true);
  };
  const pressButton2 = () => {
      setModalVisible2(true);
  };
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

    const closeModal = () => {
        closeBottomSheet.start(()=>{
            setModalVisible(false);
        })
    }
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (text) => {
      setInputValue(text);
    }
    const [foodUnits, setFoodUnits] = useState('개');
    const handleUnitPress = (unit) => {
        setFoodUnits(unit);
    };
    
    const [conversion, setConversion] = useState('unit_to_gram');
    const [itemClicked,setItemClicked] = useState();

    const isItemClicked = (item) =>{
        setItemClicked(item);
    }

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
      <View style={styles.inputArea}>
        <View style={styles.wrapper}>
          <SearchIcon/>
          <TextInput
          style={styles.search}
          placeholder='검색...'
          onChangeText={(text)=>{setSearchQuery(text); checkInput(text)}}
          value={searchQuery}
          keyboardType="default"
          />
        </View>
      </View>

      <SafeAreaView>
        
      <View style={styles.foodContainer}>
         <FlatList
            data={filteredData}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity key={item} style={styles.itemContainer} onPress={() => { pressButton(); setItemClicked(item.name); setFoodCategory(item.category); } }>
                <View style={styles.circularView}>
                  <Image source={item.img} />
                </View>
                <Text>{item.name}</Text>
              </TouchableOpacity>
        )}
        numColumns={5}
      />
      </View>
    </SafeAreaView>

    
    <Modal
    visible={modalVisible}
    animationType={"fade"}
    transparent
    statusBarTranslucent
    >
        <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.background}/>
            </TouchableWithoutFeedback>
                <Animated.View
                    style={{...styles.bottomSheetContainer, transform: [{ translateY: translateY }]}}
                    {...panResponders.panHandlers}
                >
                <View style={{display:'flex', flexDirection:'row'}}>
                    <Text style={styles.title}>
                        재료 양 설정
                    </Text>
                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                        <Text>X</Text>
                        {/* X대신 이미지 */}
                    </TouchableOpacity>
                </View>
                <Text style={styles.textGray}>
                    수량
                </Text>
                <View style={styles.grayBorderContainer}>
                    <View style= {{display: 'flex', flexDirection:'row'}}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text)=>{handleInputChange(text);isValidInput(text);}}
                            value={inputValue}
                            placeholder="수량"
                            keyboardType="number-pad"
                        />
                        <Text style={styles.units}> {foodUnits} </Text>
                    </View>
                    {isInputSet && (
                      <Text style={styles.alaramMessage}>
                        수량과 단위를 선택해 주세요.
                      </Text>
                    )}
                </View>
                <Text style={styles.textGray}>
                    단위
                </Text>
                <View style={styles.bottomContainer}>
                    <View style={styles.unitsContainer}>
                        <TouchableOpacity onPress={() => {changeConversion('개'); handleUnitPress('개')}}>
                            <Text style= {styles.unitSelect}>개</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {handleUnitPress('스푼'); changeConversion('스푼')}}>
                            <Text style= {styles.unitSelect}>스푼</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {handleUnitPress('ml'); changeConversion('ml')}}>
                            <Text style= {styles.unitSelect}>ml</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {handleUnitPress('g'); changeConversion('g')}}>
                            <Text style= {styles.unitSelect}>g</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                    <TouchableOpacity style= {styles.nextButton} onPress={()=>{
                         if (!isValidInput(inputValue)) { 
                          closeModal(); 
                          updateUsersRefrigeratorAddedFromIngredient(inputValue, itemClicked, conversion, foodUnits, foodCategory);
                        }
                          updateSelectedIngredient();
                          }}>                            
                        <Text style={styles.next}>저장하기</Text>
                    </TouchableOpacity>
                    </View>
                </View>
                </Animated.View>
            </View>
        </Modal>
  </View>
 
  )
}

const styles = StyleSheet.create({

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
      marginTop: 16,
      marginLeft: 155,
      width: 38,
      height: 23,
      backgroundColor: '#F8F9FA',
      justifyContent: 'center',
      alignItems:'center',
      // backgroundColor:'yellow'
  },
  alaramMessage:{
    marginTop: 10,
    color: 'red',
    fontSize: 12
  },
  inputArea:{
      width:'100%',
      alignItems:'center',
      marginTop: 15,
  },
  wrapper:{
      width: 300,
      height: 48,
      flexDirection:'row',
      justifyContent: 'center',
      alignItems:'center',
      backgroundColor:'white',
      borderRadius: 15,
  },
  search:{
      width: 250,
      height: 48,
      display:'flex',
  },
  foodContainer:{
      width: '100%',
    //   backgroundColor: 'yellow',
      display: 'flex',
      justifyContent: 'center',
      alignItems:'center'
  },
  foodCategory:{
      // width: 300,
      fontWeight: '400',
      fontSize: 20,
      // marginTop: 28
  },
  itemContainer: {
      // borderBottomWidth: 1,
      // borderBottomColor: '#ccc',
      paddingVertical: 10,
      width: 70,
      marginTop: 10,
      flexDirection:'column',
    //   justifyContent:'center',
      alignItems: 'center',
    //   textAlign:'center',
    //   marginRight:10,
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
      gap: 5
  },
  scrollView: {
      height: 580,
  },
  overlay: {
      flex: 1,
      justifyContent: "flex-end",
    },
    background: {
        flex: 1,
    },
    IngredientsContainer: {
        height: '85%',
        backgroundColor: "#F8F9FA",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 10
    },
    menu: {
      width: '33.3%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#D4D4D4',
      fontSize: 15,
      fontStyle: 'normal',
      fontWeight: '400',
      cursor: 'pointer',
      borderBottomWidth: 1,
      borderBottomColor: '#D4D4D4',
    },
    menuClicked: {
      borderBottomColor: '#FEA655',
      color: '#000000',
    },
    imgContainer: {
      width: 156,
      height: 156,
      backgroundColor: 'purple',
      marginTop: '65%',
    },
    statusText: {
      marginTop: 10,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    grayBox:{
      width: 205,
      height: 7,
      backgroundColor: '#DBDBDB',
      borderTopRightRadius: 5,
      borderTopLeftRadius: 5,
      marginTop: '72%',
      position: 'absolute',
      top: 430
    },
    foods:{
      borderRadius: 15,
      backgroundColor: '#F8F9FA',
      width: 300,
      height: 63,
      backgroundColor: 'white',
    //   elevation: 4, // Adjust the elevation value to control the shadow intensity
      padding: 16,
      borderRadius: 8,
      marginTop: 11,
      display: 'flex',
      // justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    foodCont:{
      width: '100%',
      height: '90%',
      display: 'flex',
      alignItems: 'center',
      marginTop: 22,
      // marginBottom: 22,
      gap: 11,
      // backgroundColor: 'yellow'
    },
    circle:{
      width: 50,
      height: 50,
      borderRadius: 100,
      backgroundColor: 'yellow',
      marginRight: 16 
    },
    foodName:{
      fontSize: 15,
      color: 'black',
      width: 100,
      height: 20,
      // backgroundColor: 'yellow'
    },
    foodCount:{
      // marginLeft: 10,
      width: 38,
      textAlign: 'right',
      backgroundColor: 'purple'
    },
    foodUnit:{
      marginLeft: 5
    },
    pencil:{
      width: 30,
      height: 30,
      marginLeft: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    bottomSheetContent: {
      backgroundColor: '#F8F9FA',
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      width: '100%',
      height: '100%'
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
    textGray:{
        margin: 20,
        color: '#9C9C9C',
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
        marginTop: 40
    },
    unitSelect:{
        fontSize: 15,
        // backgroundColor: 'purple',
        width: 40,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
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
        borderWidth:1,
        borderRadius: 25,
        borderColor: '#FEA655',
        backgroundColor:'#FEA655',
        width: 112,
        height: 34,
    },
    next:{
        textAlign:'center',
        padding: 5,
        color: 'white',
        fontWeight: '700',
        fontSize: 15
    },
    addButton:{
      width:50,
      height:50,
      borderRadius: 25,
      position: 'absolute',
      right: 20,
      bottom: 100
    }
})

export default Ingredients;

/*
        <ScrollView contentContainerStyle={styles.foodName} style={styles.scrollView}>
          <Text style={styles.foodCategory}>채소</Text>
            {vegetable && vegetable.map((food, index) => (
              <TouchableOpacity key={index} style={styles.itemContainer}>
                <View style={styles.circularView}>
                  <Image source={food.img} />
                </View>
                <Text>{food.name}</Text>
              </TouchableOpacity>
            ))}
            <Text style={styles.foodCategory}>빵/떡</Text>
              {bread && bread.map((food, index) => (
                <TouchableOpacity key={index} style={styles.itemContainer}>
                <View style={styles.circularView}>
                  <Image source={food.img} />
                </View>
                <Text>{food.name}</Text>
                </TouchableOpacity>
              ))}
              <Text style={styles.foodCategory}>햄/소시지</Text>
                {sausage && sausage.map((food, index) => (
                  <TouchableOpacity key={index} style={styles.itemContainer}>
                  <View style={styles.circularView}>
                    <Image source={food.img} />
                  </View>
                  <Text>{food.name}</Text>
                  </TouchableOpacity>
                ))}
                              <Text style={styles.foodCategory}>해산물</Text>
                              {seafood && seafood.map((food, index) => (
                                  <TouchableOpacity key={index} style={styles.itemContainer}>
                                      <View style={styles.circularView}>
                                      <Image source={food.img} />
                                      </View>
                                      <Text>{food.name}</Text>
                                  </TouchableOpacity>
                              ))}
                              <Text style={styles.foodCategory}>유제품</Text>
                              {milk && milk.map((food, index) => (
                                  <TouchableOpacity key={index} style={styles.itemContainer}>
                                      <View style={styles.circularView}>
                                      <Image source={food.img} />
                                      </View>
                                      <Text>{food.name}</Text>
                                  </TouchableOpacity>
                              ))}
                              <Text style={styles.foodCategory}>고기류</Text>
                              {meat && meat.map((food, index) => (
                                  <TouchableOpacity key={index} style={styles.itemContainer}>
                                      <View style={styles.circularView}>
                                      <Image source={food.img} />
                                      </View>
                                      <Text>{food.name}</Text>
                                  </TouchableOpacity>
                              ))}
                              <Text style={styles.foodCategory}>과일</Text>
                              {fruit && fruit.map((food, index) => (
                                  <TouchableOpacity key={index} style={styles.itemContainer}>
                                      <View style={styles.circularView}>
                                      <Image source={food.img} />
                                      </View>
                                      <Text>{food.name}</Text>
                                  </TouchableOpacity>
                              ))}
                              <Text style={styles.foodCategory}>곡물</Text>
                              {grain && grain.map((food, index) => (
                                  <TouchableOpacity key={index} style={styles.itemContainer}>
                                      <View style={styles.circularView}>
                                      <Image source={food.img} />
                                      </View>
                                      <Text>{food.name}</Text>
                                  </TouchableOpacity>
                              ))}
                              <Text style={styles.foodCategory}>콩/견과류</Text>
                              {bean && bean.map((food, index) => (
                                  <TouchableOpacity key={index} style={styles.itemContainer}>
                                      <View style={styles.circularView}>
                                      <Image source={food.img} />
                                      </View>
                                      <Text>{food.name}</Text>
                                  </TouchableOpacity>
                              ))}
                              <Text style={styles.foodCategory}>조미료/양념</Text>
                              {spice && spice.map((food, index) => (
                                  <TouchableOpacity key={index} style={styles.itemContainer}>
                                      <View style={styles.circularView}>
                                      <Image source={food.img} />
                                      </View>
                                      <Text>{food.name}</Text>
                                  </TouchableOpacity>
                              ))}
                              <Text style={styles.foodCategory}>면</Text>
                              {noodle && noodle.map((food, index) => (
                                  <TouchableOpacity key={index} style={styles.itemContainer}>
                                      <View style={styles.circularView}>
                                      <Image source={food.img} />
                                      </View>
                                      <Text>{food.name}</Text>
                                  </TouchableOpacity>
                              ))}
                              <Text style={styles.foodCategory}>트러플</Text>
                              {truffle && truffle.map((food, index) => (
                                  <TouchableOpacity key={index} style={styles.itemContainer}>
                                      <View style={styles.circularView}>
                                      <Image source={food.img} />
                                      </View>
                                      <Text>{food.name}</Text>
                                  </TouchableOpacity>
                              ))}
            <View style={{ marginBottom: 10 }}></View>
            
      </ScrollView>
*/