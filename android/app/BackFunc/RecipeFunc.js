// recipeFunctions.js 수정 필요!!

import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import firestore from "@react-native-firebase/firestore";

// 냉장고 재료 가져오기 (말 그대로 디비에 map으로 저장된 정보를 가져오는거)

// const getRefrigeratorIngredients = async () => {
//   const ingredientArray = await getDocs(collection(db, 'ingredients'));
//   return ingredientArray.docs.map((doc) => doc.data());
// };

//!!!!!!!!!!!!!!!필요!!!!!!!!!!!!!!!!!!!
const addToUsersRefrigerator = async (inputName, inputGram, current_unit, category) => {
  try {
    // console.log(inputName, inputGram, current_unit);

    // Fetch ingredient data
    const ingredientData = await fetchIngredient(category);
    const ingreidentName = ingredientData[inputName]?.ingredient_name;

    // Fetch user refrigerator data
    const userRefrigeratorData = await fetchUserRefrigerator();
    const userRefrigeratorName = userRefrigeratorData[inputName]?.user_ingredient_name;

    // console.log(userRefrigeratorName);
    // console.log(ingreidentName);

    if (userRefrigeratorName === inputName) {
      //userRefrigeratorData[inputName].user_ingredient_gram += parseFloat(inputGram);
      const updatedGram = userRefrigeratorData[inputName].user_ingredient_gram;
      userRefrigeratorData[inputName].user_ingredient_current_unit = current_unit;
      const newIngredient = {
        user_ingredient_id: ingredientData[inputName].ingredient_id,
        user_ingredient_name: inputName,
        user_ingredient_gram: parseFloat(inputGram),
        user_ingredient_image: ingredientData[inputName].ingredient_image,
        user_ingredient_category: ingredientData[inputName].ingredient_category,
        user_ingredient_current_unit: current_unit
      };
      // console.log(userRefrigeratorData);
      return newIngredient;
    } else {
      const newIngredient = {
        user_ingredient_id: ingredientData[inputName].ingredient_id,
        user_ingredient_name: inputName,
        user_ingredient_gram: parseFloat(inputGram),
        user_ingredient_image: ingredientData[inputName].ingredient_image,
        user_ingredient_category: ingredientData[inputName].ingredient_category,
        user_ingredient_current_unit: current_unit
      };

      // userRefrigeratorData.push(newIngredient);
      // console.log(newIngredient);
      return newIngredient;
    }
  } catch (error) {
    console.error('Error:', error);
    // Handle or rethrow the error as needed
    throw error;
  }
};

//!!!!!!!!!!!!!!!필요!!!!!!!!!!!!!!!!!!!
//재료 검색기능
// 검색 시 비슷한 재료 카테고리 나오게하는 함수 (필터써서 서치기능)
const ingredientSearchFilter = (searchInput) => { //searchInput=입력값
  return ingredientMap.filter((ingredient) =>
    ingredient.ingredient_name.includes(searchInput)
  );
};

