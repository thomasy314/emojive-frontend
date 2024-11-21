const NON_EMOJI_REGEX = /[^\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\s]/gu;

function isOnlyEmojis(text) {
  const foundNonEmoji = text.match(NON_EMOJI_REGEX);
  return foundNonEmoji === null;
}

export { isOnlyEmojis };
