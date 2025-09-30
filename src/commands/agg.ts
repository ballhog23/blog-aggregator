import type { RSSFeed } from "../lib/rss/rss";
import { fetchFeed } from "../lib/rss/rss";

export async function handlerAggregate() {
    const res = await fetchFeed('https://www.wagslane.dev/index.xml');
}