//!!!!!!!!!!!!!!!필요!!!!!!!!!!!!!!!!!!!
//디비에 gram으로만 저장되어 있는데 레시피나 다른곳에 단위를 변환해서 보여줘야할때 
// 다른 unit으로 변환하기
//디비에서 가져오고                   그램      재료   어떤 유닛 전환인지 현제 유닛
const switchUnitConversion = async (weight, ingredient, conversionType, category) => {
  const ingredientData = await fetchIngredient(category);
  const ratio = ingredientData[ingredient].ingredient_ratio[conversionType];//이거 맞는지 확인
  //  console.log(ratio + ' ratio_switchUnitConversion');
   let weightConversion = 0; //바뀐 숫자 담는곳
   let unit = ' '; //바뀐 유닛 담는곳
   //switch/case구문으로 각 케이스에 걸리면 그거에 맞는값을 리턴 예) conversionType=gram_to_unit; --> return (weight * conversionType2[conversionType]).toFixed(0); 으로 단위를 바꿔주는 함수
   if (ratio == 0){
       unit = 'g';
         return [weightConversion, unit];
       } else {
   switch (conversionType) {
     case 'gram_to_gram':
       weightConversion = weight;
       unit = 'g';
       return [weightConversion, unit];
     case 'gram_to_unit':
       weightConversion = (weight * ratio).toFixed(2);
       unit = '개';
       return [weightConversion, unit];
     case 'unit_to_gram':
       weightConversion = (weight / ratio).toFixed(2);
       unit = 'g';
       return [weightConversion, unit];
     case 'gram_to_spoon':
       weightConversion = (weight * ratio).toFixed(2);
       unit = '스푼';
      //  console.log(weightConversion + ' weightConversion_switchUnitConversion');
      //  console.log(unit + ' unit_switchUnitConversion');
       return [weightConversion, unit];
     case 'spoon_to_gram':
       weightConversion = (weight / ratio).toFixed(2);
       unit = 'g'
       return [weightConversion, unit];
     case 'gram_to_ml':
       weightConversion = (weight * ratio).toFixed(2);
       unit = 'ml';
       return [weightConversion, unit];
     case 'ml_to_gram':
       weightConversion = (weight / ratio).toFixed(2);
       unit = 'g';
       return [weightConversion, unit];
     default:
       return [weightConversion, unit];
   }
 }
 };


// // 레시피에서 조리 완료시 냉장고의 재료가 줄어들도록하는 함수
// const subtractIngredient = async (weight, kind, name) => {
//   //ogGram은 원래 디비에서 받은값
//   const ogGram = (await collection(db, 'ingredients').doc(kind).get()).data().ingredient_gram;
//   const updateValue = ogGram - weight; //차감되는 함수니깐 차감

//   await collection(db, 'users').doc(kind).update({ [name]: { ingredient_gram: Math.max(0, updateValue) } });
// };//차감된 값을 다시 db에 넣어주는데 만약 넣어주는 값 (updateValue)가 마이너스이면 updateValue=0으로 만들어버리는 함수

// recipe 컬렉션에 레시피 추가하는 함수 (수정필요)
const addRecipeToCollection = async (recipeData) => {
  try {
    const recipeRef = await addDoc(collection(db, 'recipe'), recipeData);
    console.log('Recipe added with ID: ', recipeRef.id);
    return recipeRef.id;
  } catch (error) {
    console.error('Error adding recipe: ', error);
  }
};

// bookmark 컬렉션에 북마크 추가하는 함수
const addBookmark = async (userId, recipeId) => {
  try {
    const bookmarkRef = doc(db, 'bookmark', userId);
    await updateDoc(bookmarkRef, { [recipeId]: true });
    await addBookmarkToUser(userId, recipeId);
    console.log('Bookmark added successfully.');
  } catch (error) {
    console.error('Error adding bookmark: ', error);
  }
};

// recipeLack 컬렉션에 부족한 재료 추가하는 함수 (수정필요)
const addLackToCollection = async (lackData) => {
  try {
    const lackRef = await addDoc(collection(db, 'recipeLack'), lackData);
    console.log('Lack added with ID: ', lackRef.id);
    return lackRef.id;
  } catch (error) {
    console.error('Error adding lack: ', error);
  }
};

// 가나다순으로 정렬하는 함수
const orderByKorean = async () => {
  const koreanOrder = await db.collection('recipe').orderBy('recipeName').get();
  return koreanOrder.docs.map((doc) => doc.data());
};

// 부족한 재료 갯수가 적은 순으로 정렬하는 함수
const refrigeratorOrderByLack = async (refrigeratorIngredients) => {
  const lackOrder = await db.collection('recipe').get();

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

// 북마크된 레시피의 아이디 가져오는 함수
const getBookmarkedRecipes = async (userId) => {
  const bookmarkData = await db.collection('bookmark').doc(userId).get();
  const bookmarkedRecipeIds = [];

  for (const id in bookmarkData.data() || {}) {
    if (bookmarkData.data()[id] === true) {
      bookmarkedRecipeIds.push(id);
    }
  }

  return bookmarkedRecipeIds;
};

// 레시피 추가 시 recipeCounter를 증가시켜서 레시피 아이디 생성하는 함수
let recipeCounter = 0;
const recipeIdGenerator = () => {
  recipeCounter += 1;
  return 'recipe' + recipeCounter;
};


// 레시피와 냉장고에 있는 재료 비교하는 함수
const compareIngredients = (refrigeratorIngredients, recipeIngredients) => {
  const notInRef = [];
  for (let i = 0; i < recipeIngredients.length; i++) {
    const component = recipeIngredients[i];

    if (!refrigeratorIngredients.includes(component)) {
      notInRef.push(component);
    }
  }

  return notInRef;
};

// 북마크된 레시피의 아이디를 사용자 필드에 추가하는 함수
const addBookmarkToUser = async (userId, recipeId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const bookmarkedRecipes = userData.bookmarkedRecipes || [];

      if (!bookmarkedRecipes.includes(recipeId)) {
        bookmarkedRecipes.push(recipeId);
        await updateDoc(userRef, { bookmarkedRecipes });
        console.log('Bookmark added to user successfully.');
      } else {
        console.log('Recipe is already bookmarked by the user.');
      }
      
    } else {
      console.error('User not found.');
    }
    
  } catch (error) {
    console.error('Error adding bookmark to user: ', error);
  }
};
//day 1
//냉장고에 재료넣기

// //디비에 유저 냉장고가 있는지 없는지 확인
// const checkIfUserRefrigeratorExists = async () => {
//   const refregerator = getUsersRefrigeratorIngredients();
//   try{
//     refregerator;
//   } catch (error){
//     //유저 냉장고 .set 하기
//   }
// };

//재료 양 설정 받은 값 db에 넣기 !!!!!!!!!!!!!!!필요!!!!!!!!!!!!!!!!!!!
const updateUsersRefrigeratorAddedFromIngredient = async (weight, ingredient_name, conversionType, currentUnit, category) => {
  //1. input값 받고 unit을 switchUnitConversion을 돌려 내보내야됨
  //2. inputIngredient 값을 받고 유저냉장고에 넣는 역할 (나중에 inputIngredient랑 합쳐도 괜찮을듯 (합침 기억해두기))
    // console.log("이름 긴거 인풋: ", weight, ingredient_name, conversionType, currentUnit, category)
    const storePreviousUserRefrigerator = await fetchUserRefrigerator();
    // console.log("그전에 저장되어있는 냉장고 정보: ", storePreviousUserRefrigerator);
    const switchedUnit = await switchUnitConversion (weight, ingredient_name, conversionType, category);
    //const switchedUnitData = switchedUnit.data;
    const switchedUnitWeight = switchedUnit[0];
    const switchedUnitCurrentUnit = switchedUnit[1];
    // console.log("유닛변환 아웃풋 [0]: ", switchedUnitWeight);
    // console.log("유닛변환 아웃풋 [1]: ", switchedUnit[1]);
    const updatedRefrigeratorMapRef = await addToUsersRefrigerator(ingredient_name, switchedUnitWeight, switchedUnitCurrentUnit, category);
    // console.log("추가된 맵: ", updatedRefrigeratorMap);
    const updatedRefrigeratorMap = {...storePreviousUserRefrigerator, [ingredient_name]: updatedRefrigeratorMapRef};
    // console.log("업데이트 될 맵: ", updatedRefrigeratorMap);
      firestore().collection('users').doc('user_id').update({
      user_refrigerator: updatedRefrigeratorMap
    });
    // firestore().collection('users').doc('user_id').update(updatedRefrigeratorMapRef); 
  };
