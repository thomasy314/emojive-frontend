import { EmojiData } from "@/utils/emojiUtils/types.emojiFetcher";

type EmojiSearchQuery = {
    targetName: string,
    targetShortName: string,
    maxResults: number
}

function doNamesMatch(targetName: string, otherName: string): boolean {
    return targetName.length > 0 && otherName.includes(targetName);
}

function emojiDataListSearcher(emojiDataList: EmojiData[], searchInput: EmojiSearchQuery): EmojiData[] {
    const { targetName, targetShortName, maxResults } = searchInput;

    const results: EmojiData[] = [];

    for (const datum of emojiDataList) {
        if (results.length >= maxResults) break;
        if (datum.shortNames.some(shortName => doNamesMatch(targetShortName, shortName)) || // Check short names
            doNamesMatch(targetName, datum.name)) { // Check normal name
            results.push(datum)
        }
    }

    return results;
}

export {
    emojiDataListSearcher
};

export type {
    EmojiSearchQuery
};

