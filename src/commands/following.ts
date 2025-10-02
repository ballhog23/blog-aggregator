import type { CommandName } from "./commands";
import { getFeedFollowsForUser } from "src/lib/db/queries/follows";
import { readConfig } from "src/config";
import { getUser } from "src/lib/db/queries/users";

export async function handlerGetFeedFollows(_: CommandName) {
    const config = readConfig();
    const curUser = config.currentUserName;
    const user = await getUser(curUser);
    const follows = await getFeedFollowsForUser(user.id);

    if (follows.length === 0) {
        throw new Error(`0 feed follows found for User: ${user}`);
    }

    for (const follow of follows) {
        console.log(follow.feedName)
    }
}