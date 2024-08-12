function hasOnlyEmojis(text: string): boolean {
    return text.replaceAll(/\p{Extended_Pictographic}/gu, "").length > 0;
}

export {
    hasOnlyEmojis
};
