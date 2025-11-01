#!/usr/bin/env node
/**
 * scripts/checkDb.js
 * Simple script to load .env and try connecting to MongoDB using mongoose.
 * Usage: node scripts/checkDb.js
 */
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8");
  content.split(/\r?\n/).forEach((line) => {
    line = line.trim();
    if (!line || line.startsWith("#")) return;
    const eq = line.indexOf("=");
    if (eq === -1) return;
    const key = line.substring(0, eq).trim();
    let val = line.substring(eq + 1).trim();
    // Remove surrounding quotes if present
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.substring(1, val.length - 1);
    }
    process.env[key] = val;
  });
}

async function run() {
  const repoRoot = path.resolve(__dirname, "..");
  const envPath = path.join(repoRoot, ".env");
  console.log("Loading env from", envPath);
  loadEnvFile(envPath);

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not found in .env or environment");
    process.exit(1);
  }

  console.log("Attempting to connect to MongoDB...");
  try {
    await mongoose.connect(uri, {
      // useUnifiedTopology/useNewUrlParser are default in modern mongoose, but keep minimal options
    });
    console.log(
      "Connected to MongoDB — readyState =",
      mongoose.connection.readyState
    );
    await mongoose.disconnect();
    console.log("Disconnected cleanly");
    process.exit(0);
  } catch (err) {
    console.error("Failed to connect to MongoDB:");
    console.error(err);
    process.exit(1);
  }
}

run();
