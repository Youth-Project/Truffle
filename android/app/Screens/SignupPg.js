import React, { useState, useEffect } from 'react';
import {
  NavigationContainer,
  Text,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet, 
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";


function SignupPg() {

  const signUp = async () => {
    try {
      if (password !== password2){
        setPasswordContent('비밀번호가 일치하지않습니다');
        return;
      }
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      const today = new Date().toISOString().split('T')[0];
      await firestore().collection('users').doc(user.uid).set({
        user_email: email,
        user_password: password,
        user_budget: 0,
        user_id: user.uid,
        eatOut: [],
        shopping: [],
        delivery: [],
        user_bookmark: [],
        user_recipe: []
      });

      await firestore().collection(user.uid).doc(today).set({
        amount:0
      });
      navigation.navigate('LoginpgStack');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

{/* eye 버튼 */}
const [eye, setEye] = useState({
    eye: false,
    eyeOn: false,
  });
  const [isSecure, setIsSecure] = useState(true);

  const handleEyeClick = (buttonName) => {
    setEye((prevStates) => ({
      ...prevStates,
      [buttonName]: !prevStates[buttonName],
    }));
    setIsSecure((prevIsSecure) => !prevIsSecure);
  }; 

  const getImageForEye = (buttonName) => {
    if (eye[buttonName]) {
      switch (buttonName) {
        case 'eyeOpen':
          return require('../assets/icons/eyeOn.png');
        default:
          return require('../assets/icons/eye.png');
      }
    } 
    else{
      return require('../assets/icons/eye.png');
    }
  };

  {/* eye2 버튼 */}
const [eye2, setEye2] = useState({
    eye2: false,
    eyeOn2: false,
  });
  const [isSecure2, setIsSecure2] = useState(true);

  const handleEyeClick2 = (buttonName) => {
    setEye2((prevStates) => ({
      ...prevStates,
      [buttonName]: !prevStates[buttonName],
    }));
    setIsSecure2((prevIsSecure) => !prevIsSecure);
  }; 

  const getImageForEye2 = (buttonName) => {
    if (eye2[buttonName]) {
      switch (buttonName) {
        case 'eyeOpen':
          return require('../assets/icons/eyeOn.png');
        default:
          return require('../assets/icons/eye.png');
      }
    } 
    else{
      return require('../assets/icons/eye.png');
    }
  };


{/* catch 오류문구 */}
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [passwordContent, setPasswordContent] = useState('');
  const [passwordContent1, setPasswordContent1] = useState('');
  const [email, setEmail] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [validation, setValidation] = useState("");

const validateEmail = email => {
  {/* 이메일 조건설정 */}
    const regex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
    return regex.test(email);
}
  const handleEmailChange = (val) => {
    setEmail(val);

    if (val && !validateEmail(val)) {
      setEmailContent('허용되지 않는 이메일 형식입니다.');
    } 
    else {
      setEmailContent('');
    }
  };

{/* 비밀번호 조건설정 */}
  const reg = /^(?=.*[a-zA-Z])(?=.*[\W_])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
  const pwCondition = (password) => {
    return reg.test(password);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);

    if (value && !pwCondition(value)) {
      setPasswordContent1('8-15자 이내의 영문, 숫자, 특수문자를 조합해주세요.');
    } else {
      setPasswordContent1('');
    }
  };

  const handlePassword2Change = (value) => {
    setPassword2(value);

    if (password !== value) {
      setPasswordContent('비밀번호가 일치하지 않습니다');
    } else {
      setPasswordContent('');
    }
  };


  return(
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.back}
        onPress={() => navigation.navigate('LoginpgStack')}>
        <Text style={styles.backBTN}> 〈 </Text>
      </TouchableOpacity>

      <Text style={styles.topTitle}>회원가입</Text>
      
      <TextInput
        style={styles.inputS}
        placeholder="이메일"
        keyboardType="email"
        val={email}
          onChangeText={handleEmailChange}
      />

<Text style={styles.errTxt}>{validation}</Text>
    <Text style={{top: 232,
    fontSize: 12,
    color: '#ff0000', position: 'absolute'}}>{emailContent}</Text>

    <View>
      <TextInput
        style={styles.inputS}
        setPassword={setPassword}
        placeholder="비밀번호"
        keyboardType="email"
        secureTextEntry={isSecure}
          value={password}
          onChangeText={handlePasswordChange}
      />
      {/* eye버튼 */}
      <TouchableOpacity style={{ position: 'absolute', right: 60, }} onPress={() => handleEyeClick('eyeOpen')}>
        <Image style={{left: 50, top: 137 }} source={getImageForEye('eyeOpen')}/>
    </TouchableOpacity>
      </View>
      <Text style={styles.errTxt}>{passwordContent1}</Text>

    <View>
      <TextInput
        style={styles.inputS}
        placeholder="비밀번호 확인"
        keyboardType="email"
        secureTextEntry={isSecure2}
          value={password2}
          onChangeText={handlePassword2Change}
      />
      {/* eye버튼 */}
      <TouchableOpacity style={{ position: 'absolute', right: 60, }} onPress={() => handleEyeClick2('eyeOpen')}>
        <Image style={{left: 50, top: 137 }} source={getImageForEye2('eyeOpen')}/>
    </TouchableOpacity>
      </View>
      <Text style={styles.errTxt}>{passwordContent}</Text>

      <TouchableOpacity
        style={styles.buttonS}
        onPress={signUp}
        >
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.log}
        onPress={() => navigation.navigate('LoginpgStack')}>
        <Text style={styles.saveTxt}>이미 계정이 있나요?  로그인하기</Text>
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
  title: {
    fontSize: 40,
    top: 47,
    marginBottom: 211,
    fontFamily: 'NanumGothic',
    color: '#000', // 글자색상 추가
  },

  input: {
    fontSize: 15,
    borderWidth: 0.5,
    height: 28,
    width: 232,
    marginBottom: 30,
    color: '#878787',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth:0,
    paddingVertical: 0
  },
  save: {
    position: 'absolute',
    left: 85,
    top: 375,
    width: 15,
    height: 15, 
    borderRadius: 25,
    marginBottom: 20,
  },
  saveTxt: {
    fontSize: 12,
    color: '#757575',
  },
  signUp: {
    top: 105,
    right: 100,
    paddingHorizontal: 100,
  },
  reset: {
    top: 90,
    left: 100,
    paddingHorizontal: 100,
  },

  button: {
    top: 85,
    backgroundColor: '#FEA655',
    paddingVertical: 10,
    paddingHorizontal: 48,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'NanumGothic',
  },

  //budgetpg
  introBudget: {
    fontSize: 20,
    top: 149,
    marginBottom: 211,
    fontFamily: 'NanumGothic',
    color: '#000', // 글자색상 추가
  },
  subTitle: {
    color: '#727272',
    bottom: 45,
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
    top: 12,
  },
  log: {
    top: 193,

  },
  inputS: {
    fontSize: 15,
    borderWidth: 0.5,
    height: 28,
    width: 232,
    top: 130,
    marginBottom: 40,
    color: '#878787',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth:0,
    paddingVertical: 0
  },
  buttonS: {
    top: 183,
    backgroundColor: '#FEA655',
    paddingVertical: 10,
    paddingHorizontal: 48,
    borderRadius: 25,
    marginBottom: 20,
  },
  
  //success
  center: {
    fontSize: 20,
    top: 20,
    marginBottom: 55,
    textAlign: 'center',
  },

  //forgotPW
  inputP: {
    fontSize: 15,
    borderWidth: 0.5,
    height: 28,
    width: 232,
    top: 80,
    marginBottom: 40,
    color: '#878787',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth:0,
    paddingVertical: 0
  },
  buttonP: {
    top: 93,
    backgroundColor: '#FEA655',
    paddingVertical: 10,
    paddingHorizontal: 48,
    borderRadius: 25,
  },
  midButton: {
    right: 48,
    top: 64,
    backgroundColor: '#FEA655',
    paddingVertical: 10,
    paddingHorizontal: 23,
    borderRadius: 25,
  },
  resend: {
    top: 33,
    left: 75,
  },
  inputRe: {
    fontSize: 15,
    borderWidth: 0.5,
    height: 28,
    width: 160,
    top: 82,
    right: 35,
    marginBottom: 10,
    color: '#878787',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth:0,
    paddingVertical: 0
  },
  smallButton: {
    left: 85,
    top: 36,
    backgroundColor: '#FEA655',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
  },
  passwordContent: {
    top: 50,
    fontSize: 12,
    color: '#ff0000',
  },
  errTxt: {
    top: 100,
    fontSize: 12,
    color: '#ff0000',
  },
});

export default SignupPg;
