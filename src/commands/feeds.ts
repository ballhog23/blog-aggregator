import type { SelectFeed, SelectUser } from "src/lib/db/schema";
import type { CommandName } from "./commands";
import { getUser, getUserById } from "src/lib/db/queries/users";
import { insertFeed, selectAllFeeds } from "src/lib/db/queries/feeds";
import { createFeedFollows } from "src/lib/db/queries/follows";
import { readConfig } from "src/config";

export async function handlerAddFeed(cmdName: CommandName, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <name> <url>`);
    }
    const config = readConfig();
    const user = await getUser(config.currentUserName);

    if (!user) {
        throw new Error(`User ${config.currentUserName} not found`);
    }

    const name = args[0];
    const url = args[1];
    const feed = await insertFeed(name, url, user.id);
    const feedFollows = await createFeedFollows(feed.id, user.id);
    console.log(`Feed: ${feedFollows.feedName} Followed By: ${feedFollows.userName}`);
}

export async function handlerSelectAllFeeds(_: CommandName) {
    const feeds = await selectAllFeeds();

    if (feeds.length === 0) {
        console.log('No feeds found');
        return;
    }

    console.log(`Found %d feeds:\n`, feeds.length);
    for (const feed of feeds) {
        const user = await getUserById(feed.userId);
        if (!user) throw new Error(`failed to find feed for ${feed.id}`);
        printFeed(feed, user);
    }
}

function printFeed(feed: SelectFeed, user: SelectUser) {
    console.log(`* ID:            ${feed.id}`);
    console.log(`* Created:       ${feed.createdAt}`);
    console.log(`* Updated:       ${feed.updatedAt}`);
    console.log(`* Name:          ${feed.name}`);
    console.log(`* URL:           ${feed.url}`);
    console.log(`* User:          ${user.name}`);
}