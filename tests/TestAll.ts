import { readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runAllTests() {
    const files = await readdir(__dirname);

    const testFiles = files
        .filter(file => file.startsWith("Test"))
        .filter(file => file.endsWith(".ts"))
        .filter(file => file !== "Test.ts")
        .sort();

    for (const file of testFiles) {
        console.log(`Running ${file}...`);

        await import(
            pathToFileURL(join(__dirname, file)).href
        );
    }

    console.log("All test files completed.");
}

runAllTests().catch(error => {
    console.error(error);
    process.exit(1);
});