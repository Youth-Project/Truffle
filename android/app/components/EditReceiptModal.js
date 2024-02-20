import React, {useState, useEffect} from 'react';
import { View, Button, Modal, Text, TouchableOpacity, StyleSheet,Dimensions, TextInput, ScrollView, SafeAreaView, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import Line from "../assets/icons/Line";
import SmallAddBTNGrey from "../assets/icons/SmallAddBTNGrey";
import AddBTNIcon from "../assets/icons/AddBTNIcon";
import TruffleLogo from "../assets/logo/TruffleLogo";
import SaveBTN from "../assets/icons/SaveBTN";
import LeftArrow from "../assets/icons/LeftArrow";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";

const EditReceiptModal = ({ EditVisible, toggleEditModal, selectedDate}) => {

  const [items, setItems] = useState([{ nameArr: [], quantityArr: [], priceArr: [] }]);
  const [nameArr, setNameArr] = useState([name]);
  const [quantityArr, setQuantityArr] = useState([quantity]);
  const [priceArr, setPriceArr] = useState([price]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [inputTagList, setInputTaglist] = useState([{payArr: [], shopArr:[], tagsArr:[]}]);

  const [shop, setShop] = useState('');
  const [pay, setPay] = useState(null);
  const [tags, setTags] = useState(null);
  
  const [shopArr, setShopArr] = useState([shop]);
  const [payArr, setPayArr] = useState([pay]);
  const [tagsArr, setTagsArr] = useState([tags]);
  const [dailyExpense, setDailyExpense] = useState(0);
  const [expenseCount, setExpenseCount] = useState(0);
  const [memo,setMemo]=useState('');
  const [shoppingExpense, setShoppingExpense] = useState(0);
  const [eatOutExpense, setEatOutExpense] = useState(0);
  const [deliveryExpense, setDeliveryExpense] = useState(0);
  //--input 바뀌었을 때--\\
  const handleInputChange = (text, index, key) => {
    const newItems = [...items];
    newItems[index][key] = text;

    // 해당하는 값들을 nameArr, quantityArr, priceArr에 저장
    const { name, quantity, price } = newItems[index];
    const updatedNameArr = [...nameArr];
    const updatedQuantityArr = [...quantityArr];
    const updatedPriceArr = [...priceArr];
    updatedNameArr[index] = name;
    updatedQuantityArr[index] = quantity;
    updatedPriceArr[index] = price;

    // 상태 업데이트
    setNameArr(updatedNameArr);
    setQuantityArr(updatedQuantityArr);
    setPriceArr(updatedPriceArr);
    setItems(newItems);
  };
  //--input 받기--\\
  const handleAddItem = () => {
    const newItem = items[items.length - 1];
    if (newItem.quantity && newItem.name && newItem.price) {
      setNameArr(prevNameArr => [...prevNameArr, newItem.name]);
      setQuantityArr(prevQuantityArr => [...prevQuantityArr, newItem.quantity]);
      setPriceArr(prevPriceArr => [...prevPriceArr, newItem.price]);

      saveData();
      setItems(prevItems => [...prevItems, { nameArr: [], quantityArr: [], priceArr: [] }]);
      setName('');
      setQuantity('');
      setPrice('');
    }
  };

  //--모든 TextInput이 값이 채워졌는지 확인(안채우면 add안됨)--\\
  const areitemsFilled = () => {
    return items.every(input => input.quantity && input.name && input.price);
  };
  //--AsyncStorage에 데이터 저장--\\
  const saveData = async () => {
    try {
      const dataToSave = items.map(item => ({
        nameArr: item.name,
        quantity: item.quantity,
        price: item.price
      }));
      await AsyncStorage.setItem(selectedDate, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  //--AsyncStorage에서 데이터 불러오기--\\
useEffect(() => {
  const loadData = async () => {
    try {
      const storeditems = await AsyncStorage.getItem(selectedDate); // 해당 날짜의 items 불러오기
      if (storeditems) {
        const parsedItems = JSON.parse(storeditems);
        const initialItems = parsedItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }));
        setItems(initialItems);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };
  loadData();
}, [selectedDate]);
//--AddDailyExpense--\\  
  //--장보기 외식 배달 string 변환 변환 후 array에 저장--\\
  const handleTags = (buttonName) => {
    let tagsReturnVal = '';
    if(buttonName=='shopping'){
      setTags(buttonName);
      tagsReturnVal='장보기';

    }else if (buttonName == 'eatOut'){
      setTags(buttonName);
      tagsReturnVal='외식';
    }
    else{
      setTags(buttonName);
      tagsReturnVal='배달';
    }
    setTagsArr(tagsReturnVal);
  };

//--현금 카드 string 변환 후 array에 저장--\\
const handlepay = (buttonName) => {
  let btnReturnVal='';
  if(buttonName=='cash'){
    setPay(buttonName);
    btnReturnVal='현금';
  }else{
    setPay(buttonName);
    btnReturnVal='카드';
  }
  setPayArr(btnReturnVal);
};
  //--shop input--\\
  const handleShopChange = (text) => {
    setShop(text);
    setShopArr(text);
  };

  // SaveBTN을 눌렀을 때 inputTagList 저장
  const handleInputTagListSave = () => {
    saveData(); // AsyncStorage에 데이터 저장
  };
  //--플러스 버튼 누르면 아레이 값 증가--\\
  const handleAddExpense = () => {
     setInputTaglist(prevInputTagList => [
      ...prevInputTagList, 
      { 
        items:[],
        pay: '', 
        shop: '', 
        tags: '',
      }
    ]);
  };
  
  //--EditReciptModal--\\
 
 //--하루 총액 구하기--\\
 useEffect(() => {
  let totalExpense = 0;
  priceArr.forEach(elem => {
    totalExpense += parseFloat(elem);
  });
  setDailyExpense(totalExpense);
}, [priceArr]);

//--합산--\\
const calTotal = (btnName) => {
  let totalShopping = 0;
  let totalEatOut = 0;
  let totalDelivery = 0;
  priceArr.forEach(item => {
    if (btnName === 'shopping') {
      totalShopping += parseFloat(item);
      setShoppingExpense(totalShopping);
    } else if (btnName === 'eatOut') {
      totalEatOut += parseFloat(item);
      setEatOutExpense(totalEatOut);
    } else if (btnName === 'delivery') {
      totalDelivery += parseFloat(item);
      setDeliveryExpense(totalDelivery);
    }
  });

}

  //----파이어베이스에 업데이트----\\
  const [loading, setLoading] = useState(false);
  const handleSaveData = async () => {
    try {
    
      setLoading(true);
      const userId = 'xxvkRzKqFcWLVx4hWCM8GgQf1hE3';
      const totalPrice=dailyExpense;
      const date = selectedDate;
      const data = {
  amount: totalPrice,
  items: [
    { name: nameArr, quantity: quantityArr, price: priceArr },
  ],
  pay: [
    { pay: payArr, shop: shopArr, tag: tagsArr },
  ],
  memo: memo
};
      const currentDate = new Date(date);
      const currentMonth = currentDate.getMonth()+1;
      const currentYear = currentDate.getFullYear();
      const index = `${String(currentYear)}-${String(currentMonth).padStart(2, '0')}`;
      const userRef = firestore().collection('users').doc(userId);
      
    const currentShoppingSnapshot = await userRef.get();
    const currentShopping = currentShoppingSnapshot.data().shopping[index] || 0;

    const currentEatOutSnapshot = await userRef.get();
    const currentEatOut = currentEatOutSnapshot.data().eatOut[index] || 0;

    const currentDeliverySnapshot = await userRef.get();
    const currentDelivery = currentDeliverySnapshot.data().delivery[index] || 0;

      
    const updatedShopping = currentShopping + shoppingExpense;
    const updatedEatOut = currentEatOut + eatOutExpense;
    const updatedDelivery = currentDelivery + deliveryExpense;

      await userRef.update({
        [`shopping.${index}`]: updatedShopping,
        [`eatOut.${index}`]: updatedEatOut,
        [`delivery.${index}`]: updatedDelivery
      });
      
  await firestore().collection(userId).doc(date).set(data);
  handleInputTagListSave();
  Alert.alert('Success', 'Data saved successfully.');
  } catch (error) {
    console.error('Error saving data:', error);
    Alert.alert('Error', 'Failed to save data.');
  } finally {
    setLoading(false);
  }
 };

  const checkingArr = () => {
    console.log(nameArr, pay, shop, tags);
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={EditVisible}
      onRequestClose={() => {
        toggleEditModal();
      }}
    >
    <SafeAreaView>
      <ScrollView>
        <View>
        <View style={styles.modalContainer}>
          {/* 뒤로 가기 로고 플러스 버튼*/}
        <View  style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:10}}>
          <TouchableOpacity onPress={() => {toggleEditModal()}}>
          <LeftArrow height={30} width={30}/>
          </TouchableOpacity>
          <TruffleLogo height={30} width={30}/>
          <TouchableOpacity onPress={handleAddExpense}>
            <AddBTNIcon height={35} width={35} />
          </TouchableOpacity>
        </View>
          <View style={{alignItems:'center', marginTop:20}}>
            <View style={styles.expenseHeader}>
              <View style={{width:8}}></View>
                <Text style={styles.expenseText}>{dailyExpense}</Text>
                <Text style={{fontSize:24, fontWeight:'400'}}>원</Text>
              </View>
              <Line/>
            {/*ProductList */}
        {items.map((input, index) => (
        <View key={index} style={{ flexDirection: 'row', gap: 20, alignItems: 'center', marginTop:10 }}>
          <TextInput
            placeholder="항목 입력"
            style={[styles.ProductInput, { width: 100 }]}
            value={input.name}
            onChangeText={(text) => handleInputChange(text, index, 'name')}
          />
          <TextInput
            placeholder="수량"
            style={[styles.ProductInput, {width:40}]}
            value={input.quantity}
            keyboardType="number-pad"
            onChangeText={(text) => handleInputChange(text, index, 'quantity')}
          />
          <TextInput
            placeholder="가격"
            style={[styles.ProductInput, {width:100}]}
            value={input.price}
            keyboardType="number-pad"
            onChangeText={(text) => handleInputChange(text, index, 'price')}
          />
          <Text style={{ fontSize: 18 }}>₩</Text>
        </View>
        ))}
        <TouchableOpacity onPress={handleAddItem} disabled={!areitemsFilled()} style={{ marginTop: 10, marginBottom:10 }}>
          <SmallAddBTNGrey />
        </TouchableOpacity>
        <Line/>
          {/*AddDailyExpense*/}
        <View style={{alignItems:'flex-start', marginLeft:-20}}>
          <View style={styles.tagStyle}>
            <Text>PAY</Text>
            <TouchableOpacity
              style={[styles.TagsBTN, pay === 'cash' && styles.selectedBTN]}
              onPress={() => handlepay('cash')}
            >
            <Text style={[styles.TagsBTNText, pay === 'cash' && styles.selectedBTNText]}>현금</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.TagsBTN, pay === 'card' && styles.selectedBTN]}
              onPress={() => handlepay('card')}
            >
            <Text style={[styles.TagsBTNText, pay === 'card' && styles.selectedBTNText]}>카드</Text>
            </TouchableOpacity>    
          </View>

          <View style={styles.tagStyle}>
            <Text>SHOP</Text>
            <TextInput
            placeholder="..."
            style={styles.shopInput}
            value={shop}
            onChangeText={handleShopChange}
            />
          </View>

          <View style={styles.tagStyle}>
            <Text>TAG</Text>

            <TouchableOpacity
              style={[styles.TagsBTN, tags === 'shopping' && styles.selectedBTN]}
              onPress={() => {handleTags('shopping'); calTotal('shopping'); }}
            >
            <Text style={[styles.TagsBTNText, tags === 'shopping' && styles.selectedBTNText]}>장보기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.TagsBTN, tags === 'eatOut' && styles.selectedBTN]}
              onPress={() => {handleTags('eatOut'); calTotal('eatOut');}}
            >
            <Text style={[styles.TagsBTNText, tags === 'eatOut' && styles.selectedBTNText]}>외식</Text>
            </TouchableOpacity> 

            <TouchableOpacity
              style={[styles.TagsBTN, tags === 'delivery' && styles.selectedBTN]}
              onPress={() => {handleTags('delivery'); calTotal('delivery');}}
            >
            <Text style={[styles.TagsBTNText, tags === 'delivery' && styles.selectedBTNText]}>배달</Text>
            </TouchableOpacity> 
          </View>
        </View>
      <Line/>

      <View style={styles.memoContainer}>
        <Text>MEMO</Text>
          </View>
          <TextInput
          placeholder="..."
          style={styles.input}
          value={memo}
          onChangeText={(text) => setMemo(text)}
          />
          </View>
          <TouchableOpacity
          style={{alignItems:'center', marginBottom:200}}
          onPress={()=>{
            handleSaveData();
            toggleEditModal();
            handleInputTagListSave();
            checkingArr();
          }}
          >
            <SaveBTN/>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
</Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor:'#F8F9FA',
    width: Dimensions.get('window').width,
  },
  modalContent: {
    backgroundColor: 'white',
    width: 304,
    height:310,
    borderRadius: 10,
  },
  HeaderText:{
    fontSize:14,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 150,
    width: Dimensions.get('window').width-100,
    borderColor: 'gray',
    borderWidth:0.5,
    fontSize:14,
    textAlign:'center',
    marginBottom:50,
    marginTop:10,
    borderRadius:10,
  },
  memoContainer:{
    width: Dimensions.get('window').width,
    alignItems:'flex-start',
    marginLeft:100,
    marginTop:10,
  },
  expenseText:{
    fontSize:38,
  },
  expenseHeader:{
    flexDirection:'row',
    width: Dimensions.get('window').width*0.7,
    justifyContent:'space-between',
    alignItems:'center'
  },
  ProductInput: {
    height: 38,
    backgroundColor:'white',
    borderColor: 'gray',
    borderBottomWidth:1,
    marginBottom: 8,
    paddingHorizontal: 8,
    fontSize:14,
    textAlign:'center'
  },
  shopInput: {
    height: 35,
    width:100,
    borderColor: 'gray',
    borderBottomWidth:1,
    fontSize:14,
    textAlign:'center'
  },
  TagsBTN: {
    padding: 5,
    margin: 5,
    borderRadius: 5,
    borderColor:'#D4D4D4',
    borderWidth:1,
    width:60,
  },
  selectedBTN: {
    borderColor: '#FEA655',
    padding: 5,
    margin: 5,
    borderRadius: 5,
    borderWidth:1,
    width:60,
  },
  TagsBTNText: {
    color: '#D4D4D4',
    fontSize: 14,
    textAlign:'center'
  },
  selectedBTNText: {
    color: '#FEA655',
    fontSize: 14,
    textAlign:'center'
  },
  tagStyle:{
    flexDirection:'row',
    alignItems:'center',
    gap:10,
    marginTop:5,
    marginBottom:5
  },
});

export default EditReceiptModal;