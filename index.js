const express = require('express');
const cors = require('cors');

const { checkUser } = require('./middleware/auth.middleware.js');
const profileRoutes = require('./routes/profile.route.js');
const authRoutes = require('./routes/auth.route.js');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Learn Finance API'
  })
})

app.use('/user', authRoutes);

app.use(checkUser);

app.use('/profile', profileRoutes);

app.listen(process.env.PORT || 3000, '0.0.0.0');