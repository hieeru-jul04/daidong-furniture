import app from "./app.js";
import createDefaultAdmin from "./src/utils/createDefaultAdmin.js";

const PORT = process.env.PORT || 8080;

// Create default admin account
createDefaultAdmin();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));