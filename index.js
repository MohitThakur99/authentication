import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { authenticateJWT, isAdmin} from "./middleware/authMiddleware.js"

// routes
import user from "./routes/user.js";

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use("/auth",user);

const port = 4000;

app.get("/", (req, res) => {
    res.json("Setup success");
})

// Protected route for regular users
app.get('/user/dashboard', authenticateJWT, (req, res) => {
    res.json({ message: `Welcome to your dashboard, User ID: ${req.user.id}` });
  });
  
// Protected route for admins
app.get('/admin/dashboard', authenticateJWT, isAdmin, (req, res) => {
    res.json({ message: `Welcome to the admin dashboard, Admin ID: ${req.user.id}` });
});

app.listen(port, () => {
    console.log(`server running on ${port}🚀`);
})