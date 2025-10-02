import type { SelectFeed, SelectUser } from "src/lib/db/schema";
import type { CommandName } from "./commands";
import { printFeedFollow } from "./feed-follows";
import { getUserById } from "src/lib/db/queries/users";
import { insertFeed, selectAllFeeds } from "src/lib/db/queries/feeds";
import { createFeedFollow } from "src/lib/db/queries/feed-follows";

export async function handlerAddFeed(cmdName: CommandName, user: SelectUser, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <feed_name> <url>`);
    }

    const feedName = args[0];
    const url = args[1];
    const feed = await insertFeed(feedName, url, user.id);

    if (!feed) {
        throw new Error(`Failed to create feed`);
    }
    const feedFollow = await createFeedFollow(feed.id, user.id);
    printFeedFollow(user.name, feedFollow.feedName);

    console.log("Feed created successfully:");
    printFeed(feed, user);
}

export async function handlerListFeeds(_: CommandName) {
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
        console.log(`=====================================`);
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