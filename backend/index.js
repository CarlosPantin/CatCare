const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const catRoutes = require("./routes/catRoutes");
const generalNotesRoutes = require("./routes/generalNotes");
const importantDatesRoutes = require("./routes/importantDates");
const dietAndFeedingRoutes = require("./routes/dietAndFeeding");
const medicalHistoryRoutes = require("./routes/medicalHistory");
const shoppingListRoutes = require("./routes/shoppingList");
const path = require("path");

dotenv.config();

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api", catRoutes);
app.use("/api/generalnotes", generalNotesRoutes);
app.use("/api/importantdates", importantDatesRoutes);
app.use("/api/dietandfeeding", dietAndFeedingRoutes);
app.use("/api/medicalhistory", medicalHistoryRoutes);
app.use("/api/shoppingList", shoppingListRoutes);

const allowedOrigins = [
  "http://localhost:3000",
  "https://catcare-vert.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
