import app from "./app.js";
import cors from "cors";
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
