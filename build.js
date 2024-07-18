import fs from "node:fs/promises";
import { createWriteStream } from "node:fs";
import archiver from "archiver";

try{
	// Update data
	const data = await fs.readFile("data.json", {encoding: "utf8"});
	const prepend = "referenceData = ";

	await fs.writeFile("./src/js/data.js", prepend + data);

	// Create zip file
	await fs.mkdir("./dist", { recursive: true });
	const outputPath = "./dist/p5-reference.zip";
	const output = createWriteStream(outputPath);
	output.on("close", () => {
		console.log("Finished building offline reference bundle.");
	});

	const archive = archiver("zip", {
		zlib: { level: 9 }
	});
	archive.on("error", (err) => {
		throw err
	});
	archive.pipe(output);
	archive.directory("src/", false);
	archive.finalize();

}catch(err){
	console.error("Cannot build offline reference.");
	console.error(err);
}