import React, { useState, useEffect, useCallback } from 'react';
import { ingredients } from './ingredients';
import NutrientBarChart from './NutrientBarChart';
import MacronutrientChart from './MacronutrientChart';
import { saveRecipe, loadRecipe } from './recipePersistence';
import { FaSave, FaFolderOpen } from 'react-icons/fa';
const DogFoodSpreadsheet = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [nutrients, setNutrients] = useState([
    { name: 'Calories', value: 0, aafcoMin: '-', aafcoMax: '-' },
    { name: 'Crude Protein (g)', value: 0, aafcoMin: 45.0, aafcoMax: '-' },
    { name: 'Crude Fat (g)', value: 0, aafcoMin: 13.8, aafcoMax: '-' },
    { name: 'Calcium (g)', value: 0, aafcoMin: 1.25, aafcoMax: 6.25 },
    { name: 'Phosphorus (g)', value: 0, aafcoMin: 1.00, aafcoMax: 4.0 },
    { name: 'Potassium (g)', value: 0, aafcoMin: 1.5, aafcoMax: '-' },
    { name: 'Sodium (g)', value: 0, aafcoMin: 0.20, aafcoMax: '-' },
    { name: 'Chloride (g)', value: 0, aafcoMin: 0.30, aafcoMax: '-' },
    { name: 'Magnesium (g)', value: 0, aafcoMin: 0.15, aafcoMax: '-' },
    { name: 'Iron (mg)', value: 0, aafcoMin: 10, aafcoMax: '-' },
    { name: 'Copper (mg)', value: 0, aafcoMin: 1.83, aafcoMax: '-' },
    { name: 'Manganese (mg)', value: 0, aafcoMin: 1.25, aafcoMax: '-' },
    { name: 'Zinc (mg)', value: 0, aafcoMin: 20, aafcoMax: '-' },
    { name: 'Iodine (mg)', value: 0, aafcoMin: 0.25, aafcoMax: 2.75 },
    { name: 'Selenium (mg)', value: 0, aafcoMin: 0.08, aafcoMax: 0.5 },
    { name: 'Vitamin A (IU)', value: 0, aafcoMin: 1250, aafcoMax: 62500 },
    { name: 'Vitamin D (IU)', value: 0, aafcoMin: 125, aafcoMax: 750 },
    { name: 'Vitamin E (IU)', value: 0, aafcoMin: 12.5, aafcoMax: '-' },
    { name: 'Thiamine (mg)', value: 0, aafcoMin: 0.56, aafcoMax: '-' },
    { name: 'Riboflavin (mg)', value: 0, aafcoMin: 1.3, aafcoMax: '-' },
    { name: 'Pantothenic acid (mg)', value: 0, aafcoMin: 3.0, aafcoMax: '-' },
    { name: 'Niacin (mg)', value: 0, aafcoMin: 3.4, aafcoMax: '-' },
    { name: 'Pyridoxine (mg)', value: 0, aafcoMin: 0.38, aafcoMax: '-' },
    { name: 'Folic acid (mg)', value: 0, aafcoMin: 0.054, aafcoMax: '-' },
    { name: 'Vitamin B12 (mg)', value: 0, aafcoMin: 0.007, aafcoMax: '-' },
    { name: 'Choline (mg)', value: 0, aafcoMin: 340, aafcoMax: '-' },
  ]);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [conversionFactor, setConversionFactor] = useState(0);

  const updateNutrientValues = useCallback(() => {
    setNutrients(prevNutrients => 
      prevNutrients.map(nutrient => {
        const totalValue = selectedIngredients.reduce((sum, ing) => {
          return sum + (ing.ingredient.nutrients[nutrient.name] || 0) * (ing.amount / 100);
        }, 0);
        return { ...nutrient, value: totalValue * scaleFactor };
      })
    );
  }, [selectedIngredients, scaleFactor]);

  useEffect(() => {
    updateNutrientValues();
  }, [updateNutrientValues]);

  useEffect(() => {
    const calories = nutrients.find(n => n.name === 'Calories')?.value || 0;
    if (calories > 0) {
      setConversionFactor(1000 / calories);
    }
  }, [nutrients]);

  const handleIngredientChange = useCallback((event) => {
    const ingredientName = event.target.value;
    const ingredient = ingredients.find(ing => ing.name === ingredientName);
    if (ingredient && !selectedIngredients.some(si => si.ingredient.name === ingredientName)) {
      setSelectedIngredients(prev => [...prev, { ingredient, amount: 100 }]);
    }
  }, [selectedIngredients]);

  const handleAmountChange = useCallback((index, amount) => {
    setSelectedIngredients(prev => {
      const updated = [...prev];
      updated[index].amount = parseFloat(amount) || 0;
      return updated;
    });
  }, []);

  const handleManualAmountChange = useCallback((index, amount) => {
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount)) {
      handleAmountChange(index, parsedAmount);
    }
  }, [handleAmountChange]);

  const handleRemoveIngredient = useCallback((index) => {
    setSelectedIngredients(prev => prev.filter((_, i) => i !== index));
  }, []);

  const getStatus = useCallback((nutrient) => {
    if (nutrient.name === 'Calories') return { text: '-', color: 'inherit', rowColor: 'inherit' };
    if (nutrient.aafcoMin === '-' && nutrient.aafcoMax === '-') return { text: 'No AAFCO guideline', color: 'inherit', rowColor: 'inherit' };
    
    const convertedValue = nutrient.value * conversionFactor;
    
    if (convertedValue < nutrient.aafcoMin) return { text: 'Below minimum', color: 'red', rowColor: '#FFEEEE' };
    if (nutrient.aafcoMax !== '-' && convertedValue > nutrient.aafcoMax) return { text: 'Above maximum', color: 'red', rowColor: '#FFEEEE' };
    return { text: 'Meets requirement', color: 'limegreen', rowColor: 'inherit' };
  }, [conversionFactor]);

  const calculateNutrientContributions = useCallback((nutrientName) => {
    return selectedIngredients
      .map(ing => ({
        name: ing.ingredient.name,
        contribution: (ing.ingredient.nutrients[nutrientName] || 0) * (ing.amount / 100) * scaleFactor
      }))
      .filter(item => item.contribution > 0)
      .sort((a, b) => b.contribution - a.contribution);
  }, [selectedIngredients, scaleFactor]);

  const NutrientTooltip = ({ nutrientName, contributions }) => (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #ccc',
      padding: '10px',
      borderRadius: '5px',
      maxWidth: '300px'
    }}>
      <h4>{nutrientName} Contributors</h4>
      <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
        {contributions.map((item, index) => (
          <li key={index} style={{ marginBottom: '5px' }}>
            {item.name}: {item.contribution.toFixed(3)}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div style={{padding: '1rem'}}>
        <header>
            <div className="button-container">
            <button className="save-button" onClick={() => saveRecipe(selectedIngredients)}>
                <FaSave className="button-icon" />
                Save Recipe
            </button>
            <button className="load-button" onClick={() => loadRecipe(setSelectedIngredients)}>
                <FaFolderOpen className="button-icon" />
                Load Recipe
            </button>
            </div>
      </header>
      <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem'}}>Dog Food Nutrition Spreadsheet</h2>
      
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
        {/* Left column: Ingredient selection and amount inputs */}
        <div style={{width: '48%'}}>
          <h3>Select Ingredients</h3>
          <div style={{marginBottom: '1rem'}}>
            <label>
              Add Ingredient:
              <select onChange={handleIngredientChange}>
                <option value="">Select an ingredient</option>
                {ingredients.map(ing => (
                  <option key={ing.name} value={ing.name}>{ing.name}</option>
                ))}
              </select>
            </label>
          </div>
          <div>
            {selectedIngredients.map((si, index) => (
              <div key={index} style={{marginBottom: '0.5rem', display: 'flex', alignItems: 'center'}}>
                <span style={{marginRight: '0.5rem', minWidth: '150px'}}>{si.ingredient.name}</span>
                <input 
                  type="range"
                  min="0"
                  max="1000"
                  value={si.amount}
                  onChange={(e) => handleAmountChange(index, e.target.value)}
                  style={{width: '300px', marginRight: '0.5rem'}}
                />
                <input
                  type="number"
                  value={si.amount}
                  onChange={(e) => handleManualAmountChange(index, e.target.value)}
                  style={{width: '60px', marginRight: '0.5rem'}}
                />
                <span style={{marginRight: '0.5rem'}}>g</span>
                <button onClick={() => handleRemoveIngredient(index)} style={{marginLeft: '0.5rem'}}>Remove</button>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Scaled recipe */}
        <div style={{width: '48%'}}>
          <h3>Scaled Recipe</h3>
          <div style={{marginBottom: '1rem'}}>
            <label>
              Scale Recipe:
              <input 
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={scaleFactor}
                onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
                style={{width: '100px', marginLeft: '0.5rem'}}
              />
              <span style={{marginLeft: '0.5rem'}}>{scaleFactor.toFixed(1)}x</span>
            </label>
          </div>
          <div>
            {selectedIngredients.map((si, index) => (
              <div key={index} style={{marginBottom: '0.5rem'}}>
                <span>{si.ingredient.name}: {(si.amount * scaleFactor).toFixed(1)}g</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
        <tr>
            <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2'}}>Nutrient</th>
            <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2'}}>Value</th>
            <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2'}}>Conversion Factor</th>
            <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2'}}>Per 1000 kcal</th>
            <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2'}}>AAFCO Adult Min</th>
            <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2'}}>AAFCO Adult Max</th>
            <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2'}}>Status</th>
        </tr>
        </thead>
        <tbody>
            {nutrients.map((nutrient) => {
                const status = getStatus(nutrient);
                return (
                <tr key={nutrient.name} style={{backgroundColor: status.rowColor}}>
                <td 
                    style={{border: '1px solid #ddd', padding: '8px', cursor: 'pointer'}}
                    onMouseEnter={(e) => {
                        const contributions = calculateNutrientContributions(nutrient.name);
                        setTooltipContent(
                        <NutrientTooltip 
                            nutrientName={nutrient.name} 
                            contributions={contributions} 
                        />
                        );
                        setMousePosition({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseLeave={() => setTooltipContent(null)}
                    onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
                    >
                    {nutrient.name}
                </td>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>{nutrient.value.toFixed(3)}</td>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>{conversionFactor.toFixed(3)}</td>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>{(nutrient.value * conversionFactor).toFixed(3)}</td>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>{nutrient.aafcoMin}</td>
                <td style={{border: '1px solid #ddd', padding: '8px'}}>{nutrient.aafcoMax}</td>
                <td style={{border: '1px solid #ddd', padding: '8px', backgroundColor: status.color, color: status.color === 'white' ? 'black' : 'white'}}>{status.text}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {tooltipContent && (
        <div className="tooltip" style={{ top: mousePosition.y + 10, left: mousePosition.x + 10 }}>
          {tooltipContent}
        </div>
      )}

      <div className="chart-container">
        <div className="chart-column">
          <h3>Nutrient Profile</h3>
          <NutrientBarChart nutrients={nutrients} />
        </div>

        <div className="chart-column">
          <h3>Macronutrient Balance</h3>
          <MacronutrientChart selectedIngredients={selectedIngredients} />
        </div>
      </div>
    </div>
  );
};

export default DogFoodSpreadsheet;