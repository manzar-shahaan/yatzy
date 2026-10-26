const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'yatzy')));
app.use('/dice-design', express.static(path.join(__dirname, 'dice-design')));

// Basic route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,'yatzy-mock-up','index.html'));
});

app.get('/roll-dice', (req, res) => {
    const die = [];
    for (let i = 0; i < 5; i++) {
        let diceValue = Math.floor(Math.random() * 6) + 1;
        die.push(diceValue);
    }
    res.json(die);
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
