import * as dotenv from "dotenv";

// config for .env file
const configPath = __dirname + "/../" +"/.env";
dotenv.config({ path: configPath });

const DB_URI = process.env.DB_URI as string;
const JWT_SECRET = process.env.JWT_SECRET as string;

export {
    DB_URI,
    JWT_SECRET
}