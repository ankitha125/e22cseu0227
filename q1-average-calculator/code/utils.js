const axios = require("axios");

const typeToURL = {
  p: "http://20.244.56.144/evaluation-service/primes",
  f: "http://20.244.56.144/evaluation-service/fibo",
  e: "http://20.244.56.144/evaluation-service/even",
  r: "http://20.244.56.144/evaluation-service/rand",
};

async function fetchNumbers(type) {
    const url = typeToURL[type];
    if (!url) throw new Error("Invalid type");
  
    try {
      const response = await axios.get(url, { timeout: 500 });
      console.log("Fetched from API:", response.data); 
      return response.data.numbers || [];
    } catch (err) {
      console.warn("Error or timeout fetching:", type, err.message);
      return [];
    }
  }
module.exports = { fetchNumbers };