//db에서 가져오기
/*const getUsersRefrigerator = async() => {
//updateUsersRefrigerator에서 db에 업뎃한 내용을 가져온다
//users에 재료마다 단위 뭘로 저장했는지 기억해야됨
  const userIngredientArray = await getDocs(collection(db, 'users'));
  return userIngreditentArray.docs.map((doc) => doc.data());'  
  console.log(userIngreditentArray.docs.map((doc) => doc.data());//확인용
};*/

//보내주는거* !!!!!!!!!!!!!!!필요!!!!!!!!!!!!!!!!!!!
const showOnRefrigerator = async () => {
  try {
    const userRefrigerator = await fetchUserRefrigerator();

    if (!userRefrigerator || Object.keys(userRefrigerator).length === 0) {
      // console.log("User refrigerator does not exist or has no ingredients.");
      return [];
    }

    const updatedIngredientsMap = new Map();

    for (const [ingredientId, ingredientData] of Object.entries(userRefrigerator)) {
      const unit = ingredientData.user_ingredient_current_unit;
      const weight = ingredientData.user_ingredient_gram;
      const name = ingredientData.user_ingredient_name;
      const category = ingredientData.user_ingredient_category;

      let conversionType;
      switch (unit) {
        case 'g':
          conversionType = 'gram_to_gram';
          break;
        case '개':
          conversionType = 'gram_to_unit';
          break;
        case '스푼':
          conversionType = 'gram_to_spoon';
          break;
        case 'ml':
          conversionType = 'gram_to_ml';
          break;
        default:
          conversionType = '';
          break;
      }

      let convertedWeight;
      if (conversionType) {
        convertedWeight = await switchUnitConversion(weight, name, conversionType, category);
        // console.log("Converted weight:", convertedWeight);
      } else {
        convertedWeight = [weight.toString(), unit];
      }

      updatedIngredientsMap.set(ingredientId, {
        unit: unit,
        weight: convertedWeight[0],
        name: name,
        category: category,
        id: ingredientId,
        image: ingredientData.user_ingredient_image
      });
    }

    // console.log("Updated user refrigerator ingredients:", Array.from(updatedIngredientsMap.values()));

    return Array.from(updatedIngredientsMap.values()); // Convert Map to Array
  } catch (error) {
    console.error("Error in fetching or processing refrigerator data:", error);
    return false;
  }
};

// 가져온걸로 프런트에서 보여주면 1일차 끗
//!!!!!!!!!!!!!!!필요!!!!!!!!!!!!!!!!!!!
const updateUsersRecipe = async (recipe_difficulty, recipe_id, recipe_image, recipe_name, recipe_ingredients, recipe_steps, recipe_time) => {
  const previousUserRecipe = await fetchUsersRecipe();
  const userRecipe = {
    user_recipe_difficulty: recipe_difficulty,
    user_recipe_id: recipe_id,
    user_recipe_image: recipe_image,
    user_recipe_name: recipe_name,
    user_recipe_ingredients: recipe_ingredients,
    user_recipe_steps: recipe_steps,
    user_recipe_time: recipe_time
  };
  const updatedUsersRefrigeratorMap = {...previousUserRecipe, [recipe_id]: userRecipe};
      firestore().collection('users').doc('user_id').update({
      user_refrigerator: updatedUsersRefrigeratorMap
  });
};

//!!!!!!!!!!!!!!!필요!!!!!!!!!!!!!!!!!!!
const fetchUsersRecipe = async () => {
  try {
    const userRecipeDB = firestore().collection('users').doc('user_id');
    const userRecipreInfo = await userRecipeDB.get();
    const userRecipreInfoData = userRecipreInfo.data();
    return userRecipreInfoData.user_refrigerator;
  } catch (error){
    console.error("ERROR IN Calling userRecipe DB:", error);
  }
};

//day 2
//조리완료 후 차감

