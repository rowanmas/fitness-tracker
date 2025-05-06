import axios from 'axios';

const APP_ID = '04ecb4f7';
const APP_KEY = '7fd63863cac7614b40524964aaefd751';

export const fetchNutritionData = async (query) => {
  try {
    const response = await axios.post(
      'https://trackapi.nutritionix.com/v2/natural/nutrients',
      { query },
      {
        headers: {
          'x-app-id': APP_ID,
          'x-app-key': APP_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching nutrition data:', error);
    return null;
  }
};
