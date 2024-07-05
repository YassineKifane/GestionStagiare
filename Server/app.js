const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: "./.env" });

const sequelize = require('./config/database');
const internRoutes = require('./routes/StagiairesRouter');
const parrainRoutes = require('./routes/ParrainRouter');
const taskRoutes = require('./routes/TaskRouter');
const documentRoutes = require('./routes/DocumentRouter');
const chatRoutes = require('./routes/ChatRoutes');
const messageRoutes = require('./routes/MessageRoutes');
const auth = require('./middlewares/Auth');

// Enable CORS
app.use(cors());

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
sequelize.authenticate()
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Unable to connect to the database:', err));

// Synchronize models
sequelize.sync()
    .then(() => console.log('Database synchronized'))
    .catch(err => console.error('Error synchronizing the database:', err));

// Routes
app.use("/interns",internRoutes);
app.use("/parrains", parrainRoutes);
app.use(auth.verifyToken);
app.use("/tasks", taskRoutes);
app.use("/documents", documentRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);



app.get("/", (req, res) => {
    res.json({ message: 'Server Works Well' });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
