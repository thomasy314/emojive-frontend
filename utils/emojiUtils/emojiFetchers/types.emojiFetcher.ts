/**
 * Common data structure for storing information retrieved from third parties about emojis for Emojive
 */
type EmojiData = {
    name: string,
    shortNames: string[]
    url: string,
    character: string
}

export type {
    EmojiData
}
