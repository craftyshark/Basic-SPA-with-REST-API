const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

// Initialize the app
const app = express();

// Set up middleware
app.use(bodyParser.json());

// Serve the static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// Sample user data
const data = require('./users.json');
let users = data.users;

// GET /user - returns a list of registered users
app.get('/user', (req, res) => {
  res.json(users);
});

// GET /user/:id - returns the details of a specific user
app.get('/user/:id', (req, res) => {
  const id = req.params.id;
  const user = users.find(u => u.id === parseInt(id));
  if (!user) return res.status(404).send('User not found');
  res.json(user);
});

// POST /user - creates a new user
app.post('/user', (req, res) => {
    const user = req.body;
    user.id = users.length + 1;
    users.push(user);
  
    // Write the updated user data to the users.json file
    const updatedData = JSON.stringify({ users });
    fs.writeFile('./users.json', updatedData, err => {
      if (err) return res.status(500).send('Error writing to file');
      res.json({ id: user.id });
    });
});

// PUT /user/:id - updates an existing user
app.put('/user/:id', (req, res) => {
  const id = req.params.id;
  const userIndex = users.findIndex(u => u.id === parseInt(id));
  if (userIndex === -1) return res.status(404).send('User not found');

  // Update the user in the users array
  users[userIndex] = { ...users[userIndex], ...req.body };

  // Write the updated user data to the users.json file
  const updatedData = JSON.stringify({ users });
  fs.writeFile('./users.json', updatedData, err => {
    if (err) return res.status(500).send('Error writing to file');
    res.json({ message: 'User updated successfully' });
  });
});

// DELETE /user/:id - deletes a user
app.delete('/user/:id', (req, res) => {
  const id = req.params.id;
  const userIndex = users.findIndex(u => u.id === parseInt(id));
  if (userIndex === -1) return res.status(404).send('User not found');
  users.splice(userIndex, 1);

  // Write the updated user data to the users.json file
  const updatedData = JSON.stringify({ users });
  fs.writeFile('./users.json', updatedData, err => {
    if (err) return res.status(500).send('Error writing to file');
    res.json({ message: 'User deleted successfully' });
  });
});

// GET /search?firstName=John - searches for users by their first name
app.get('/search', (req, res) => {
  const firstName = req.query.firstName;
  const matchingUsers = users.filter(u => u.firstName.toLowerCase() === firstName.toLowerCase());
  res.json(matchingUsers);
});





// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
