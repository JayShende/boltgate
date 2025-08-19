#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = process.cwd();

// 1. Install dependencies
const npmDeps = [
  "next-auth@beta",
  "prisma",
  "@auth/prisma-adapter",
  "@prisma/client",
  "react-icons",
];

console.log("🧩 Installing npm packages...");
try {
  execSync(`npm install ${npmDeps.join(" ")}`, { stdio: "inherit" });
} catch (err) {
  console.error("❌ Failed to install npm packages.");
  process.exit(1);
}

// 2. Run NPX commands
const npxScripts = [
  "prisma init",
  "shadcn@latest init",
  "shadcn@latest add button",
  "shadcn@latest add card",
];

console.log("⚡ Running NPX scripts...");
for (const script of npxScripts) {
  try {
    execSync(`npx ${script}`, { stdio: "inherit" });
  } catch (err) {
    console.error(`❌ Failed running: npx ${script}`);
  }
}

// 3. Copy or merge template files
console.log("📁 Copying and merging template files...");
const templateDir = path.join(__dirname, "../template");

function mergeOrCopyFile(srcPath, destPath) {
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  if (path.basename(destPath) === "schema.prisma") {
    // Always overwrite Prisma schema
    fs.copyFileSync(srcPath, destPath);
    console.log(
      `📝 Replaced Prisma schema: ${path.relative(projectRoot, destPath)}`
    );
    return;
  }

  if (fs.existsSync(destPath)) {
    const existing = fs.readFileSync(destPath, "utf8");
    const incoming = fs.readFileSync(srcPath, "utf8");

    if (!existing.includes(incoming.trim())) {
      fs.appendFileSync(
        destPath,
        `\n\n// 🔁 Merged from Boltgate template\n${incoming}`
      );
      console.log(
        `🔁 Merged into existing: ${path.relative(projectRoot, destPath)}`
      );
    } else {
      console.log(
        `✅ Already up to date: ${path.relative(projectRoot, destPath)}`
      );
    }
  } else {
    fs.copyFileSync(srcPath, destPath);
    console.log(`📄 Created: ${path.relative(projectRoot, destPath)}`);
  }
}

function walkAndProcess(srcDir, destDir) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      walkAndProcess(srcPath, destPath);
    } else {
      mergeOrCopyFile(srcPath, destPath);
    }
  }
}

try {
  walkAndProcess(templateDir, projectRoot);
} catch (err) {
  console.error("❌ Failed copying/merging files.");
  process.exit(1);
}

console.log("✅ Boltgate: NextAuth setup complete!");
console.log("Next Step -> Replace the DATABASE_URL in .env with Your Actual URL");
console.log("✅ Then Run npx Prisma migrate");
