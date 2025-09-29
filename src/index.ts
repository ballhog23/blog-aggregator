console.log('boot start')
import type { CommandName, CommandsRegistry } from "./commands/commands";
import { registerCommand, runCommand } from "./commands/commands";
import { handlerDeleteAllUsers, handlerLoginUser, handlerRegisterUser } from './commands/users';

async function main() {
	const args = process.argv.slice(2);

	if (args.length < 1) {
		console.log("usage: cli <command> [...args]");
		process.exit(1);
	}

	const commandsRegistry = {} as CommandsRegistry;
	registerCommand(commandsRegistry, "register", handlerRegisterUser);
	registerCommand(commandsRegistry, "login", handlerLoginUser);
	registerCommand(commandsRegistry, "reset", handlerDeleteAllUsers);

	const commandName = args[0] as CommandName;
	const commandArgs = args.slice(1);

	try {
		await runCommand(commandsRegistry, commandName, ...commandArgs);
		process.exit(0);
	} catch (e: any) {
		console.error(`Error running command ${commandName}: ${e?.message ?? e}`);
		process.exit(1);
	}
}

main();
