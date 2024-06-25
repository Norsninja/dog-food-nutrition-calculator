
# Dog Food Nutrition Calculator

## Overview

The Dog Food Nutrition Calculator is a React application that allows users to create custom dog food recipes and ensure they meet the nutritional requirements specified by the Association of American Feed Control Officials (AAFCO). The app provides detailed nutrient data, ingredient selection options, nutrient calculations, and data visualization to help users create balanced and nutritious meals for their dogs.

## Installation and Running the App

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Norsninja/dog-food-nutrition-calculator.git
   cd dog-food-nutrition-calculator
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

### Running the App

1. Start the development server:

   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000` to use the app.

## Functionality

### Nutrient Data

- The app includes a comprehensive list of essential nutrients required for dogs, such as protein, fat, calcium, phosphorus, vitamins, and minerals.
- Each nutrient is represented with its name, value, and the corresponding AAFCO minimum and maximum requirements (if applicable).
- The nutrient data is stored in the `nutrients` state variable, which is updated based on the selected ingredients and their amounts.

### Ingredient Selection

- The app allows users to select ingredients from a predefined list (`ingredients`) using a dropdown menu.
- When an ingredient is selected, it is added to the `selectedIngredients` state variable, along with its initial amount (100 grams).
- Users can adjust the amount of each selected ingredient using a range input or manually entering a value.
- The app prevents duplicate ingredients from being added to the selected ingredients list.

### Nutrient Calculations

- The `updateNutrientValues` function calculates the total value of each nutrient based on the selected ingredients and their amounts.
- The nutrient values are scaled based on the `scaleFactor` state variable, which allows users to adjust the overall recipe size.
- The app calculates the conversion factor (`conversionFactor`) based on the calorie content of the recipe, which is used to convert nutrient values to a per 1000 kcal basis.

### AAFCO Requirements

- The app compares the calculated nutrient values against the AAFCO minimum and maximum requirements using the `getStatus` function.
- The nutrient status is determined based on whether the converted value meets the AAFCO guidelines, falls below the minimum, or exceeds the maximum (if applicable).
- The nutrient status is visually represented using color-coded indicators in the nutrient table.

### Nutrient Contributions

- The app allows users to view the contribution of each ingredient to a specific nutrient by hovering over the nutrient name in the table.
- The `calculateNutrientContributions` function calculates the contribution of each ingredient to the selected nutrient based on the ingredient amounts and the `scaleFactor`.
- The nutrient contributions are displayed in a tooltip component (`NutrientTooltip`) when the user hovers over a nutrient name.

### Data Visualization

- The app includes two chart components (`NutrientBarChart` and `MacronutrientChart`) to visualize the nutrient profile and macronutrient balance of the recipe.
- The `NutrientBarChart` component displays the calculated nutrient values compared to the AAFCO guidelines using a bar chart.
- The `MacronutrientChart` component shows the distribution of macronutrients (protein, fat, carbohydrates) in the recipe using a pie chart or similar visualization.

### Recipe Persistence

- The app provides functionality to save and load recipes using the `saveRecipe` and `loadRecipe` functions from the `recipePersistence` module.
- Users can save their custom recipes to a file and load previously saved recipes into the app.
