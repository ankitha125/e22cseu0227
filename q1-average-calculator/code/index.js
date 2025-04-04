const express = require("express");
const app = express();
const PORT = 9876;

const { fetchNumbers } = require("./utils");
const  {updateWindow } = require("./windowManager");

app.get("/numbers/:numberid", async (req, res) => {
  const { numberid } = req.params;

  if (!["p", "f", "e", "r"].includes(numberid)) {
    return res.status(400).json({ error: "Invalid number ID" });
  }

  const numbers = await fetchNumbers(numberid);
  const result = updateWindow(numbers);

  res.json({
    windowPrevState: result.windowPrevState,
    windowCurrState: result.windowCurrState,
    numbers,
    avg: result.avg,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
