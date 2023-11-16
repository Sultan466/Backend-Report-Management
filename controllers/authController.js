
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const mongoURI = 'mongodb+srv://MoinSultan:moinsultan123@cluster0.bkhbvex.mongodb.net/';
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      unique: true, // Ensure emails are unique
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  });

const User = mongoose.model('User', userSchema);

async function signUpController(req, res) {
    try {
      // Establish a connection to MongoDB
      mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        // The connection is established; you can now define the User model and create the table.
        const User = mongoose.model('User', userSchema);
        // Other routes and server setup code...
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
      });
      console.log('IIINNN')
      console.log(req.body.email,'req.body.email')
      // Check if the email already exists
      const existingUser = await User.findOne({ email: req.body.email });
      console.log(existingUser,'existingUser')

      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
      // Create a new user
      const user = new User({
        email: req.body.email,
        password: hashedPassword,
      });
  
      // Save the user to the database
      await user.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.log(error,'error')

      res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

async function loginController(req, res)
{
    try {
        // Access the "user" collection in your database
        const db = client.db('Reports');
        const userCollection = db.collection('user'); // Use 'user' as the collection name
    
        // Extract login credentials from the request body
        const { email, password } = req.body;
    
        // Check if the user with the provided email exists
        const user = await userCollection.findOne({ email });
    
        if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }
    
        // Verify the password
        const passwordMatch = await bcrypt.compare(password, user.password);
    
        if (!passwordMatch) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }
    
        // You can generate a JWT token here and send it to the client for authentication
    
        res.status(200).json({ message: 'Login successful' });
      } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Login failed', error: error.message });
      }
}

module.exports = {signUpController, loginController}