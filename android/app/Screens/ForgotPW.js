import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

function ForgotPW({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordContent, setPasswordContent] = useState('');
  const [passwordContent1, setPasswordContent1] = useState('');

  const handleEmailChange = (val) => setEmail(val);
  
  const handlePasswordChange = (val) => {
    setPassword(val);
    if (val.length < 8) {
      setPasswordContent1('8-15자 이내의 영문, 숫자, 특수문자를 조합해주세요.');
    } else {
      setPasswordContent1('');
    }
  };
  
  const handlePassword2Change = (val) => {
    setConfirmPassword(val);

    if (password !== val) {
      setPasswordContent('비밀번호가 일치하지 않습니다');
    } else {
      setPasswordContent('');
    }
  };

  const handlePasswordReset = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', '비밀번호가 일치하지 않습니다');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', '8-15자 이내의 영문, 숫자, 특수문자를 조합해주세요.');
      return;
    }

    const userId = auth().currentUser;
    updatePassword(password, userId);
  };

const updatePassword = async (password, userId) => {
  try {
    if (userId) {
      await user.updatePassword(password);
      await firestore().collection('users').doc(userId).update({ user_password: password });
      console.log('비밀번호가 변경되었습니다.');
    } else {
      console.error('로그인 한 사용자가 없습니다.');
    }
  } catch (error) {
    console.error('비밀번호를 변경하는데 실패했습니다.:', error);
  }
};


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backBTN}> 〈 </Text>
      </TouchableOpacity>
      <Text style={styles.topTitle}>비밀번호 재설정</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={handleEmailChange}
        placeholder="이메일"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={handlePasswordChange}
        placeholder="비밀번호"
        secureTextEntry={true}
      />
      <Text style={styles.passwordContent}>{passwordContent1}</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={handlePassword2Change}
        placeholder="비밀번호 확인"
        secureTextEntry={true}
      />
      <Text style={styles.passwordContent}>{passwordContent}</Text>
      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>비밀번호 변경</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  back: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  backBTN: {
    fontSize: 25,
  },
  topTitle: {
    fontSize: 24,
    marginTop: 50,
    marginBottom: 30,
  },
  input: {
    fontSize: 15,
    borderWidth: 0.5,
    height: 40,
    width: 300,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#FEA655',
    paddingVertical: 10,
    paddingHorizontal: 48,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  passwordContent: {
    fontSize: 12,
    color: '#ff0000',
  },
});

export default ForgotPW;
