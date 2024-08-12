import { EMOJI_DATA_URL, emojiDataEmojiJsonToEmojiDataList } from "@/utils/emojiUtils/emojiFetchers/emojiDataEmojiFetcher";
import { loadEmojiDataFromURL } from "@/utils/emojiUtils/emojiFetchers/emojiFetcher";
import { emojiDataListSearcher } from "@/utils/emojiUtils/emojiSearchers/emojiSearch";
import { EmojiData } from "@/utils/emojiUtils/types.emojiFetcher";
import { ChangeEvent, useEffect, useRef, useState } from "react";

type PerTextAreaProps = {
    className?: string,
    value?: string,
    onChange?: (onChangeEvent: ChangeEvent<HTMLTextAreaElement>) => void,
}

const EMOJI_SHORTNAME_SEARCH_END_CHARACTER = ":"

const EMOJI_SHORTNAME_SEARCH_REGEX = new RegExp(`\\B:([\\-+\\w]*)([${EMOJI_SHORTNAME_SEARCH_END_CHARACTER}]?)$`);

function EmojiTextArea(props: PerTextAreaProps) {
    const [inputText, setInputText] = useState<string>("");
    const emojiData = useRef<EmojiData[] | null>(null);
    const [emojiOptions, setEmojiOptions] = useState<EmojiData[]>([]);

    useEffect(() => {
        if (emojiData.current) return;

        loadEmojiDataFromURL(EMOJI_DATA_URL, emojiDataEmojiJsonToEmojiDataList).then(newEmojiData => emojiData.current = newEmojiData)
    }, []);

    const searchResults: EmojiData[] = [];

    function onTextChange(onChangeEvent: ChangeEvent<HTMLTextAreaElement>) {
        const { target } = onChangeEvent;
        const { value: newText, selectionEnd: cursorLocation } = target;

        const outOfScopeText = newText.substring(cursorLocation);
        let inScopeText = newText.substring(0, cursorLocation);

        const searchNameRegexResults = inScopeText.match(EMOJI_SHORTNAME_SEARCH_REGEX);

        if (!(emojiData.current === null || searchNameRegexResults === null || searchNameRegexResults.length < 2)) {
            const [, targetName, matchEnd] = searchNameRegexResults;

            searchResults.push(...emojiDataListSearcher(emojiData.current, {
                targetName: "",
                maxResults: 10,
                targetShortName: targetName
            }));

            if (matchEnd === EMOJI_SHORTNAME_SEARCH_END_CHARACTER && searchResults.length > 0) {
                window.requestAnimationFrame(() => {
                    onChangeEvent.target.selectionStart = cursorLocation - targetName.length + 1;
                    onChangeEvent.target.selectionEnd = cursorLocation - targetName.length + 1;
                });

                inScopeText = inScopeText.replace(EMOJI_SHORTNAME_SEARCH_REGEX, searchResults[0].character);
                searchResults.splice(0, searchResults.length);
            }
        }

        setInputText(inScopeText + outOfScopeText);
        setEmojiOptions(searchResults);
        if (props.onChange) {
            onChangeEvent.target.value = inScopeText + outOfScopeText;
            props.onChange(onChangeEvent)
        }
    }

    const test = emojiOptions.map((option: EmojiData, index: number) => {
        const shortNames = option.shortNames.map(sn => `:${sn}:`).join(", ");
        return (
            <li key={index}>
                <p title={shortNames}>{option.character} {option.name}</p>
            </li>
        )
    })

    return (
        <div className="relative">
            <textarea rows={1} className={props.className} onChange={onTextChange} value={props.value ?? inputText} />
            <ul className="absolute bg-white w-full">
                {test}
            </ul>
        </div>
    )
}

export default EmojiTextArea;