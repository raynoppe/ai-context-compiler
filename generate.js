const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function getUserInput() {
  let folderToScan;
  do {
    folderToScan = (await prompt("Enter the folder to scan: ")).trim();
    if (!fs.existsSync(folderToScan)) {
      console.error(
        `The directory "${folderToScan}" does not exist. Please enter a valid path.`
      );
    }
  } while (!fs.existsSync(folderToScan));

  const excludeNodeModules =
    (await prompt("Exclude node_modules folder? (Y/n): ")).toLowerCase() !==
    "n";
  const excludeDotFolders =
    (
      await prompt("Exclude folders starting with a dot (.)? (Y/n): ")
    ).toLowerCase() !== "n";
  const additionalExcludeFolders = (
    await prompt(
      "Enter additional folders to exclude (comma-separated, press enter for none): "
    )
  )
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);
  const excludeExtensions = (
    await prompt(
      "Enter file extensions to exclude (comma-separated, press enter for none): "
    )
  )
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  const createContextDoc =
    (await prompt("Create a context document? (Y/n): ")).toLowerCase() !== "n";
  const defaultExtensions = ["js", "jsx", "ts", "tsx", "vue"];
  const includeExtensions = (
    await prompt(
      `Enter additional file extensions to include in the context document (comma-separated, default: ${defaultExtensions.join(
        ","
      )}): `
    )
  )
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  const filePrefix = (
    await prompt("Enter a prefix for output files (press enter for none): ")
  ).trim();

  return {
    folderToScan,
    excludeNodeModules,
    excludeDotFolders,
    additionalExcludeFolders,
    excludeExtensions,
    createContextDoc,
    includeExtensions: [
      ...new Set([...defaultExtensions, ...includeExtensions]),
    ],
    filePrefix,
  };
}

function generateTree(dir, prefix = "", isLast = true, options) {
  const base = path.basename(dir);

  if (
    (options.excludeNodeModules && base === "node_modules") ||
    (options.excludeDotFolders && base.startsWith(".")) ||
    options.additionalExcludeFolders.includes(base)
  ) {
    return "";
  }

  const newPrefix = prefix + (isLast ? "    " : "│   ");
  let tree = prefix + (isLast ? "└── " : "├── ") + base + "\n";

  try {
    const files = fs.readdirSync(dir);
    files.forEach((file, index) => {
      const filePath = path.join(dir, file);
      const isDirectory = fs.statSync(filePath).isDirectory();
      const isLastItem = index === files.length - 1;
      const ext = path.extname(file).slice(1);

      if (isDirectory) {
        tree += generateTree(filePath, newPrefix, isLastItem, options);
      } else if (!options.excludeExtensions.includes(ext)) {
        tree += newPrefix + (isLastItem ? "└── " : "├── ") + file + "\n";
      }
    });
  } catch (err) {
    console.error(`Error reading directory ${dir}: ${err}`);
  }

  return tree;
}

function ensureOutputDirectory() {
  const outputDir = path.join(process.cwd(), "output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  return outputDir;
}

function writeTreeToFile(tree, outputDir, filePrefix) {
  const fileName = `${filePrefix}directory_tree.txt`.replace(/^_/, "");
  const outputPath = path.join(outputDir, fileName);
  try {
    fs.writeFileSync(outputPath, tree, "utf8");
    console.log(`Tree structure has been written to ${outputPath}`);
  } catch (err) {
    console.error(`Error writing tree to file: ${err}`);
  }
}

function createContextDocument(dir, options, outputDir, filePrefix) {
  let context = "";

  function traverseDirectory(currentDir) {
    try {
      const files = fs.readdirSync(currentDir);
      for (const file of files) {
        const filePath = path.join(currentDir, file);
        const isDirectory = fs.statSync(filePath).isDirectory();
        const ext = path.extname(file).slice(1);

        if (isDirectory) {
          if (
            !(options.excludeNodeModules && file === "node_modules") &&
            !(options.excludeDotFolders && file.startsWith(".")) &&
            !options.additionalExcludeFolders.includes(file)
          ) {
            traverseDirectory(filePath);
          }
        } else if (options.includeExtensions.includes(ext)) {
          const relativePath = path.relative(dir, filePath);
          const content = fs.readFileSync(filePath, "utf8");
          context += `// ${relativePath}\n${content}\n\n`;
        }
      }
    } catch (err) {
      console.error(`Error processing directory ${currentDir}: ${err}`);
    }
  }

  traverseDirectory(dir);

  const fileName = `${filePrefix}context_document.txt`.replace(/^_/, "");
  const outputPath = path.join(outputDir, fileName);
  try {
    fs.writeFileSync(outputPath, context, "utf8");
    console.log(`Context document has been written to ${outputPath}`);
  } catch (err) {
    console.error(`Error writing context document: ${err}`);
  }
}

async function main() {
  try {
    const options = await getUserInput();
    const outputDir = ensureOutputDirectory();

    const tree = ".\n" + generateTree(options.folderToScan, "", true, options);
    writeTreeToFile(tree, outputDir, options.filePrefix);

    if (options.createContextDoc) {
      createContextDocument(
        options.folderToScan,
        options,
        outputDir,
        options.filePrefix
      );
    }
  } catch (err) {
    console.error(`An error occurred: ${err}`);
  } finally {
    rl.close();
  }
}

main();
