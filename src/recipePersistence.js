export const saveRecipe = async (selectedIngredients) => {
    try {
      const recipeData = {
        selectedIngredients: selectedIngredients,
        // Include any other relevant recipe data
      };
  
      const jsonData = JSON.stringify(recipeData);
  
      const handle = await window.showSaveFilePicker({
        types: [
          {
            description: 'JSON Files',
            accept: {
              'application/json': ['.json'],
            },
          },
        ],
      });
  
      const writable = await handle.createWritable();
      await writable.write(jsonData);
      await writable.close();
  
      console.log('Recipe saved successfully.');
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };
  
  export const loadRecipe = async (setSelectedIngredients) => {
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'JSON Files',
            accept: {
              'application/json': ['.json'],
            },
          },
        ],
      });
  
      const file = await handle.getFile();
      const jsonData = await file.text();
      const recipeData = JSON.parse(jsonData);
  
      // Update your application's state with the loaded recipe data
      setSelectedIngredients(recipeData.selectedIngredients);
      // Update any other relevant state variables
  
      console.log('Recipe loaded successfully.');
    } catch (error) {
      console.error('Error loading recipe:', error);
    }
  };