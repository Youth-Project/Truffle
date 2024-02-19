import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image, Text, View, FlatList, StyleSheet } from 'react-native';
import firestore from "@react-native-firebase/firestore";

const BookMarkItem = ({ item, navigation }) => {
    const [bookmarkFill, setBookmarkFill] = useState(false);

    const handleBookmarkClick = async () => {
        const newBookmarkStatus = !bookmarkFill;
        setBookmarkFill(newBookmarkStatus);

        const userId = 'xxvkRzKqFcWLVx4hWCM8GgQf1hE3';

        try {
            const userRef = firestore().collection('users').doc(userId);
            const snapshot = await userRef.get();
            if (!snapshot.exists) {
                throw new Error("사용자가 존재하지 않습니다.");
            }

            const userBookmarkData = snapshot.data();
            let updatedBookmarks = userBookmarkData.user_bookmark || [];

            const recipeId = item.id;
            const bookmarkIndex = updatedBookmarks.indexOf(recipeId);
            if (newBookmarkStatus && bookmarkIndex === -1) {
                updatedBookmarks.push(recipeId);
            } else if (!newBookmarkStatus && bookmarkIndex !== -1) {
                updatedBookmarks.splice(bookmarkIndex, 1);
            }

            await userRef.update({
                user_bookmark: updatedBookmarks
            });
            console.log('사용자 북마크가 업데이트되었습니다.');
        } catch (error) {
            console.error('사용자 북마크를 업데이트하는 중에 오류가 발생했습니다.', error);
        }
    };

    const getImageForBookmark = () => {
        return bookmarkFill 
            ? require('../assets/icons/bookmarkFill.png')
            : require('../assets/icons/bookmark.png');
    };

    return (
        <View style={{ alignItems: 'center', left: 20 }}>
            <TouchableOpacity
            style={styles.post}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}>
                <Image 
                    source={{ uri: item.image }} 
                    style={{ width: 132, height: 70, left: 12, top: 9, borderRadius: 7 }} 
                />
                <Text style={styles.foodText}>{item.name}</Text>
                <View style={{ left: 12, top: 15 }}>
                    <TouchableOpacity 
                        style={{ position: 'absolute', left: 110, bottom: 23 }} 
                        onPress={handleBookmarkClick}
                    >
                        <Image source={getImageForBookmark()} />
                    </TouchableOpacity>
                    <View
                        style={{
                            borderWidth: 1.5,
                            borderColor: 'red',
                            borderRadius: 50,
                            width: 13,
                            height: 13,
                            top: 6
                        }}
                    >
                        <Text style={{ color: 'red', textAlign: 'center', fontWeight: 'bold', fontSize: 9 }}>
                            i
                        </Text>
                    </View>
                    <Text style={styles.lackingText}>{item.lacking}{item.lackMore} 부족</Text>
                </View>
                <View style={{ left: 7, flexDirection: 'row' }}>
                    <Image style={{ top: 15, marginLeft: 4 }} source={require('../assets/icons/clock.png')} />
                    <Text style={styles.timeText}>{item.time} 분 이내</Text>
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
    },
    post: {
        margin: 10,
        position: 'relative',
        width: 155,
        height: 165,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 3,
        alignContent: 'flex-start',
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
        top: 14,
        paddingLeft: 12,
        fontWeight: 'bold',
    },
    lackingText: {
        paddingLeft: 16,
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
});

export default BookMark;