//!!!!!!!!!!!!!!!필요!!!!!!!!!!!!!!!!!!!
const findLostCategory = (CategorylessIngredient) =>  {
  return (
    bean_nuts(CategorylessIngredient) ||
    bread_ricecake(CategorylessIngredient) ||
    dairy(CategorylessIngredient) ||
    fruit(CategorylessIngredient) ||
    grain(CategorylessIngredient) ||
    ham_sausage(CategorylessIngredient) ||
    meat(CategorylessIngredient) ||
    noodle(CategorylessIngredient) ||
    seafood(CategorylessIngredient) ||
    seasoning(CategorylessIngredient) ||
    truffle(CategorylessIngredient) ||
    vegetable(CategorylessIngredient) ||
    "unknown" // Return unknown if no category matches
  );
};
//!!!!!!!!!!!!!!!필요!!!!!!!!!!!!!!!!!!!
const bean_nuts = (unknownCategory) => {
  const bean_nuts = ["검은콩","깨","두부","땅콩","순두부","아몬드","완두콩","콩","호두"];
  for (let i = 0; i < bean_nuts.length; i++) {
    if (bean_nuts[i] === unknownCategory) {
      return "bean_nuts";
    }
  }
};
//!!!!!!!!!!!!!!!필요!!!!!!!!!!!!!!!!!!!
const bread_ricecake = (unknownCategory) => {
  const bread_ricecake = ["가래떡","떡국떡","떡볶이떡","모닝빵","바게트","베이글","식빵"];
  for (let i = 0; i < bread_ricecake.length; i++) {
    if (bread_ricecake[i] === unknownCategory) {
      return "bread_ricecake";
    }
  }
};
//!!!!!!!!!!!!!!!필요!!!!!!!!!!!!!!!!!!!
const dairy = (unknownCategory) => {
  const dairy = ["계란","메추리알","모짜렐라치즈","옥수수콘","요거트","체다치즈"];
  for (let i = 0; i < dairy.length; i++) {
    if (dairy[i] === unknownCategory) {
      return "dairy";
    }
  }
};
//!!!!!!!!!!!!!!!필요!!!!!!!!!!!!!!!!!!!
const fruit = (unknownCategory) => {
  const fruit = ["감","건포도","귤","딸기","라임","레몬","망고","메론","바나나","배","복숭아","블루베리","사과","아보카도","오렌지","자두","체리","키위","파인애플","포도"];
  for (let i = 0; i < fruit.length; i++) {
    if (fruit[i] === unknownCategory) {
      return "fruit";
    }
  }
};
//!!!!!!!!!!!!!!!필요!!!!!!!!!!!!!!!!!!!
const grain = (unknownCategory) => {
  const grain = ["감자","고구마","귀리","누릉지","밀가루","부침가루","빵가루","옥수수","찹쌀가루","통밀"];
  for (let i = 0; i < grain.length; i++) {
    if (grain[i] === unknownCategory) {
      return "grain";
    }
  }
};
//!!!!!!!!!!!!!!!필요!!!!!!!!!!!!!!!!!!!
const ham_sausage = (unknownCategory) => {
  const ham_sausage = ["미트볼","베이컨","비엔나소시지","순대","스팸","햄"];
  for (let i = 0; i < ham_sausage.length; i++) {
    if (ham_sausage[i] === unknownCategory) {
      return "ham_sausage";
    }
  }
};
//!!!!!!!!!!!!!!!필요!!!!!!!!!!!!!!!!!!!
const meat = (unknownCategory) => {
  const meat = ["닭고기","돼지고기","소고기","양고기","오리고기"];
  for (let i = 0; i < meat.length; i++) {
    if (meat[i] === unknownCategory) {
      return "meat";
    }
  }
};
//!!!!!!!!!!!!!!!필요!!!!!!!!!!!!!!!!!!!
const noodle = (unknownCategory) => {
  const noodle = ["당면","라면","소면","수제비","스파게티면","우동면","칼국수면"];
  for (let i = 0; i < noodle.length; i++) {
    if (noodle[i] === unknownCategory) {
      return "noodle";
    }
  }
};
//!!!!!!!!!!!!!!!필요!!!!!!!!!!!!!!!!!!!
const seafood = (unknownCategory) => {
  const seafood = ["갈치","개맛살","건새우","고등어","골뱅이","굴","꼬막","꽁치","꽃게","낙지","다시마","대합","도다리","동태","멸치","명태","문어","미역","바지락","새우","소라","아귀","연어","오징어","전복","전어","조개","조기","쭈꾸미","홍합"];
  for (let i = 0; i < seafood.length; i++) {
    if (seafood[i] === unknownCategory) {
      return "seafood";
    }
  }
};
//!!!!!!!!!!!!!!!필요!!!!!!!!!!!!!!!!!!!
const seasoning = (unknownCategory) => {
  const seasoning = ["간장","고추장","고춧가루","굴소스","굵은소금","까나리액젓","깨소금","꿀","다진마늘","데리야끼소스","돈까스소스","된장","마요네즈","머스타드소스","멸치액젓","물엿","미원","버터","설탕","소금","쇠고기다시다","식초","쌈장","오징어젓갈","올리고당","올리브유","짜장가루","참기름","청국장","초고추장","춘장","칠리소스","카레가루","케첩","토마토소스","핫소스","후추"];
  for (let i = 0; i < seasoning.length; i++) {
    if (seasoning[i] === unknownCategory) {
      return "seasoning";
    }
  }
};
//!!!!!!!!!!!!!!!필요!!!!!!!!!!!!!!!!!!!
const truffle = (unknownCategory) => {
  const truffle = ["트러플","트러플소금","트러플오일"];
  for (let i = 0; i < truffle.length; i++) {
    if (truffle[i] === unknownCategory) {
      return "truffle";
    }
  }
};
//!!!!!!!!!!!!!!!필요!!!!!!!!!!!!!!!!!!!
const vegetable = (unknownCategory) => {
  const vegetable = ["가지","고추","김치","깻잎","당근","대파","마늘","무","배추","브로콜리","비트","상추","샐러리","숙주","시금치","아스파라거스","애호박","양배추","양송이버섯","양파","열무","오이","콩나물","토마토","파프리카","팽이버섯","표고버섯","호박"];
  for (let i = 0; i < vegetable.length; i++) {
    if (vegetable[i] === unknownCategory) {
      return "vegetable";
    }
  }
};

