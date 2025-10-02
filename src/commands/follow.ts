import type { CommandName } from "./commands";
import { createFeedFollows } from "src/lib/db/queries/follows";
import { selectFeedByURL } from "src/lib/db/queries/feeds";
import { readConfig } from "src/config";
import { getUser } from "src/lib/db/queries/users";

export async function handlerCreateFeedFollow(cmdName: CommandName, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <url>`);
    }
    const feedUrl = args[0];
    const feed = await selectFeedByURL(feedUrl);

    if (!feed) throw new Error(`Feed URL: ${feedUrl} was not found.`)

    const config = readConfig();
    const curUser = config.currentUserName;
    const user = await getUser(curUser);
    const feedFollows = await createFeedFollows(feed.id, user.id);

    if (!feedFollows) throw new Error(`Feed follow data for User: ${user.id} not located`);

    console.log(`FEED: ${feedFollows.feedName} FOLLOWED BY: ${feedFollows.userName}`);
}