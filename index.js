require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phone: String,
    investmentAmount: Number,
    dateRegistered: { type: Date, default: Date.now },
    investorAccountNumber: String,
    investorBankName: String,
    nextOfKinName: String,
    nextOfKinPhone: String
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => res.status(200).render("index"));

app.get("/register", (req, res) => res.status(200).render("register"));

// register route
app.post("/register", async (req, res) => {
    try {
        const {
            fullName, email, phone, investmentAmount,
            investorAccountNumber, investorBankName,
            nextOfKinName, nextOfKinPhone
        } = req.body;

        // Check for required fields
        if (!fullName || !email || !phone || !investmentAmount || !investorAccountNumber || !investorBankName || !nextOfKinName || !nextOfKinPhone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create new user with the additional data
        const newUser = new User({
            fullName, email, phone, investmentAmount,
            investorAccountNumber, investorBankName,
            nextOfKinName, nextOfKinPhone
        });

        // Save the new user to the database
        await newUser.save();

        res.status(201).json({ message: "Registration successful!" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});


app.listen(PORT, () => console.log("Server running on port...", PORT));