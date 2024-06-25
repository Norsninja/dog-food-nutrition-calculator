import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const NutrientBarChart = ({ nutrients }) => {
  if (!nutrients || nutrients.length === 0) {
    return <div>No data available for chart</div>;
  }

  const caloriesPerKg = nutrients.find(n => n.name === 'Calories')?.value || 1;
  const conversionFactor = 1000 / caloriesPerKg;

  const chartData = nutrients
    .filter(nutrient => 
      [
        'Crude Protein (g)', 'Crude Fat (g)', 'Calcium (g)', 'Phosphorus (g)',
        'Potassium (g)', 'Sodium (g)', 'Magnesium (g)', 'Iron (mg)', 'Copper (mg)',
        'Manganese (mg)', 'Zinc (mg)', 'Iodine (mg)', 'Selenium (mg)',
        'Vitamin A (IU)', 'Vitamin D (IU)', 'Vitamin E (IU)', 'Thiamine (mg)',
        'Riboflavin (mg)', 'Pantothenic acid (mg)', 'Niacin (mg)', 'Pyridoxine (mg)',
        'Folic acid (mg)', 'Vitamin B12 (mg)', 'Choline (mg)'
      ].includes(nutrient.name)
    )
    .map(nutrient => ({
      ...nutrient,
      value: Math.max(0.01, nutrient.value * conversionFactor),
    }));

  const getBarColor = (nutrient) => {
    const { value, aafcoMin, aafcoMax } = nutrient;
    console.log(`Nutrient: ${nutrient.name}, Value: ${value}, Min: ${aafcoMin}, Max: ${aafcoMax}`);
    if (aafcoMin !== '-' && value < parseFloat(aafcoMin)) {
      console.log('Value is below minimum');
      return 'red';
    }
    if (aafcoMax !== '-' && value > parseFloat(aafcoMax)) {
      console.log('Value is above maximum');
      return 'orange';
    }
    console.log('Value is within range');
    return 'green';
  };

  return (
    <div style={{ width: '100%', height: 600 }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={150} />
          <YAxis scale="log" domain={['auto', 'auto']} />
          <Tooltip formatter={(value) => value.toFixed(2)} />
          <Legend />
          <Bar dataKey="value" name="Recipe Value">
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getBarColor(entry)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NutrientBarChart;