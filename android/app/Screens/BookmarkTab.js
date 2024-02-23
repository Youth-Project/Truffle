import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image, Text, ScrollView, View, FlatList, StyleSheet } from 'react-native';
import firestore from "@react-native-firebase/firestore";

const BookMarkItem = ({ item, navigation }) => {
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
        return book.bookmarkFill 
            ? require('../assets/icons/bookmark.png')
            : require('../assets/icons/bookmarkFill.png');
    };

    const photoImage = (recipeImage) => {
        if(recipeImage==''){
        return require('./assets/photoNotReady.png');
      }
      else{
        return {uri: recipeImage};
      }
    };

    return (
        
        <View style={{ alignItems: 'center', margin: 10}}>
            <TouchableOpacity
            style={styles.post}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}>
            <View style={{width: 132, height: 70, left: 12, top: 9, borderRadius: 7, backgroundColor: '#ccc', alignItems: 'center', justifyContent: 'center'}}>
                <Image source={photoImage(item.image)} style={{width: 120, height: 60, }}/>
            </View>
                <Text style={styles.foodText}>{item.name}</Text>
                <View style={{ left: 12, top: 15 }}>
                    <TouchableOpacity 
                        style={[ styles.book, { backgroundColor: book.bookmarkFill? 'white' : 'white' }]} 
                        onPress={handleBookmarkClick}
                    >
                            <Image source={getImageForBookmark('bookmark')} />
                    </TouchableOpacity>
                </View>
                <View style={{ top: 13, marginLeft: 5, left: 7, flexDirection: 'row' }}>
                    <Image style={{ top: 15, }} source={require('../assets/icons/clock.png')} />
                    <Text style={styles.timeText}>
                    {item.time[0] !== 0 && `${item.time[0]}시간 `}
                    {item.time[1] !== 0 && `${item.time[1]}분`} 이내
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const BookMark = ({ navigation }) => {
    const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);

    useEffect(() => {
        const userId = 'xxvkRzKqFcWLVx4hWCM8GgQf1hE3';
        fetchBookmarkedRecipes(userId);
    }, []);

    const fetchBookmarkedRecipes = async (userId) => {
        try {
            const userRef = firestore().collection('users').doc(userId);
            const snapshot = await userRef.get();
            if (!snapshot.exists) {
                throw new Error("사용자가 존재하지 않습니다.");
            }
            const userBookmarkData = snapshot.data();
            const userBookmarked = userBookmarkData.user_bookmark.join(',');
            const userBookmarkStr = userBookmarked.split(',');

            let fetchedRecipes = [];
            for (const docName of userBookmarkStr) {
                const recipeRef = firestore().collection('recipes').doc(docName);
                const recipeSnapshot = await recipeRef.get();
                if (recipeSnapshot.exists) {
                    const recipeData = recipeSnapshot.data();
                    const recipeContents = {
                        id: docName,
                        name: recipeData.recipe_name,
                        image: recipeData.recipe_image,
                        time: recipeData.recipe_time,
                    };
                    fetchedRecipes.push(recipeContents);
                } else {
                    console.warn(`레시피 문서 "${docName}"을(를) 찾을 수 없습니다.`);
                }
            }

            setBookmarkedRecipes(fetchedRecipes);
        } catch (error) {
            console.error('북마크 레시피를 가져오는데 실패했습니다.', error);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={bookmarkedRecipes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <BookMarkItem item={item}  navigation={navigation} />}
                numColumns={2}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F8F9FA',
        height: 'auto',
        alignItems: 'center',

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
        hadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
    },
    foodText: {
        top: 16,
        paddingLeft: 12,
        fontWeight: 'bold',
    },
    timeText: {
        top: 10,
        color: '#000',
        fontSize: 12,
        margin: 5,
        fontFamily: 'NanumGothic',
    },
    book: {
        position: 'absolute', 
        bottom: 1,
        left: 110,
        width: 16,
        height: 20,
        borderColor: 'grey',
    }
});

export default BookMark;
