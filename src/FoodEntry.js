import React, { useState, useEffect } from 'react';
import { fetchNutritionData } from './nutritionixApi';
import './index.css';


const FoodEntry = ({ username }) => {
  const [foodInput, setFoodInput] = useState('');
  const [logDate, setLogDate] = useState('');
  const [log, setLog] = useState([]);

  const storageKey = `foodLog_${username}`;

  useEffect(() => {
    const savedLog = localStorage.getItem(storageKey);
    if (savedLog) setLog(JSON.parse(savedLog));
  }, [storageKey]);

  const saveLog = (updatedLog) => {
    setLog(updatedLog);
    localStorage.setItem(storageKey, JSON.stringify(updatedLog));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foodInput || !logDate) return;

    const data = await fetchNutritionData(foodInput);
    if (!data) return;

    const foodData = data.foods.map(food => ({
      name: food.food_name,
      calories: food.nf_calories,
      image: food.photo.thumb
    }));

    const updatedLog = (() => {
      const existingDate = log.find(entry => entry.date === logDate);
      if (existingDate) {
        return log.map(entry =>
          entry.date === logDate
            ? { ...entry, foods: [...entry.foods, ...foodData] }
            : entry
        );
      } else {
        return [...log, { date: logDate, foods: foodData }];
      }
    })();

    saveLog(updatedLog);
    setFoodInput('');
  };

  const handleDeleteFood = (date, foodIndex) => {
    const updatedLog = log
      .map(entry => {
        if (entry.date === date) {
          const newFoods = [...entry.foods];
          newFoods.splice(foodIndex, 1);
          return { ...entry, foods: newFoods };
        }
        return entry;
      })
      .filter(entry => entry.foods.length > 0);
    saveLog(updatedLog);
  };

  const getTotalCalories = (foods) =>
    foods.reduce((sum, item) => sum + item.calories, 0).toFixed(0);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 col-12">
          <h2 className="mb-4">Hey, {username}! Let's get right.</h2>
          <p>Enter the foods you've eaten recently, we'll group them by date. Head to the 'Meal Planner' section to prep for the upcoming week!</p>
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="e.g., avocado toast"
                value={foodInput}
                onChange={(e) => setFoodInput(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="date"
                className="form-control"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-success">Log Food</button>
          </form>
        </div>

        <div className="col-md-6 col-12">
          <h3 className="text-end mb-3">Food Log</h3>
          {log.length === 0 ? (
            <p className="text-end">No entries yet.</p>
          ) : (
            log
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((entry, i) => (
                <div className="card mb-3" key={i}>
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <strong>{entry.date}</strong>
                    <span>{getTotalCalories(entry.foods)} kcal</span>
                  </div>
                  <ul className="list-group list-group-flush">
                    {entry.foods.map((food, j) => (
                      <li className="list-group-item d-flex justify-content-between align-items-center" key={j}>
                        <div className="d-flex align-items-center">
                        <img
  src={food.image}
  alt={food.name}
  style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%', marginRight: '10px' }}
  onError={(e) => { e.target.style.display = 'none'; }}
/>
                          <div>
                            <strong>{food.name}</strong> – {food.calories} kcal
                          </div>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteFood(entry.date, j)}
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodEntry;
