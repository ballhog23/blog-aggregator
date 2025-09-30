import { XMLParser } from "fast-xml-parser"

export type RSSFeed = {
    rss: {
        channel: RSSChannel
    }
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
        method: 'GET',
        headers: {
            'User-Agent': 'gator'
        }
    }
    const res = await fetch(feedURL, options);

    if (!res) throw new Error('error fetching RSS feed');

    const feed = await res.text();
    if (typeof feed !== 'string') throw new Error('error creating string from response');

    const parser = new XMLParser();
    const parsed: RSSFeed = parser.parse(feed);
    const rss = parsed.rss;
    const { channel } = rss;

    if (!channel) throw new Error('RSS feed does not have channel property');

    const { title, link, description, item } = channel;

    if (!title || !link || !description) {
        throw new Error('title, link, or description property is not present on channel object');
    }

    if (title.length < 1 || link.length < 1 || description.length < 1) {
        throw new Error('title, link, or description property is an empty string');
    }

    const hasItemProp = Object.hasOwnProperty('item');
    if (!hasItemProp && !Array.isArray(item)) {
        channel.item = [];
    }

    if (item.length === 0) return {};

    const cleanedItemsArray: RSSItem[] = [];

    for (const post of item) {
        const [title, link, description, pubDate] = item;

        if (!title || !link || !description || !pubDate) continue;

        cleanedItemsArray.push(post);
    }

    const RSSData = {
        rss: {
            channel: {
                title,
                link,
                description,
                item: cleanedItemsArray
            }
        }
    } satisfies RSSFeed;

    console.dir(RSSData, { depth: null })
    return RSSData;
}