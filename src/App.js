import React from 'react';
import DogFoodSpreadsheet from './DogFoodSpreadsheet';
import ErrorBoundary from './ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <h1>Dog Food Nutrition Calculator</h1>
        <DogFoodSpreadsheet />
      </div>
    </ErrorBoundary>
  );
}

export default App;