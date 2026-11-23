import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import contractJson from "../../prisma/contract.json" with { type: "json" };

const db = postgres({ contractJson, url: process.env.DATABASE_URL });

const connectDB = async () => {
  try {
    await db.connect();
    console.log("DB connected via Prisma");
  } catch (error) {
    console.error(`DB connection error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await db.close();
};

export { db, connectDB, disconnectDB };