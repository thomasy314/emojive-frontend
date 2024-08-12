import { EMOJI_DATA_URL, emojiDataEmojiJsonToEmojiDataList } from "@/utils/emojiUtils/emojiFetchers/emojiDataEmojiFetcher";
import { loadEmojiDataFromURL } from "@/utils/emojiUtils/emojiFetchers/emojiFetcher";
import { emojiDataListSearcher } from "@/utils/emojiUtils/emojiSearchers/emojiSearch";
import { EmojiData } from "@/utils/emojiUtils/types.emojiFetcher";
import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

type EmojiOptionChangeEvent = {
    emojiOptions: EmojiData[],
    emojiOptionSelected: number
}

type PerTextAreaProps = {
    value: string,
    onTextChange?: (newText: string) => void,
    emojiOptionLimit?: number,
    showEmojiOptions?: boolean,
    onEmojiOptionChange?: (event: EmojiOptionChangeEvent) => void,
    textAreaProps: React.TextareaHTMLAttributes<HTMLTextAreaElement>
}

const EMOJI_SHORTNAME_SEARCH_END_CHARACTER = ":"

const EMOJI_SHORTNAME_SEARCH_REGEX = new RegExp(`\\B:([\\-+\\w]*)([${EMOJI_SHORTNAME_SEARCH_END_CHARACTER}]?)$`);

const DEFAULT_EMOJI_OPTION_LIMIT = 5;

