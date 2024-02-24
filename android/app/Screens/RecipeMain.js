import firestore from "@react-native-firebase/firestore";
import React, { useState, useEffect } from 'react';


import {
  Text,
  View,
  TouchableOpacity, ScrollView, 
  StyleSheet, Image
} from 'react-native';


{/* 음식재료 */}
const Ingred = props => {

  return (

 <View>

  <View style={{ 
    marginHorizontal: 2,
    right: 40,
    alignItems: 'center',
    top: 2,
    }}>
    <Text style={{color: '#000', marginHorizontal: 2,
        fontSize: 14, }}>
        {props.ingred}
    </Text>     
  </View>
 <View style={{ left: 47, alignItems: 'center',
    }}>
    <Text style={{ color: '#000', marginHorizontal: 2,
        fontSize: 14, bottom: 17 }}>
        {props.amount} </Text>
  </View>


</View>
  );
};


const RecipeMain = ({ navigation, route }) => {
    const [recipeName, setRecipeName] = useState('');
    const [recipeTime, setRecipeTime] = useState([]);
    const [recipeIngredients, setRecipeIngredients] = useState([]);
    const [recipeImage, setRecipeImage] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [recipeDifficulty, setRecipeDifficulty] = useState();
    useEffect(() => {
        const fetchRecipeInfo = async () => {
          try {
            const { recipeId } = route.params;
            const recipeDoc = await firestore().collection('recipes').doc(recipeId).get();
    
            if (recipeDoc.exists) {
              const recipeData = recipeDoc.data();
              setRecipeName(recipeData.recipe_name);
              setRecipeTime(recipeData.recipe_time);
              setRecipeIngredients(recipeData.recipe_ingredients);
              setRecipeImage(recipeData.recipe_image_url);
              setRecipeDifficulty(recipeData.recipe_difficulty);
            } else {
              console.error('Recipe not found!');
            }
          } catch (error) {
            console.error('Failed to fetch recipe: ', error);
          }
        };
    
        fetchRecipeInfo();
        fetchUserBookmark();
      }, []);

      const fetchUserBookmark = async () => {
        try {
          const userId = 'user_id_here'; // 사용자의 ID를 여기에 입력하세요.
          const userDoc = await firestore().collection('users').doc(userId).get();
          const userData = userDoc.data();
          const userBookmarks = userData?.user_bookmark || [];
          setIsBookmarked(userBookmarks.includes(route.params.recipeId));
        } catch (error) {
          console.error('Error fetching user bookmark:', error);
        }
      };

      const toggleBookmark = async () => {
        try {
          const userId = 'user_id_here'; // 사용자의 ID를 여기에 입력하세요.
          const userRef = firestore().collection('users').doc(userId);
          const userDoc = await userRef.get();
          const userBookmarks = userDoc.data()?.user_bookmark || [];
          const updatedBookmarks = isBookmarked
            ? userBookmarks.filter(id => id !== route.params.recipeId)
            : [...userBookmarks, route.params.recipeId];
    
          await userRef.update({ user_bookmark: updatedBookmarks });
          setIsBookmarked(!isBookmarked);
        } catch (error) {
          console.error('Error toggling bookmark:', error);
        }
      };

      const renderIngredients = () => {
        return Object.entries(recipeIngredients).map(([ingredient, amount], index) => (
          <View style={{flexDirection: 'row',  }} key={index}>
              <View style={{ 
              marginHorizontal: 2,
              right: 40,
              alignItems: 'center',
              top: 2,
              }}>
                <Text style={{color: '#000', marginHorizontal: 2,
                    fontSize: 14, }}>
                    {ingredient}
                </Text>     
            </View>
           <View style={{ left: 47, alignItems: 'center',
              }}>
              <Text style={{ color: '#000', marginHorizontal: 2,
                  fontSize: 14, bottom: 17 }}>
                  {amount} </Text>
            </View>
        </View>
        ));
      };


    
  {/* 북마크 */}
const [book, setBook] = useState({
    bookmark: false,
    bookmarkFill: false,
  });

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
          return require('../assets/icons/star1.png');
        case 2:
          return require('../assets/icons/star2.png');
        case 3:
          return require('../assets/icons/star3.png');
        default:
          return require('../assets/icons/star1.png');
    } 
  };

const photoImage = (recipeImage) => {
  if(recipeImage==''){
    return require('../assets/icons/photoNotReady.png');
  }
  else{
    return {uri: recipeImage};
  }
};

  return (
  <View style={styles.container}>

      {/* 사진추가 */}
      <View
        style={{top: 35,
    marginBottom: 20, 
    paddingTop: 4, borderRadius: 7, position: 'absolute', backgroundColor: '#EDEDED', width: 350, height: 139, justifyContent: 'center', alignItems: 'center'}} >
    <Image source={photoImage()}/>
    </View>


{/*<ScrollView style={{top: 100, height: 'auto'}}> */}

{/*텍스트박스 어떻게 한쪽으로만 늘어나게하지 */}
      <View
        style={{
          top: 190, right: 130, marginLeft: 10,
        backgroundColor: '#FFFFFF',
        
        borderRadius: 10,
        paddingLeft: 6, paddingRight: 6, paddingTop: 7, paddingBottom: 7, 
        marginBottom: 17, 
          }}
> 
{/* 음식이름 */}
<Text style={{color: '#000', marginHorizontal: 5,
        textDecorationLine: 'underline', textDecorationColor: '#FEA655', fontSize: 20, 
        }}>{recipeName}</Text>

    <TouchableOpacity style={{position: 'absolute', left: 315, bottom: 10}} onPress={() => handleBookmarkClick('bookmarkFill')}>
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
    <Image style={{right: 180, top: 10, zIndex: 2, position: 'absolute' , }} source={require('../assets/icons/bowl.png')}/>


<ScrollView style={{
    width: 215,
    height: 'auto', 
    top: 20,
    marginBottom: 20
    }}>      
      <View style={styles.ingredientsContainer}>
        {renderIngredients()}
      </View>

  </ScrollView>      
      </View>
<View
        style={{ left: 115, bottom: 140,
        backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    width: 112,
    height: 150,
    borderRadius: 10,
    marginBottom: 15, }}>
      <View style={{flexDirection: 'row', 
    justifyContent: 'center', top: 78,
          color: '#000',}}>
        <Image style={{ left: 45, bottom: 98, position: 'absolute', alignItems: 'center', }} source={require('../assets/icons/clock.png')}/>

      {/* 시간 */}
        <Text style={{
          color: '#000', 
        fontSize: 17, 
        textAlign: 'center',
        bottom: 15
        }}>{recipeTime[0] !== 0 && `${recipeTime[0]}시간 `}{recipeTime[1] !== 0 && `${recipeTime[1]}분`}{'\n'}이내</Text>
      </View>
  </View>

      <View
        style={{ left: 115, bottom: 140,
        backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    width: 112,
    height: 166,
    borderRadius: 10, }}
      >
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
        style={styles.button}
        onPress={() => navigation.navigate('RecipeDetail')}>
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
    backgroundColor: '#F8F9FA', width: '100%',
    height: '100%',
  },

  row: {
    position: 'absolute',
    top: 515,
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


export default RecipeMain;
