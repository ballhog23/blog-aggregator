import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { fetchFeed } from "../lib/rss/rss";
import { SelectFeed } from "src/lib/db/schema";

export async function handlerAggregate(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <time_between_reqs>`)
    }

    const timeArg = args[0];
    const timeBetweenRequests = parseDuration(timeArg);
    if (!timeBetweenRequests) {
        throw new Error(
            `invalid duration: ${timeArg} — use format 1h 30m 15s or 3500ms`,
        );
    }

    console.log(`Collecting feeds every ${timeArg}...`);

    // run the first scrape immediately
    scrapeFeeds().catch(handleError);

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, timeBetweenRequests);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        })
    });
}

async function scrapeFeeds() {

    const feed = await getNextFeedToFetch();
    if (!feed) {
        console.log(`No feeds to fetch.`);
        return;
    }

    console.log(`Found a feed to fetch!`);
    scrapeFeed(feed);
}

async function scrapeFeed(feed: SelectFeed) {
    await markFeedFetched(feed.id);

    const feedData = await fetchFeed(feed.url);

    console.log(
        `Feed ${feed.name} collected, ${feedData.channel.item.length} posts found`,
    );

    // const items = feedData.channel.item;

    // for (const item of items) {
    //     console.log(item.title)
    // }
}

function parseDuration(duration: string) {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = duration.match(regex);

    if (!match) return;

    const conversionString = match[2];
    const value = Number(match[1]);

    switch (conversionString) {
        case 'ms':
            return value;
        case 's':
            return value * 1000;
        case 'm':
            return value * 1000 * 60;
        case 'h':
            return value * 1000 * 60 * 60;
        default:
            return;
    }
}

function handleError(err: unknown) {
    console.error(
        `Error scraping feeds: ${err instanceof Error ? err.message : err}`,
    );
}