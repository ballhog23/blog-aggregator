import type { CommandName, CommandsRegistry } from "./commands/commands";
import { registerCommand, runCommand } from "./commands/commands";
import { handlerGetAllUsers, handlerLoginUser, handlerRegisterUser } from './commands/users';
import { handlerDeleteAllTableRows } from "./commands/reset";
import { handlerAggregate } from "./commands/aggregate";
import { handlerAddFeed, handlerListFeeds } from "./commands/feeds";
import { handlerCreateFeedFollow, handlerListFeedFollow, handlerUnfollow } from "./commands/feed-follows";
import { middlewareLoggedIn } from "./lib/middleware/logged-in";
import { handlerBrowse } from "./commands/browse";

async function main() {
	const args = process.argv.slice(2);

	if (args.length < 1) {
		console.log("usage: cli <command> [...args]");
		process.exit(1);
	}

	const commandsRegistry = {} as CommandsRegistry;
	registerCommand(commandsRegistry, "register", handlerRegisterUser);
	registerCommand(commandsRegistry, "login", handlerLoginUser);
	registerCommand(commandsRegistry, "reset", handlerDeleteAllTableRows);
	registerCommand(commandsRegistry, "users", handlerGetAllUsers);
	registerCommand(commandsRegistry, "agg", handlerAggregate);
	registerCommand(commandsRegistry, "addfeed", middlewareLoggedIn(handlerAddFeed));
	registerCommand(commandsRegistry, "feeds", handlerListFeeds);
	registerCommand(commandsRegistry, "follow", middlewareLoggedIn(handlerCreateFeedFollow));
	registerCommand(commandsRegistry, "following", middlewareLoggedIn(handlerListFeedFollow));
	registerCommand(commandsRegistry, "unfollow", middlewareLoggedIn(handlerUnfollow));
	registerCommand(commandsRegistry, "browse", middlewareLoggedIn(handlerBrowse));

	const commandName = args[0] as CommandName;
	const commandArgs = args.slice(1);

	try {
		await runCommand(commandsRegistry, commandName, ...commandArgs);
	} catch (err) {
		if (err instanceof Error) {
			console.error(`Error running command ${commandName}: ${err.message}`);
		} else {
			console.error(`Error running command ${commandName}: ${err}`);
		}
		process.exit(1);
	}

	process.exit(0);
}

main();