//!!!!!!!!!!!!!!!필요!!!!!!!!!!!!!!!!!!!
const fetchRecipe = async (input_id) => {
  try {
    const recipeDB = firestore().collection('recipes').doc(input_id);
    const recipreInfo = await recipeDB.get();
    const recipreInfoData = recipreInfo.data();
    // console.log(recipreInfoData)
    return recipreInfoData;
  } catch (error){
    console.error("ERROR IN Calling Recipe DB:", error);
  }
};

//!!!!!!!!!!!!!!!필요!!!!!!!!!!!!!!!!!!!
const getAndUpdateFinishedRecipesIngredient = async (recipe_id) => {
  try {
    // console.log('Fetching user refrigerator...');
    let userRefrigerator = await fetchUserRefrigerator(); // Ensure this can be updated
    // console.log('User refrigerator fetched:', userRefrigerator);

    // console.log('Fetching recipe data...');
    const recipeData = await fetchRecipe(recipe_id);
    // console.log('Recipe data fetched:', recipeData);

    const recipeIngredients = recipeData.recipe_ingredients;

    const numbersMap = {};
    const unitMap = {};

    Object.keys(recipeIngredients).forEach(key => {
      const value = recipeIngredients[key];
      const numbers = value.match(/\d+/g) || [];
      const letters = value.match(/[^\d\s]+/g) || []; // Exclude spaces from matches

      numbersMap[key] = numbers.join(''); // Assuming single number per ingredient
      unitMap[key] = letters.join(''); // Assuming single unit per ingredient
    });

    for (const ingredient in recipeIngredients) {
      if (recipeIngredients.hasOwnProperty(ingredient)) {
        let conversionType = '';
        let weight = parseFloat(numbersMap[ingredient]); // Changed to let
        const unit = unitMap[ingredient];
        const category = userRefrigerator[ingredient]?.user_ingredient_category;
        
        if (category) {
          switch (unit) {
            case 'g':
              conversionType = 'gram_to_gram';
              break;
            case '스푼':
              conversionType = 'gram_to_spoon';
              break;
            case '개':
              conversionType = 'gram_to_unit';
              break;
            case '약간':
              conversionType = 'gram_to_spoon';
              weight = 1 / 6; // Adjust weight for '약간'
              break;
            default:
              conversionType = 'gram_to_gram';
              break;
          }
          
          const switchUnit = await switchUnitConversion(weight, ingredient, conversionType, category);

          if (userRefrigerator[ingredient]?.user_ingredient_gram) {
            userRefrigerator[ingredient].user_ingredient_gram -= parseFloat(switchUnit[0]);
          } else {
            console.error(`Error: ${ingredient} not found in userRefrigerator`);
          }
        } else {
          console.error(`Error: ${ingredient} not found in userRefrigerator`);
        }
      }
    }

    await firestore()
      .collection('users')
      .doc('user_id') // Assuming user_id is a variable containing the user's ID
      .update({
        user_refrigerator: userRefrigerator
      })
      .then(() => {
        console.log('Document successfully updated!');
      })
      .catch((error) => {
        console.error('Error updating document:', error);
      });
    
  } catch (error) {
    console.error('Error in getAndUpdateFinishedRecipesIngredient:', error);
    // Handle error as per your application's requirements
  }
};


