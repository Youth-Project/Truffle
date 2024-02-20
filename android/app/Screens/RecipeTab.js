import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Switch } from 'react-native';
import firestore from "@react-native-firebase/firestore";

const RecipeTab = ({ navigation }) => {
  const [showUserRecipes, setShowUserRecipes] = useState(false);
  const [recipeData, setRecipeData] = useState([]);
  const [refrigeratorIngredients, setRefrigeratorIngredients] = useState([]);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);

  useEffect(() => {
    fetchRecipeData();
    fetchBookmarkedRecipes();
  }, []);

  const fetchRecipeData = async () => {
    try {
      const fetchedRecipes = [];
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
    return bookmarkedRecipes.includes(recipeId);
  };

  const handleToggleBookmark = async (recipeId) => {
    const newBookmarkStatus = !isBookmarked(recipeId);
    toggleBookmark(recipeId, newBookmarkStatus);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {recipeData.map((recipe) => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.post}
            onPress={() => navigation.navigate('RecipeMain', { recipeId: recipe.id })}>
            <Image source={{ uri: recipe.image }} style={styles.image} />
            <Text style={styles.foodText}>{recipe.name}</Text>
            <Text style={styles.timeText}>
              {recipe.time[0] !== 0 && `${recipe.time[0]} 시간 `}
              {recipe.time[1] !== 0 && `${recipe.time[1]} 분`}
            </Text>
            <TouchableOpacity
              onPress={() => handleToggleBookmark(recipe.id)}
              style={[styles.bookmarkButton, { backgroundColor: isBookmarked(recipe.id) ? 'yellow' : 'white' }]}>
              <Text>{isBookmarked(recipe.id) ? 'Bookmarked' : 'Bookmark'}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  post: {
    width: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 80,
    borderRadius: 10,
  },
  foodText: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  timeText: {
    marginTop: 5,
  },
  bookmarkButton: {
    marginTop: 5,
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default RecipeTab;
