import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import firestore from "@react-native-firebase/firestore";

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
      <Text key={index}>{ingredient}: {amount}</Text>
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: recipeImage }} style={styles.image}/>

      <View style={styles.titleContainer}>
        <TouchableOpacity style={styles.bookmarkButton} onPress={toggleBookmark}>
          <Image source={isBookmarked ? require('../assets/icons/bookmarkFill.png') : require('../assets/icons/bookmark.png')}/>
        </TouchableOpacity>
      </View>

      <Text>{recipeName}</Text>
      <Text>{recipeTime}</Text>
      <Text>{recipeDifficulty}</Text>
      
      <View style={styles.timeContainer}>
        <Image source={require('../assets/icons/clock.png')} style={styles.clockIcon}/>
      </View>

      <View style={styles.ingredientsContainer}>
        {renderIngredients()}
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>뒤로가기</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('RecipeDetail', { recipeId: route.params.recipeId })}>
          <Text style={styles.buttonText}>조리하기</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingVertical: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  titleContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  bookmarkButton: {
    padding: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  clockIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  ingredientsContainer: {
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row', 
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#CCCCCC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FEA655',
    paddingVertical: 10,
    paddingHorizontal: 20,
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