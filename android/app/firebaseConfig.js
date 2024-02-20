// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBZq36G0AMz4dh_hlVS7X9xY2aXGCZLmVo",
  authDomain: "youth-truffle.firebaseapp.com",
  projectId: "youth-truffle",
  storageBucket: "youth-truffle.appspot.com",
  messagingSenderId: "295038915158",
  appId: "1:295038915158:android:0f78a90b8721647520e1f7",
  databaseURL: "https://firestore.googleapis.com/v1/projects/youth-truffle/databases/(default)/documents",
};
export { auth, firebaseConfig };