const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const personnelRoutes = require('../routes/personnelRoutes');
const equipmentRoutes = require('../routes/equipmentRoutes');
const authRoutes = require('../routes/authRoutes');
const port = process.env.PORT || 8000;
const mongoURI = 'mongodb+srv://MoinSultan:moinsultan123@cluster0.bkhbvex.mongodb.net/';
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(cors());


client.connect()
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

app.use('/api/personnel', personnelRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/', authRoutes);
