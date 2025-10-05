import type { CommandName } from "./commands";
import type { SelectUser } from "src/lib/db/schema";
import { getPostsForUser } from "src/lib/db/queries/posts";


export async function handlerBrowse(cmdName: CommandName, user: SelectUser, ...args: string[]) {
    if (args.length > 1) {
        throw new Error(`usage: ${cmdName} [limit] limit defaulted to 2, pass any number`);
    }

    const limit = parseInt(args[0]) || 2;
    const posts = await getPostsForUser(user.id, limit);

    if (!posts) {
        throw new Error(`No posts found for User: ${user.name}`);
    }

    console.log(`Found ${posts.length} posts for user ${user.name}`);
    for (let post of posts) {
        console.log(`${post.publishedAt} from ${post.feedName}`);
        console.log(`--- ${post.title} ---`);
        console.log(`    ${post.description}`);
        console.log(`Link: ${post.url}`);
        console.log(`=====================================`);
    }
}