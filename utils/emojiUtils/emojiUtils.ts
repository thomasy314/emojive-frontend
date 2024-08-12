function hasOnlyEmojis(text: string): boolean {
    return /[A-Za-z0-9]/.test(text);
}

export {
    hasOnlyEmojis
};
