import { EMOJI_GLUE_CHARACTER } from "@/utils/emojiUtils/const.emojiFetcher";
import { EmojiData } from "@/utils/emojiUtils/types.emojiFetcher";

const GITHUB_UNICODE_REGEX = /unicode\/(.*)\.png/;

const GITHUB_EMOJI_URL = "https://api.github.com/emojis";

/**
 * Given a json object with emoji metadata from the github API
 * The data is formatted into a structure that the rest of the Emojive frontend
 * can use
 * 
 * https://docs.github.com/en/rest/emojis/emojis 
 * 
 * @param {any[]} jsonResponse response from Github Emoji API.
 * @returns {EmojiData[]}
 */
function githubEmojiJsonToEmojiDataList(jsonResponse: Object): EmojiData[] {
    const emojiData: EmojiData[] = Object.entries(jsonResponse).map(([emojiName, emojiUrl]: [string, string]) => {

        const unicodeString = emojiUrl.match(GITHUB_UNICODE_REGEX);
        if (unicodeString === null || unicodeString.length < 2) return null;

        const emojiCharacter = unicodeString[1]
            .split("-")
            .map(unicode => String.fromCodePoint(parseInt(unicode, 16)))
            .join(EMOJI_GLUE_CHARACTER);

        const datum: EmojiData = {
            name: emojiName.toLowerCase(),
            shortNames: [emojiName.toLowerCase()],
            url: emojiUrl,
            character: emojiCharacter
        }

        return datum;

    }).filter(datum => datum !== null)

    return emojiData;
}

export {
    GITHUB_EMOJI_URL, githubEmojiJsonToEmojiDataList
};
