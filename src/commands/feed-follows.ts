import type { CommandName } from "./commands";
import type { SelectUser } from "src/lib/db/schema";
import { createFeedFollow, deleteFeedFollow } from "src/lib/db/queries/feed-follows";
import { getFeedFollowsForUser } from "src/lib/db/queries/feed-follows";
import { selectFeedByURL } from "src/lib/db/queries/feeds";

export async function handlerCreateFeedFollow(cmdName: CommandName, user: SelectUser, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <feed_url>`);
    }

    const feedURL = args[0];
    const feed = await selectFeedByURL(feedURL);

    if (!feed) throw new Error(`Feed not found: ${feedURL}`);

    const ffRow = await createFeedFollow(feed.id, user.id);

    console.log(`Feed follow created:`);
    printFeedFollow(ffRow.userName, ffRow.feedName);
}

export async function handlerListFeedFollow(_: CommandName, user: SelectUser) {
    const feedFollows = await getFeedFollowsForUser(user.id);

    if (feedFollows.length === 0) {
        console.log(`No feed follows found for this user.`);
        return;
    }

    console.log(`Feed follows for user %s:`, user.name);
    for (const ff of feedFollows) {
        console.log(`* %s`, ff.feedName);
    }
}

export async function handlerUnfollow(cmdName: CommandName, user: SelectUser, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <feed_url>`);
    }

    const feedURL = args[0];
    const feed = await selectFeedByURL(feedURL);

    if (!feed) {
        throw new Error(`Feed not found for url: ${feedURL}`);
    }

    const result = await deleteFeedFollow(feed.id, user.id);

    if (!result) {
        throw new Error(`Failed to unfollow feed: ${feedURL}`);
    }

    console.log(`%s unfollowed successfully!`, feed.name);
    return;
}

export function printFeedFollow(username: string, feedname: string) {
    console.log(`* User:          ${username}`);
    console.log(`* Feed:          ${feedname}`);
}