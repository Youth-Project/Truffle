import React, { useState, useEffect, } from 'react';
import { View, Text, TouchableOpacity , StyleSheet, TextInput, Modal, ScrollView,Switch,Image} from 'react-native';
import firestore from "@react-native-firebase/firestore";
import { CurrentRenderContext } from '@react-navigation/native';
import BookmarkFill from '../assets/icons/bookmarkFill.png';
import Bookmark from '../assets/icons/bookmark.png';

const RecipeTab = ({navigation}) => {
  const [showUserRecipes, setShowUserRecipes] = useState(false);
  const [recipeData, setRecipeData] = useState([]);
  const [refrigeratorIngredients, setRefrigeratorIngredients] = useState([]);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
    // Filtering recipes based on the search query
    const filteredData = recipeData.filter((recipe) =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  useEffect(() => {
    fetchRecipeData();
    fetchBookmarkedRecipes();
  }, []);

const handleToggleSwitch = () => {
  setShowUserRecipes((prev) => !prev);
};

const orderByKorean = async () => {
  const koreanOrder = await firestore().collection('recipe').orderBy('recipeName').get();
  return koreanOrder.docs.map((doc) => doc.data());
};

// 부족한 재료 갯수가 적은 순으로 정렬하는 함수
const refrigeratorOrderByLack = async (refrigeratorIngredients) => {
  const lackOrder = await firestore().collection('recipe').get();

  const sortedRecipe = lackOrder.docs
    .map((recipeDoc) => {
      const recipeDocData = recipeDoc.data();
      const lack = compareIngredients(refrigeratorIngredients, recipeDocData.recipe_ingredients);

      return {
        recipeId: recipeDoc.recipeId,
        lackCount: lack.length,
      };
    })
    .sort((a, b) => a.lackCount - b.lackCount);

  return sortedRecipe.map((recipeDocData) => ({
    recipeId: recipeDocData.recipeId,
    lackCount: recipeDocData.lackCount,
  }));
};


const fetchedRecipes = [];
const fetchRecipeData = async () => {
  try {
    const snapshot = await firestore().collection('recipes').get();
    snapshot.forEach((doc) => {
      const recipeData = doc.data();
      fetchedRecipes.push({
        id: doc.id,
        name: recipeData.recipe_name,
        image: recipeData.recipe_image,
        time: recipeData.recipe_time,
      });
    });
    setRecipeData(fetchedRecipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
  }
};

const displayLackingIngredients = async (recipeId, recipeIngredients) => {
  const lackingIngredients = compareIngredients(refrigeratorIngredients, recipeIngredients);
  if (lackingIngredients.length > 0){
    try{
      const lackId = await addLackToCollection({ recipeId, lackingIngredients });
      console.log('Lack added with ID: ', lackId);
    } catch (error) {
      console.error('Error adding lack: ', error);
    }
  }
  return lackingIngredients.join(', ');
};
  
const handleSortOrder = async (orderType) => {
  switch (orderType) {
    case 'korean':
      const koreanOrder = await orderByKorean();
      setRecipeData(koreanOrder);
      break;
    case 'lack':
      const lackOrder = await refrigeratorOrderByLack(refrigeratorIngredients);
      setRecipeData(lackOrder);
      break;
    default:
      break;
  }
};

const photoImage = () => {
  if(recipe.image==''){
    return require('../assets/icons/photoNotReady.png');
  }
  else{
    return {uri: recipe.image};
  }
};

 const [modalVisible, setModalVisible] = useState(false);

{/* 내 레시피만 보기 */}
const [my, setMy] = useState({
    check: false,
    checkFill: false,
  });

  const handleCheckboxClick = (buttonName) => {
    setMy((prevStates) => ({
      ...prevStates,
      [buttonName]: !prevStates[buttonName],
    }));
  }; 

  const getImageForCheckbox = (buttonName) => {
    if (my[buttonName]) {
      switch (buttonName) {
        case 'checkFill':
          return require('../assets/icons/checkFill.png');
        default:
          return require('../assets/icons/check.png');
      }
    } 
    else{
      return require('../assets/icons/check.png');
    }
  };

   {/* 조리가능순 버튼 (난이도 재활용)*/}
   const [star, setStar] = useState({
    button1: false,
    button2: false,
  });

  const handleSmallButtonClick = (buttonName) => {
    setStar((prevStates) => ({
      ...prevStates,
      [buttonName]: !prevStates[buttonName],
    }));
  }; 

  const getImageForButton = (buttonName) => {
    if (star[buttonName]) {
      switch (buttonName) {
        case 'button2':
          return require('../assets/icons/recommend.png');
        default:
          return require('../assets/icons/koreanOrder.png');
      }
    } 
    else{
      return require('../assets/icons/koreanOrder.png');
    }
  };


  {/* bookmark */}
  const fetchBookmarkedRecipes = async () => {
    try {
      const userId = 'xxvkRzKqFcWLVx4hWCM8GgQf1hE3';
      const userDoc = await firestore().collection('users').doc(userId).get();
      const userData = userDoc.data();
      const bookmarkedRecipeIds = userData?.user_bookmark || [];
      setBookmarkedRecipes(bookmarkedRecipeIds);
    } catch (error) {
      console.error('Error fetching bookmarked recipes:', error);
    }
  };

  const toggleBookmark = async (recipeId, newBookmarkStatus) => {
    try {
      const userId = 'xxvkRzKqFcWLVx4hWCM8GgQf1hE3';
      const userBookmarkRef = firestore().collection('users').doc(userId);
      const userBookmarkSnapshot = await userBookmarkRef.get();
      const userData = userBookmarkSnapshot.data();
      let updatedBookmarks = userData?.user_bookmark || [];

      if (newBookmarkStatus && !updatedBookmarks.includes(recipeId)) {
        updatedBookmarks.push(recipeId);
      } else if (!newBookmarkStatus && updatedBookmarks.includes(recipeId)) {
        updatedBookmarks = updatedBookmarks.filter(id => id !== recipeId);
      }

      await userBookmarkRef.update({ user_bookmark: updatedBookmarks });
      setBookmarkedRecipes(updatedBookmarks);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const isBookmarked = (recipeId) => {
    console.log(bookmarkedRecipes.includes(recipeId))
    return bookmarkedRecipes.includes(recipeId);
  };

  const handleToggleBookmark = async (recipeId) => {
    const newBookmarkStatus = !isBookmarked(recipeId);
    toggleBookmark(recipeId, newBookmarkStatus);
  };

  const [book, setBook] = useState({
    bookmarkFill: false,
});

const handleBookmarkClick = () => {
    setBook((prevBook) => ({
        ...prevBook,
        bookmarkFill: !prevBook.bookmarkFill,
    }));
};

const getImageForBookmark = () => {
    return isBookmarked(recipe.id) 
        ? require('../assets/icons/bookmark.png')
        : require('../assets/icons/bookmarkFill.png');
};

  return (
    <View style={styles.container}>
      <View style = {styles.searchArea}>
        <View style = {styles.searchWrapper}>
          
          <TextInput
            style={{  width: '100%', height: '100%', 
            color: 'black', fontSize: 14, fontFamily: 'NanumGothic',
            backgroundColor: 'white', textAlign: 'center', borderRadius: 13 }}
            placeholder="검색"
            onChangeText={(text) => setSearchQuery(text)}
            value={searchQuery}
            keyboardType="default"
          />
          <View style = {styles.searchImg}>
            <Image source={require('../assets/icons/search.png')}/>
          </View>
        </View>
      </View>

  {/* 동그라미 추가 버튼 */}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddRecipeMain')}>
        <Text style={{color: 'white', textAlign: 'center', fontSize: 47, bottom: 7, }}>+</Text>
      </TouchableOpacity>  
        


      <ScrollView style={styles.containerScroll}>
        <View style={styles.row}>
          {/* Recipe list */}
          {filteredData.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              style={styles.post}
              onPress={() => navigation.navigate('RecipeMain', { recipeId: recipe.id })}>
         <View style={{width: 132, height: 70, left: 12, top: 9, borderRadius: 7, backgroundColor: '#ccc', alignItems: 'center', justifyContent: 'center'}}>
         <Image
          source={{ uri: recipe.image }}
          defaultSource={require('../assets/icons/photoNotReady.png')}
          style={{ width: 120, height: 60 }}
         />
        
        </View>
              <Text style={styles.foodText}>{recipe.name}</Text>
              <View style={{ left: 12, top: 15 }}>
              </View>
        <View style={{marginLeft: 7, flexDirection: 'row', top: 13}}>
          <Image style={{top: 15, marginLeft: 4}} source={require('../assets/icons/clock.png')}/>
              <Text style={styles.timeText}>
              {recipe.time[0] !== 0 && `${recipe.time[0]}시간 `}
              {recipe.time[1] !== 0 && `${recipe.time[1]}분`} 이내
            </Text>
        </View>
        <TouchableOpacity
              onPress={() => handleToggleBookmark(recipe.id)}
              style={[styles.bookmarkButton, { backgroundColor: isBookmarked(recipe.id) ? 'white' : 'white' }]}>
              <Image source={isBookmarked(recipe.id) ? require('./assets/bookmark.png') : require('./assets/bookmarkFill.png')}/>
        </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    
      {/* Filtering and Sorting Controls */}
      <View style={styles.controls}>
        <View style={styles.filterSwitchContainer}>
          <Text>Show User Recipes</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={showUserRecipes ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={handleToggleSwitch}
            value={showUserRecipes}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={fetchRecipeData}>
          <Text style={styles.addButtonText}>Add Recipe</Text>
        </TouchableOpacity>
        <View style={styles.sortButtons}>
          <TouchableOpacity style={styles.sortButton} onPress={() => handleSortOrder('korean')}>
            <Text>Sort by Korean</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sortButton} onPress={() => handleSortOrder('lack')}>
            <Text>Sort by Lack</Text>
          </TouchableOpacity>
          {/* Add more sorting buttons as needed */}
      </View>
    </View>

    </View>
  )
};


const styles = StyleSheet.create({
    container: {
    backgroundColor: '#F8F9FA', // 배경색상 추가
    height: 'auto',
  },
  containerScroll: {
    top: 20,
    backgroundColor: '#F8F9FA', // 배경색상 추가
    height: 'auto',
  },
  cont: {
    flexDirections: 'row',
    justifyContent: 'center',
    felxWrap: 'wrap',
  },
  post: {
    position: 'relative',
    width: 155,
    height: 165,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 3,
    alignContent: 'flex-start',
    shadowColor: "#000000",
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  addButton:{
    width:55,
    height:55,
    borderRadius: 50,
    top: 630,
    position: 'absolute',
    right: 30,
    zIndex: 2,
    backgroundColor: '#FEA655',
    shadowColor: "#000000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10
  },
  foodText: {
    top: 16,
    paddingLeft: 12,
    fontWeight: 'bold',
  },
  lackingText: {
    paddingLeft: 2,
    bottom: 7,
    color: '#E50000',
    fontSize: 10,
    fontFamily: 'NanumGothic',
  },
  timeText: {
    top: 10,
    color: '#000',
    fontSize: 12,
    margin: 5,
    fontFamily: 'NanumGothic',
  },
  row: {
    flexDirection: 'row', 
    display:'flex',
    flexWrap:'wrap',
    justifyContent: 'space-around', 
    position: 'relative', 
    paddingHorizontal: 40, 
    paddingBottom: 80, 
    gap: 20,
    marginTop: 10
  
  },
  searchWrapper:{
    top: 7,
    width: 299,
    height: 48,
    borderRadius: 15,  
    display: 'flex',
    flexDirection:'row'
  },
  searchArea:{
    width: '100%',
    height: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center',
    marginTop: 11
  },
  searchImg:{
    width: 60,
    height: '100%',
    display: 'flex',
    alignItems:'center',
    justifyContent: 'center',
    borderRadius: 15,
    position: 'absolute'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: 304, 
    height: 526,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  infoBtn: {
    borderWidth: 1.5,
    borderColor: 'red',
    borderRadius: 50,
    width: 15,
    height: 15,
    marginHorizontal: 5
  },
  infoTxt: {
    color: 'red',
    textAlign: 'center',
    textWeight: 'bold',
    bottom: 1,
  },
  bookmarkButton: {
    bottom: 30,
    left: 120,
    width: 16,
    height: 20,
    borderColor: 'grey',
  },
});

export default RecipeTab;
