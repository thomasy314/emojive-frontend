/*
    Fetches emoji data from the Emoji-Data github
    https://github.com/iamcal/emoji-data
*/

import { EmojiData } from "@/utils/emojiUtils/types.emojiFetcher";

const EMOJI_DATA_URL = "https://raw.githubusercontent.com/iamcal/emoji-data/master/emoji.json";

/**
 * Given a list of data from the Emoji Data github repo
 * The data is formatted into a structure that the rest of the Emojive frontend
 * can use
 * @param {any[]} jsonResponse response from Emoji Data github repo.
 * @returns {EmojiData[]}
 */
function emojiDataEmojiJsonToEmojiDataList(jsonResponse: any[]): EmojiData[] {
    const emojiData: EmojiData[] = jsonResponse.map((emojiDatum: any) => {

        const unicodeCharacter = emojiDatum.unified
            .split("-")
            .map((unicode: string) => String.fromCodePoint(parseInt(unicode, 16)))
            .join("")

        const newData: EmojiData = {
            name: emojiDatum.name.toLowerCase(),
            shortNames: emojiDatum.short_names.map((name: string) => name.toLowerCase()),
            url: "",
            character: unicodeCharacter
        }

        return newData;
    });

    return emojiData;
}

export {
    EMOJI_DATA_URL, emojiDataEmojiJsonToEmojiDataList
};
