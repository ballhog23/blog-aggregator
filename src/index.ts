import { readConfig, setUser } from "./config";

function main() {
	setUser("Caleb");
	const cfg = readConfig();
	console.log(cfg);
}

main();
