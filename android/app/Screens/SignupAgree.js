import React, { useState, useEffect } from 'react';
import {
  Text,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet, 
} from 'react-native';



const SignupAgree = ({navigation}) => {
  const { useState } = React;


const [isPressed, setIsPressed] = useState(false);

  const allAgree = () => {
    setIsPressed((prevIsRed) => !prevIsRed);
    if(isPressed){
      setRememberMe(!rememberMe);
    }
    
  };


  return(
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.back}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backBTN}> 〈 </Text>
      </TouchableOpacity>

      <Text style={styles.topTitle}>회원가입</Text>

  <Text style={{top: 68, fontSize: 20, right: 84}}>이용약관 동의</Text>
      
  <TouchableOpacity
        style={{top: 92,
    backgroundColor: '#F8F9FA',
    width: 300,
    paddingVertical: 12,
    paddingLeft: 10, 

    borderRadius: 8,
    borderWidth: 1, borderColor: '#FFC470'}}
        >
  <View style={{flexDirection: 'row', }}>

    {/* 체크 버튼 */}
    <TouchableOpacity
        style={[styles.save, {backgroundColor: isPressed ? '#FEA655' : '#ccc'} ]} 
        onPress={allAgree}> 
        <Image style={{left: 2, top: 3}} source={require('../assets/icons/checkIcon.png')}/>
      </TouchableOpacity>

        <Text style={{color: '#000', left: 35, marginRight: 5 }}>전체 동의</Text>
        <Text style={{color: '#828282', left: 35, }}>(선택 포함)</Text>
    </View>
      </TouchableOpacity>
  <TouchableOpacity
        style={{top: 100, right: 25, 
    backgroundColor: '#F8F9FA',
    width: 250,
    paddingVertical: 10,
    paddingLeft: 10, 
    marginTop: 10,
    borderRadius: 8,}}
        >
  <View style={{flexDirection: 'row', }}>

      {/* 체크 버튼 */}
<TouchableOpacity
        style={[styles.save, {backgroundColor: isPressed ? '#FEA655' : '#ccc'} ]} 
        onPress={allAgree}> 
        <Image style={{left: 2, top: 3}} source={require('../assets/icons/checkIcon.png')}/>
      </TouchableOpacity>

        <Text style={{color: '#000', left: 33, marginRight: 5 }}>만 14세 이상 이용 동의</Text>
        <Text style={{color: '#FFC470', left: 35, }}>(필수)</Text>

    </View>
      </TouchableOpacity>
  <TouchableOpacity
        style={{top: 100, right: 25, 
    backgroundColor: '#F8F9FA',
    width: 250,
    paddingVertical: 10,
    paddingLeft: 10, 

    borderRadius: 8,}}
        >
  <View style={{flexDirection: 'row', }}> 
    {/* 체크 버튼 */}
<TouchableOpacity
        style={[styles.save, {backgroundColor: isPressed ? '#FEA655' : '#ccc'} ]} 
        onPress={allAgree}> 
        <Image style={{left: 2, top: 3}} source={require('../assets/icons/checkIcon.png')}/>
      </TouchableOpacity>

        <Text style={{color: '#000', left: 33, marginRight: 5 }}>서비스 이용약관 동의</Text>
        <Text style={{color: '#FFC470', left: 35, }}>(필수)</Text>
        <TouchableOpacity style={{position: 'absolute', left: 260, top: 0, }} 
        onPress={() => navigation.navigate('Agreement1')}>
        <Text style={{ color: '#979797', fontSize: 20, bottom: 4}}></Text>
        </TouchableOpacity>
    </View>
      </TouchableOpacity>
  <TouchableOpacity
        style={{top: 100, right: 25, 
    backgroundColor: '#F8F9FA',
    width: 250,
    paddingVertical: 10,
    paddingLeft: 10, 

    borderRadius: 8,}}
        >
  <View style={{flexDirection: 'row', }}>

    {/* 체크 버튼 */}
<TouchableOpacity
        style={[styles.save, {backgroundColor: isPressed ? '#FEA655' : '#ccc'} ]} 
        onPress={allAgree}> 
        <Image style={{left: 2, top: 3}} source={require('../assets/icons/checkIcon.png')}/>
      </TouchableOpacity>

        <Text style={{color: '#000', left: 33, marginRight: 5 }}>개인정보 수집 및 이용 동의</Text>
        <Text style={{color: '#FFC470', left: 35, }}>(필수)</Text>
        <TouchableOpacity style={{position: 'absolute', left: 260, top: 0, }}
        onPress={() => navigation.navigate('Agreement2')}>
        <Text style={{ color: '#979797', fontSize: 20, bottom: 4}}></Text>
        </TouchableOpacity>
    </View>
      </TouchableOpacity>
  <TouchableOpacity
        style={{top: 100, right: 25, 
    backgroundColor: '#F8F9FA',
    width: 250,
    paddingVertical: 10,
    paddingLeft: 10, 

    borderRadius: 8,}}
        >
  <View style={{flexDirection: 'row', }}>

      {/* 체크 버튼 */}
<TouchableOpacity
        style={[styles.save, {backgroundColor: isPressed ? '#FEA655' : '#ccc'} ]} 
        onPress={allAgree}> 
        <Image style={{left: 2, top: 3}} source={require('../assets/icons/checkIcon.png')}/>
      </TouchableOpacity>

        <Text style={{color: '#000', left: 33, marginRight: 5 }}>개인정보 수집 및 이용 동의</Text>
        <Text style={{color: '#979797', left: 35, }}>(선택)</Text>
        <TouchableOpacity style={{position: 'absolute', left: 260, top: 0, }}
        onPress={() => navigation.navigate('Agreement3')}>
        <Text style={{ color: '#979797', fontSize: 20, bottom: 4}}></Text>
        </TouchableOpacity>
    </View>
      </TouchableOpacity>
  <TouchableOpacity
        style={{top: 100, right: 25, 
    backgroundColor: '#F8F9FA',
    width: 250,
    paddingVertical: 10,
    paddingLeft: 10, 

    borderRadius: 8,}}
        >
  <View style={{flexDirection: 'row', }}>

    {/* 체크 버튼 */}
<TouchableOpacity
        style={[styles.save, {backgroundColor: isPressed ? '#FEA655' : '#ccc'} ]} 
        onPress={allAgree}> 
        <Image style={{left: 2, top: 3}} source={require('../assets/icons/checkIcon.png')}/>
      </TouchableOpacity>

        <Text style={{color: '#000', left: 33, marginRight: 5 }}>이메일 마케팅 수신 동의</Text>
        <Text style={{color: '#979797', left: 35, }}>(선택)</Text>
    </View>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.buttonS}
        onPress={() => navigation.navigate('SignupPg')}>
        <Text style={styles.buttonText}>동의하고 계속하기</Text>
      </TouchableOpacity>
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8F9FA', // 배경색상 추가
  },

  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'NanumGothic',
  },

    back: {
    top: 42,
    right: 163,
  },
  backBTN: {
    fontSize: 25,
  },

  //signuppg
  topTitle: {
    fontSize: 24,
    top: 11,
  },
    agreeTitle: {
    fontSize: 21,
    top: 11,
  },

  buttonS: {
    top: 153,
    backgroundColor: '#FEA655',
    paddingVertical: 10,
    paddingHorizontal: 48,
    borderRadius: 25,
    marginBottom: 20,
  },
  
});





export default SignupAgree;