function EmojiTextArea(props: PerTextAreaProps) {

    const [inputText, setInputText] = useState<string>("");
    const emojiData = useRef<EmojiData[] | null>(null);
    const [emojiOptions, setEmojiOptions] = useState<EmojiData[]>([]);
    const [emojiOptionSelected, setEmojiOptionSelected] = useState<number>(0);
    const { onEmojiOptionChange } = props;

    const emojiOptionDropdown = emojiOptions.map((option: EmojiData, index: number) => {
        const shortNames = option.shortNames.map(sn => `:${sn}:`).join(", ");
        return (
            <li key={index}>
                <p className={emojiOptionSelected === index ? "underline" : ""} title={shortNames}>{option.character}</p>
            </li>
        )
    });

    useEffect(() => {
        if (emojiData.current) return;

        loadEmojiDataFromURL(EMOJI_DATA_URL, emojiDataEmojiJsonToEmojiDataList).then(newEmojiData => emojiData.current = newEmojiData)
    }, []);

    useEffect(() => {
        if (onEmojiOptionChange) {
            onEmojiOptionChange({
                emojiOptions,
                emojiOptionSelected
            });
        }
    }, [emojiOptions, emojiOptionSelected, onEmojiOptionChange])

    function searchForEmojiOptions(
        text: string,
        cursorLocation: number,
    ): EmojiData[] {
        let inScopeText = text.substring(0, cursorLocation);

        const searchNameRegexResults = inScopeText.match(EMOJI_SHORTNAME_SEARCH_REGEX);

        let options: EmojiData[] = [];

        if (emojiData.current && searchNameRegexResults && searchNameRegexResults.length >= 2) {
            const [, targetName] = searchNameRegexResults;

            // Search for emoji options based on the target name
            options.push(...emojiDataListSearcher(emojiData.current, {
                targetName: "",
                maxResults: props.emojiOptionLimit ?? DEFAULT_EMOJI_OPTION_LIMIT,
                targetShortName: targetName
            }));
        }

        return options;
    }

    function replaceEmojiShortnameInText(
        text: string,
        cursorLocation: number,
        selectedEmoji: EmojiData | null,
    ): { updatedText: string, cursorOffset: number } {
        const outOfScopeText = text.substring(cursorLocation);
        let inScopeText = text.substring(0, cursorLocation);
        let cursorOffset = 0;

        const searchNameRegexResults = inScopeText.match(EMOJI_SHORTNAME_SEARCH_REGEX);

        if (emojiData.current && searchNameRegexResults && searchNameRegexResults.length >= 2) {
            const [, targetName, matchEnd] = searchNameRegexResults;

            if ((matchEnd === EMOJI_SHORTNAME_SEARCH_END_CHARACTER) && selectedEmoji) {
                cursorOffset = -(targetName.length - selectedEmoji.character.length);
                inScopeText = inScopeText.replace(EMOJI_SHORTNAME_SEARCH_REGEX, selectedEmoji.character);
            }
        }

        return {
            updatedText: inScopeText + outOfScopeText,
            cursorOffset
        }
    }

    function setCursorLocation(target: HTMLTextAreaElement, location: number) {
        window.requestAnimationFrame(() => {
            target.selectionStart = location;
            target.selectionEnd = location;
        });
    }

    function updateText(updatedText: string) {
        setInputText(updatedText);

        if (props.onTextChange) {
            props.onTextChange(updatedText);
        }
    }

    function onTextChange(onChangeEvent: ChangeEvent<HTMLTextAreaElement>) {
        const { target } = onChangeEvent;
        const { value: newText, selectionEnd: cursorLocation } = target;

        const options = searchForEmojiOptions(newText, cursorLocation);
        setEmojiOptions(options);
        const selectedEmoji = options[emojiOptionSelected];
        const { updatedText, cursorOffset } = replaceEmojiShortnameInText(newText, cursorLocation, selectedEmoji);
        if (updatedText !== newText) setEmojiOptions([]);

        setCursorLocation(target, cursorLocation + cursorOffset);

        updateText(updatedText);

        setEmojiOptionSelected(0);
    }

    function handleEmojiOptionEnter(event: KeyboardEvent<HTMLTextAreaElement>) {
        event.preventDefault();
        const target = (event.target as HTMLTextAreaElement);
        const { value: newText, selectionEnd: cursorLocation } = target;

        const selectedEmoji = emojiOptions[emojiOptionSelected];
        const formattedShortname = newText.substring(0, cursorLocation) + EMOJI_SHORTNAME_SEARCH_END_CHARACTER + newText.substring(cursorLocation);
        const { updatedText, cursorOffset } = replaceEmojiShortnameInText(formattedShortname, cursorLocation + 1, selectedEmoji);
        if (updatedText !== newText) setEmojiOptions([]);

        setCursorLocation(target, cursorLocation + cursorOffset);

        updateText(updatedText);
        setEmojiOptionSelected(0);
    }

    function handleEmojiOptionUp(event: KeyboardEvent<HTMLTextAreaElement>): void {
        event.preventDefault();
        setEmojiOptionSelected(curSel => Math.max(0, curSel - 1));
    }

    function handleEmojiOptionDown(event: KeyboardEvent<HTMLTextAreaElement>): void {
        event.preventDefault();
        setEmojiOptionSelected(curSel => Math.min(emojiOptions.length - 1, curSel + 1));
    }

    const emojiOptionHandlers = new Map<string, (e: KeyboardEvent<HTMLTextAreaElement>) => void>(Object.entries({
        Enter: handleEmojiOptionEnter,
        ArrowUp: handleEmojiOptionUp,
        ArrowDown: handleEmojiOptionDown
    }));


    /**
     * Checks if the emoji dropdown is open. 
     * IF YES: Allow keyboard controls to select emojis
     * IF NO: Allow keyboard controls to perform onKeyEvent passed in props
     * @param {KeyboardEvent<HTMLTextAreaElement>} event contains information about keydown event in text area
     */
    function handleTextAreaSubmit(event: KeyboardEvent<HTMLTextAreaElement>): void {
        if (emojiOptions.length > 0 && event.shiftKey == false) {
            const handler = emojiOptionHandlers.get(event.key)
            if (handler != undefined) {
                handler(event);
                return;
            }
        }
        if (props.textAreaProps.onKeyDown) props.textAreaProps.onKeyDown(event);
    }

    return (
        <div className="relative">
            <textarea {...props.textAreaProps} onKeyDown={handleTextAreaSubmit} onChange={onTextChange} value={props.value ?? inputText} />
            <ul className="absolute bg-white w-full">
                {emojiOptionDropdown}
            </ul>
        </div>
    )
}

export default EmojiTextArea;