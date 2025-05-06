import React, { useState, useEffect } from 'react';
import { fetchNutritionData } from './nutritionixApi';
import './index.css';


const MealPlanner = ({ username }) => {
  const [query, setQuery] = useState('');
  const [planDate, setPlanDate] = useState('');
  const [mealPlan, setMealPlan] = useState([]);

  const storageKey = `mealPlan_${username}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setMealPlan(JSON.parse(saved));
  }, [storageKey]);

  const savePlan = (updatedPlan) => {
    setMealPlan(updatedPlan);
    localStorage.setItem(storageKey, JSON.stringify(updatedPlan));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query || !planDate) return;

    const data = await fetchNutritionData(query);
    if (!data) return;

    const foodData = data.foods.map(food => ({
      name: food.food_name,
      calories: food.nf_calories,
      sugar: food.nf_sugars,
      protein: food.nf_protein,
      carbs: food.nf_total_carbohydrate,
      image: food.photo.thumb
    }));

    const updatedPlan = (() => {
      const existing = mealPlan.find(entry => entry.date === planDate);
      if (existing) {
        return mealPlan.map(entry =>
          entry.date === planDate
            ? { ...entry, foods: [...entry.foods, ...foodData] }
            : entry
        );
      } else {
        return [...mealPlan, { date: planDate, foods: foodData }];
      }
    })();

    savePlan(updatedPlan);
    setQuery('');
  };

  const handleDelete = (date, index) => {
    const updated = mealPlan
      .map(entry => {
        if (entry.date === date) {
          const newFoods = [...entry.foods];
          newFoods.splice(index, 1);
          return { ...entry, foods: newFoods };
        }
        return entry;
      })
      .filter(entry => entry.foods.length > 0);
    savePlan(updated);
  };

  const getTotals = (foods) => {
    return foods.reduce(
      (acc, food) => ({
        calories: acc.calories + food.calories,
        sugar: acc.sugar + food.sugar,
        protein: acc.protein + food.protein,
        carbs: acc.carbs + food.carbs
      }),
      { calories: 0, sugar: 0, protein: 0, carbs: 0 }
    );
  };

  return (
    <div className="container">
      <h2 className="mb-4">Meal Planner</h2>
      <p>Enter the foods you're thinking about for the week. We'll show you what you're really putting in your body: the good and the bad!</p>
      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-6 col-12">
          <input
            type="text"
            className="form-control"
            placeholder="e.g., salmon, rice, broccoli"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="col-md-4 col-12">
          <input
            type="date"
            className="form-control"
            value={planDate}
            onChange={(e) => setPlanDate(e.target.value)}
          />
        </div>
        <div className="col-md-2 col-12">
          <button type="submit" className="btn btn-success w-100">Add</button>
        </div>
      </form>

      {mealPlan.length === 0 ? (
        <p>No meals planned yet.</p>
      ) : (
        mealPlan
          .sort((a, b) => a.date.localeCompare(b.date))
          .map((entry, i) => {
            const totals = getTotals(entry.foods);
            return (
              <div className="mb-5" key={i}>
                <h4>{entry.date}</h4>
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-light">
                      <tr>
                        <th>Food</th>
                        <th>Calories</th>
                        <th>Sugar (g)</th>
                        <th>Protein (g)</th>
                        <th>Carbs (g)</th>
                        <th>Action</th>
                      </tr>
                      <tr>
                        <th><strong>Total</strong></th>
                        <th><strong>{totals.calories.toFixed(0)}</strong></th>
                        <th><strong>{totals.sugar.toFixed(1)}</strong></th>
                        <th><strong>{totals.protein.toFixed(1)}</strong></th>
                        <th><strong>{totals.carbs.toFixed(1)}</strong></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {entry.foods.map((food, j) => (
                        <tr key={j}>
                          <td>
                            <div className="d-flex align-items-center">
                            <img
  src={food.image}
  alt={food.name}
  style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%', marginRight: '10px' }}
  onError={(e) => { e.target.style.display = 'none'; }}
/>

                              {food.name}
                            </div>
                          </td>
                          <td>{food.calories}</td>
                          <td>{food.sugar}</td>
                          <td>{food.protein}</td>
                          <td>{food.carbs}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(entry.date, j)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
      )}
    </div>
  );
};

export default MealPlanner;