//!!!!!!!!!!!!!!!필요!!!!!!!!!!!!!!!!!!!
//디비 불러오는 코드
// 냉장고 재료 가져오기 (말 그대로 디비에 map으로 저장된 정보를 가져오는거)
const fetchIngredient = async (category) => {
  try{
  const ingredientDB = firestore().collection('ingredients').doc(category);//카테고리 늘리기
  const ingredientInfo = await ingredientDB.get();
  const ingredientData = ingredientInfo.data();
  return ingredientData;
  
  } catch (error) {
      console.error("ERROR IN Calling Ingredient DB:", error);
    return false;
  }
};

//!!!!!!!!!!!!!!!필요!!!!!!!!!!!!!!!!!!!
//유저 냉장고 디비 받아오기
const fetchUserRefrigerator = async () => {
  try {
    const userDB = firestore().collection('users').doc('user_id');
    const userInfo = await userDB.get();
    const userInfoData = userInfo.data();
    return userInfoData.user_refrigerator;
  } catch (error){
    console.error("ERROR IN Calling User Refrigerator DB:", error);
  }
};
//래시피 후 빼는거
const subtractIngredient1 = async (weight, kind, name) => {
  //ogGram은 원래 디비에서 받은값
  const ogGram = (await collection(db, 'users').doc().get()).data().user_ingredient_gram;
  const updateValue = ogGram - weight; //차감되는 함수니깐 차감

  await collection(db, 'users').doc(kind).update({ [name]: { user_ingredient_gram: Math.max(0, updateValue) } });
};//차감된 값을 다시 db에 넣어주는데 만약 넣어주는 값 (updateValue)가 마이너스이면 updateValue=0으로 만들어버리는 함수

export {
  addBookmarkToUser,
  //getRefrigeratorIngredients,
  addToUsersRefrigerator,
  ingredientSearchFilter,
  switchUnitConversion,
  //subtractIngredient,
  addRecipeToCollection,
  addBookmark,
  addLackToCollection,
  orderByKorean,
  refrigeratorOrderByLack,
  getBookmarkedRecipes,
  recipeIdGenerator,
  compareIngredients,
  updateUsersRefrigeratorAddedFromIngredient,
  //checkIfUserRefrigeratorExists,
  showOnRefrigerator,
  getAndUpdateFinishedRecipesIngredient,
  //matchIngredientandReceipt,
  subtractIngredient1,
  fetchUserRefrigerator,
  fetchIngredient
  //fetchRecipeAll
};