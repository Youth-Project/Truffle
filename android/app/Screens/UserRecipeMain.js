import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import firestore from "@react-native-firebase/firestore";

const UserRecipeMain = ({ navigation, route }) => {
  const [recipeName, setRecipeName] = useState('');
  const [recipeTime, setRecipeTime] = useState([]);
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [recipeImage, setRecipeImage] = useState(null);
  const [book, setBook] = useState([]);
  const [recipeDifficulty, setRecipeDifficulty] = useState();
  useEffect(() => {
    const fetchRecipeInfoU = async () => {
      try {
        const { recipeId } = route.params;
        const userRecipeDoc = await firestore().collection('users').doc(xxvkRzKqFcWLVx4hWCM8GgQf1hE3).get();

        if (recipeDoc.exists) {
          const uRecipeData = userRecipeDoc.data();
          const uNameData = uRecipeData.user_recipe_name;
          setRecipeName(uNameData);
          setRecipeTime(uRecipeData.user_recipe_time);
          setRecipeIngredients(uRecipeData.user_recipe_ingredients);
          setRecipeImage(uRecipeData.user_recipe_image);
          setRecipeDifficulty(uRecipeData.user_recipe_difficulty);
        } else {
          console.error('Recipe not found!');
        }
      } catch (error) {
        console.error('Failed to fetch recipe: ', error);
      }
    };

    fetchRecipeInfo();
  }, []);

  const handleBookmarkClick = (buttonName) => {
    setBook((prevStates) => ({
      ...prevStates,
      [buttonName]: !prevStates[buttonName],
    }));
  }; 

  const getImageForBookmark = (buttonName) => {
    if (book[buttonName]) {
      switch (buttonName) {
        case 'bookmarkFill':
          return require('../assets/icons/bookmarkFill.png');
        default:
          return require('../assets/icons/bookmark.png');
      }
    } 
    else{
      return require('../assets/icons/bookmark.png');
    }
  };


  const getImageForButton = ({recipeDifficulty}) => {
      switch (recipeDifficulty) {
        case 1:
          return require('./assets/icons/star1.png');
        case 2:
          return require('./assets/icons/star2.png');
        case 3:
          return require('./assets/icons/star3.png');
        default:
          return require('./assets/icons/star1.png');
    } 
  };

  {/* 사진없을때 */}
  const photoImage = () => {
  if(recipeImage==''){
    return require('./assets/icons/photoNotReady.png');
  }
  else{
    return {uri: recipeImage};
  }
};
  
  return (
    <View contentContainerStyle={styles.container}>
            {/* 사진추가 */}
      <TouchableOpacity
        style={{top: 35,
    marginBottom: 20, 
    paddingTop: 4, borderRadius: 7, position: 'absolute', backgroundColor: '#EDEDED', width: 350, height: 139, justifyContent: 'center', alignItems: 'center'}} >
    <Image source={photoImage()}/>
    </TouchableOpacity>

      <View style={styles.titleContainer}>
        {/* 음식이름 */}
        <Text style={{color: '#000', marginHorizontal: 5,
        textDecorationLine: 'underline', textDecorationColor: '#FEA655', fontSize: 20, 
        }}>{recipeName}</Text>
  
        <TouchableOpacity style={styles.bookmarkButton} onPress={() => handleBookmarkClick('bookmarkFill')}>
          <Image source={getImageForBookmark('bookmarkFill')}/>
        </TouchableOpacity>
      </View>
  
  {/* 재료 & 양 */}
<View
        style={{ right: 62, top: 190,
        backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    width: 215,
    height: 330,
    borderRadius: 10, 
    }}>
    <Image style={{right: 180, top: 10, zIndex: 2, position: 'absolute' , }} source={require('./assets/icons/bowl.png')}/>

<ScrollView style={{
    width: 215,
    height: 'auto', 
    top: 20,
    marginBottom: 20
    }}>
  <View style={{flextDirection: 'row',  }}>
  <View style={{ 
    marginHorizontal: 2,
    right: 40,
    alignItems: 'center',
    top: 2,
    }}>
    <Text style={{color: '#000', marginHorizontal: 2,
        fontSize: 14, }}>
{recipeIngredients.ingred}
    </Text>     
  </View>
 <View style={{ left: 47, alignItems: 'center',
    }}>
    <Text style={{ color: '#000', marginHorizontal: 2,
        fontSize: 14, bottom: 18 }}>
{recipeIngredients.amount} </Text>
  </View>
</View>    
  </ScrollView>      
      </View>

  <View style={{ left: 115, bottom: 140,
        backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    width: 112,
    height: 150,
    borderRadius: 10,
    marginBottom: 15, }}>
      <View style={styles.timeContainer}>
        <Image source={require('../assets/icons/clock.png')} style={styles.clockIcon}/>
        {/* 시간 */}
        <Text style={{
          color: '#000', 
          fontSize: 17, 
          textAlign: 'center',
          bottom: 15
        }}>{recipeTime[0] !== 0 && `${recipeTime[0]}시간 `} {recipeTime[1] !== 0 && `${recipeTime[1]}분`}{'\n'}이내
        </Text>
      </View>
    </View>

{/* 난이도 */}
    <View
        style={{ left: 115, bottom: 140,
        backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    width: 112,
    height: 166,
    borderRadius: 10, }}
        <Text style={{
          top: 5,
          color: '#000000', 
        fontSize: 18, 
        textAlign: 'center',
        }}>
        난이도</Text>
  {/* 별컴포넌트 */}
  <View style={{width: 24, height: 24, backgroundColor: 'transparent', marginLeft: 10, marginTop: 50, }}
        onPress={() => handleSmallButtonClick({recipeDifficulty})}        >
        <Image source={getImageForButton({recipeDifficulty})} />
  </View>
  
    </View>
        

      <View style={styles.row}>
        <TouchableOpacity
          style={{ top: 85, borderWidth: 1, borderColor: '#CCCCCC', paddingVertical: 10, width: 140, borderRadius: 25, marginBottom: 20 }}
          onPress={() => navigation.goBack()}>
          <Text style={{ color: '#CCCCCC', fontSize: 15, fontWeight: 'bold', textAlign: 'center', fontFamily: 'NanumGothic' }}>
            뒤로가기
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('RecipeDetail', { recipeId: route.params.recipeId })}>
          <Text style={styles.buttonText}>조리하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#F8F9FA',
    width: '100%',
    height: '100%',
  },  
  
  titleContainer: {
    top: 190, right: 130, marginLeft: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingLeft: 6, 
    paddingRight: 6, 
    paddingTop: 7, 
    paddingBottom: 7, 
    marginBottom: 17, 
  },

  bookmarkButton: {
    position: 'absolute', 
    left: 315, 
    bottom: 10
  },

  timeContainer: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    top: 78,
    color: '#000',
  },

  
  timeContainer: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    top: 78,
    color: '#000',
  },

  clockIcon: {
    position: 'absolute', 
    left: 315, 
    bottom: 10
  },
  
  row: {
    position: 'absolute',
    top: 530,
    flexDirection: 'row', 
    justifyContent: 'space-evenly',
    gap: 25,
  },

  button: {
    top: 85,
    width: 140,
    backgroundColor: '#FEA655',
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 20,
  },

  buttonText: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'NanumGothic',
  },
});

export default UserRecipeMain;