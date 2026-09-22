import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const databaseUrl = new URL(process.env.DATABASE_URL!);

const caCert = fs.readFileSync(
  path.resolve(process.cwd(), "certs/ca.pem"),
  "utf-8"
);

const adapter = new PrismaMariaDb({
  host: databaseUrl.hostname,
  port: Number(databaseUrl.port),
  user: databaseUrl.username,
  password: decodeURIComponent(databaseUrl.password),
  database: databaseUrl.pathname.replace("/", ""),
  ssl: {
    ca: [caCert],
    rejectUnauthorized: true,
  },
  connectTimeout: 10000,
});

const prisma = new PrismaClient({
  adapter,
  log: ["error", "warn"],
});

export default prisma;