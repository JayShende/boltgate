#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = process.cwd();

// 🔍 Detect package manager (defaults to npm)
function detectPackageManager(startDir) {
  let dir = startDir;
  while (dir !== path.parse(dir).root) {
    if (fs.existsSync(path.join(dir, "pnpm-lock.yaml"))) return "pnpm";
    if (fs.existsSync(path.join(dir, "yarn.lock"))) return "yarn";
    if (fs.existsSync(path.join(dir, "package-lock.json"))) return "npm";
    dir = path.dirname(dir); // go one level up
  }
  return "npm"; // fallback
}
const packageManager = detectPackageManager(projectRoot);


// 1. Install dependencies
const deps = [
  "next-auth@beta",
  "prisma",
  "@auth/prisma-adapter",
  "@prisma/client",
  "react-icons",
];

console.log(`🧩 Installing packages with ${packageManager}...`);
try {
  if (packageManager === "pnpm") {
    execSync(`pnpm add ${deps.join(" ")}`, { stdio: "inherit" });
  } else if (packageManager === "yarn") {
    execSync(`yarn add ${deps.join(" ")}`, { stdio: "inherit" });
  } else {
    execSync(`npm install ${deps.join(" ")}`, { stdio: "inherit" });
  }
} catch (err) {
  console.error("❌ Failed to install dependencies.");
  process.exit(1);
}

// 2. Run NPX/CLI commands
const npxScripts = [
  "prisma init",
  "shadcn@latest init",
  "shadcn@latest add button",
  "shadcn@latest add card",
];

console.log("⚡ Running setup scripts...");
for (const script of npxScripts) {
  try {
    execSync(
      packageManager === "yarn"
        ? `yarn dlx ${script}`
        : `npx ${script}`,
      { stdio: "inherit" }
    );
  } catch (err) {
    console.error(`❌ Failed running: ${script}`);
  }
}

// 3. Copy or merge template files
console.log("📁 Copying and merging template files...");
const templateDir = path.join(__dirname, "../template");

function mergeOrCopyFile(srcPath, destPath) {
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  if (path.basename(destPath) === "schema.prisma") {
    fs.copyFileSync(srcPath, destPath);
    console.log(`📝 Replaced Prisma schema: ${path.relative(projectRoot, destPath)}`);
    return;
  }

  if (fs.existsSync(destPath)) {
    const existing = fs.readFileSync(destPath, "utf8");
    const incoming = fs.readFileSync(srcPath, "utf8");

    if (!existing.includes(incoming.trim())) {
      fs.appendFileSync(destPath, `\n\n// 🔁 Merged from Boltgate\n${incoming}`);
      console.log(`🔁 Merged into: ${path.relative(projectRoot, destPath)}`);
    } else {
      console.log(`✅ Already up to date: ${path.relative(projectRoot, destPath)}`);
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
console.log("👉 Replace DATABASE_URL in .env with your DB URL");
console.log("👉 Then run:");
console.log(`   ${packageManager} exec prisma migrate dev`);
