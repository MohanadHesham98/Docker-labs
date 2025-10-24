const express = require('express');
const app = express();
const PORT = 5000;
app.use(express.json());
app.get('/api/mobiles', (req, res) => {
  res.json([{id:1,name:"iPhone 15",price:1000},{id:2,name:"Samsung S23",price:900},{id:3,name:"OnePlus 12",price:850}]);
});
app.get('/api/laptops', (req, res) => {
  res.json([{id:1,name:"MacBook Pro 16",price:2500},{id:2,name:"Dell XPS 15",price:2000},{id:3,name:"HP Spectre x360",price:1800}]);
});
app.get('/api/smartwatches', (req, res) => {
  res.json([{id:1,name:"Apple Watch 9",price:400},{id:2,name:"Samsung Galaxy Watch 6",price:350}]);
});
app.get('/api/headphones', (req, res) => {
  res.json([{id:1,name:"Sony WH-1000XM5",price:300},{id:2,name:"Bose 700",price:280}]);
});
app.listen(PORT,()=>console.log(`Backend running on port ${PORT}`));
