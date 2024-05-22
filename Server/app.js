const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const internRoutes = require('./routes/StagiairesRouter');
const parrainRoutes = require('./routes/ParrainRouter');
const taskRoutes = require('./routes/TaskRouter');
const documentRoutes = require('./routes/DocumentRouter');
const chatRoutes = require('./routes/ChatRoutes');
const messageRoutes = require('./routes/MessageRoutes');
const auth = require('./middlewares/Auth');

// Load environment variables
const dotenv = require('dotenv');
dotenv.config({ path: "./.env" });




// Enable CORS
app.use(cors());

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


/* ---------for Local database connection---------- */
const DB = process.env.DATABASE_URL;
mongoose.connect(DB)
    .then((con) => console.log("DB connection successfully..!"))
    .catch(err => console.error("Error connecting to database:", err));

// Routes
app.use("/interns",internRoutes);
app.use("/parrains", parrainRoutes);
app.use(auth.verifyToken);
app.use("/tasks", taskRoutes);
app.use("/documents", documentRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

app.get("/",(req,res)=>{
    res.json({message:'Server Works Well'})
});




