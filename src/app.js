const express = require("express");
const app = express();
const connectDB = require("./config/database.js");

const UserModel = require("./models/userSchema.js");

// Add middleware to parse JSON
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello from the server hi ");
});

// Fixed route with "/" and proper string values
app.post("/Signup", async (req, res) => {
    try {
        const user = new UserModel({
            FirstName: "lol",
            LastName: "Rehyan",
            Email: "mdafa@example.com",
            Password: "helloguys"
        });
        
        await user.save();
        res.send("user added successfullyyyy");
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
});

connectDB()
    .then(() => {
        console.log("Database connected");
        app.listen(5000, () => {
            console.log("Server is running on port 5000");
        });
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });