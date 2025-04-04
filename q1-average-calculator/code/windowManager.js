const WINDOW_SIZE = 10;
let window = [];

function updateWindow(newNumbers) {
  const prevWindow = [...window];

  for (const num of newNumbers) {
    if (!window.includes(num)) {
      if (window.length >= WINDOW_SIZE) {
        window.shift(); 
      }
      window.push(num);
    }
  }

  return {
    windowPrevState: prevWindow,
    windowCurrState: [...window],
    avg: calculateAverage(window),
  };
}

function calculateAverage(arr) {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((acc, val) => acc + val, 0);
  return parseFloat((sum / arr.length).toFixed(2));
}

module.exports = { updateWindow };
