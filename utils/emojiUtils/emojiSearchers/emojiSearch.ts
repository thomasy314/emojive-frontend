import { EmojiData } from "@/types/types.emojis";

type EmojiSearchQuery = {
    targetName: string,
    targetShortName: string,
    maxResults: number
}

/**
 * Method which compares the input string to a target string to see if they match
 * @param {string} targetName 
 * @param {string} otherName 
 * @returns {boolean}
 */
function doNamesMatch(targetName: string, otherName: string): boolean {
    return targetName.length > 0 && otherName.includes(targetName);
}

/**
 * Given query parameters, searches a list of EmojiData for any emojis that fit requirements
 * @param {EmojiData} emojiDataList list of emoji data to search
 * @param {EmojiSearchQuery} searchInput
 * @returns 
 */
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

