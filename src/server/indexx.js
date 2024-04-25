/* eslint-disable no-undef */
import Realm from 'realm-web'
import express, { json } from 'express';
import jwt from 'jsonwebtoken';
import { App } from "realm-web";

const app = express();
const PORT = process.env.PORT || 3000;

// Secret key for JWT token signing
const secretKey = 'ewrfefefrfeffhgfajdfadyqretjavbcmhasdfuewtetwgqavdhgwafdhawfdashdfsahdgsa';

app.use(json());
const realmApp = new App({
    id: 'users-ekiix',
  });
// Dummy user data for demonstration
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];

// Authentication endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find user by username and password (replace with your actual authentication logic)
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Generate JWT token
  const token = jwt.sign({ uid: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
  const decodedToken = jwt.decode(token);

  // Print the decoded token
  console.log("dfsdfsdfsdfsdfsdfsf",decodedToken);
  // Authenticate with Realm using the token
  const credentials = Realm.Credentials.jwt(token);
  console.log("---------------------------------------------------------------------------------------------------credentials-------------------------------------------------------------------------------------------->>>>...", credentials);
  try {
    const user1 = await realmApp.logIn(credentials);
    console.log(user1);
    // Send the token in the response
    res.json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});