import { XMLParser } from "fast-xml-parser"

export type RSSFeed = {
    channel: RSSChannel
}

export type RSSChannel = {
    title: string,
    link: string,
    description: string,
    item: RSSItem[]
}

export type RSSItem = {
    title: string,
    link: string,
    description: string,
    pubDate: string
}

export async function fetchFeed(feedURL: string) {
    const options: RequestInit = {
        headers: {
            'User-Agent': 'gator',
            accept: 'application/rss+xml'
        }
    }
    const res = await fetch(feedURL, options);

    if (!res.ok) throw new Error(`failed to fetch feed: ${res.status} ${res.statusText}`);

    const xml = await res.text();
    const parser = new XMLParser();
    const parsed = parser.parse(xml);
    const channel = parsed.rss?.channel;

    if (!channel) throw new Error("failed to parse channel");

    const { title, link, description, item } = channel;

    if (!channel || !title || !link || !description || !item) {
        throw new Error('title, link, or description property is not present on channel object');
    }

    const items: any[] = Array.isArray(item) ?
        item :
        [item];

    const rssItems: RSSItem[] = [];

    for (const post of items) {
        const { title, link, description, pubDate } = post;

        if (!title || !link || !description || !pubDate) continue;

        rssItems.push({
            title,
            link,
            description,
            pubDate
        });
    }

    const rss = {
        channel: {
            title,
            link,
            description,
            item: rssItems
        }
    } satisfies RSSFeed;

    return rss;
}