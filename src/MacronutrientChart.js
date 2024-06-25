import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const MacronutrientChart = ({ selectedIngredients }) => {
  const calculateMacronutrientPercentages = () => {
    let totalCalories = 0;
    let proteinCalories = 0;
    let fatCalories = 0;
    let carbCalories = 0;

    selectedIngredients.forEach((ingredient) => {
      const amount = ingredient.amount;
      const calories = ingredient.ingredient.nutrients.Calories || 0;
      const protein = ingredient.ingredient.nutrients['Crude Protein (g)'] || 0;
      const fat = ingredient.ingredient.nutrients['Crude Fat (g)'] || 0;
      const carbs = ingredient.ingredient.nutrients['Carbohydrates (g)'] || 0;

      const ingredientCalories = (calories * amount) / 100;
      totalCalories += ingredientCalories;
      proteinCalories += protein * 4 * (amount / 100);
      fatCalories += fat * 9 * (amount / 100);
      carbCalories += carbs * 4 * (amount / 100);
    });

    const proteinPercentage = (proteinCalories / totalCalories) * 100;
    const fatPercentage = (fatCalories / totalCalories) * 100;
    const carbPercentage = (carbCalories / totalCalories) * 100;

    return [
      { name: 'Protein', value: proteinPercentage },
      { name: 'Fat', value: fatPercentage },
      { name: 'Carbohydrates', value: carbPercentage },
    ];
  };

  const macronutrientData = calculateMacronutrientPercentages();

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div style={{ width: '100%', height: 400 }}>
      <PieChart width={400} height={400}>
        <Pie
          data={macronutrientData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {macronutrientData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <div style={{ color: '#0088FE' }}>Protein: 30-40%</div>
        <div style={{ color: '#00C49F' }}>Fat: 15-30%</div>
        <div style={{ color: '#FFBB28' }}>Carbohydrates: 30-50%</div>
      </div>
    </div>
  );
};

export default MacronutrientChart;