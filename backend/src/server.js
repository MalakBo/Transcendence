import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./modules/auth/auth.config.db.js";
import { seedAdmin } from "./modules/profiles/seedAdmin.js";

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB();
    await seedAdmin();
    app.listen(PORT, () => {
      console.log(`EventMatch API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

start();