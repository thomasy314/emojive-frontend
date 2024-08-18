import { EmojiData } from "@/types/types.emojiFetcher";
import { EMOJI_DATA_URL, emojiDataEmojiJsonToEmojiDataList } from "@/utils/emojiUtils/emojiFetchers/emojiDataEmojiFetcher";
import { loadEmojiDataFromURL } from "@/utils/emojiUtils/emojiFetchers/emojiFetcher";
import { emojiDataListSearcher } from "@/utils/emojiUtils/emojiSearchers/emojiSearch";
import { ChangeEvent, KeyboardEvent, TextareaHTMLAttributes, useEffect, useRef, useState } from "react";

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
} & TextareaHTMLAttributes<HTMLTextAreaElement>

/**
 * Acts as an extension of the textarea tag adding support for emoji shortname lookup and injection
 */
function EmojiTextArea(props: PerTextAreaProps) {
    const { value: propValue, onTextChange, emojiOptionLimit, showEmojiOptions, onEmojiOptionChange, ...textAreaProps } = props;

    const EMOJI_SHORTNAME_SEARCH_END_CHARACTER = ":"
    const EMOJI_SHORTNAME_SEARCH_REGEX = new RegExp(`\\B:([\\-+\\w]*)([${EMOJI_SHORTNAME_SEARCH_END_CHARACTER}]?)$`);
    const DEFAULT_EMOJI_OPTION_LIMIT = 5;

    const emojiData = useRef<EmojiData[] | null>(null);
    const [inputText, setInputText] = useState<string>("");
    const [emojiOptions, setEmojiOptions] = useState<EmojiData[]>([]);
    const [emojiOptionSelected, setEmojiOptionSelected] = useState<number>(0);

    const emojiOptionDropdown = emojiOptions.map((option: EmojiData, index: number) => {
        const shortNames = option.shortNames.map(sn => `:${sn}:`).join(", ");
        const selectedFormatting = emojiOptionSelected === index ? "underline" : ""
        return (
            <li key={index}>
                <p className={`${selectedFormatting} text-xl`} title={shortNames}>{option.character}</p>
            </li>
        )
    });


    useEffect(() => {
        if (emojiData.current) return;
        loadEmojiDataFromURL(EMOJI_DATA_URL, emojiDataEmojiJsonToEmojiDataList).then(newEmojiData => emojiData.current = newEmojiData)
    }, []);

    // On emoji option changes
    useEffect(() => {
        if (onEmojiOptionChange) {
            onEmojiOptionChange({
                emojiOptions,
                emojiOptionSelected
            });
        }
    }, [emojiOptions, emojiOptionSelected, onEmojiOptionChange])

    /**
     * Given a piece of text and cursor location, the function checks if the user is entering a new
     * emoji shortname and returns and found emojis
     * @param {string} text The text that contains the emoji
     * @param {number} cursorLocation Current position of the caret/cursor in the text area
     * @returns {EmojiData[]} A list of emojis and their metadata that matched the search string
     */
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
                targetName: targetName,
                maxResults: props.emojiOptionLimit ?? DEFAULT_EMOJI_OPTION_LIMIT,
                targetShortName: targetName
            }));
        }

        return options;
    }

    /**
     * Replaces emoji shortname in given text ad current typing position with selected emoji
     * @param {string} text The text that the emoji is being injected into
     * @param {number} cursorLocation Current position of the cursor/caret in text area
     * @param {EmojiData} selectedEmoji MEta data about the emoji being inject
     * @returns {{updatedText: string, cursorOffset: number}} The updated text with inject emoji along with needed cursor offset to set new cursor location pos replacement
     */
    function injectEmojiIntoText(
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

    /**
     * sets cursor/caret location in text area taking into account delay cause from updating state
     * @param {HTMLTextAreaElement} target text area which cursor/caret location is being set
     * @param {number} location The new cursor location
     */
    function setCursorLocation(target: HTMLTextAreaElement, location: number): void {
        window.requestAnimationFrame(() => {
            target.selectionStart = location;
            target.selectionEnd = location;
        });
    }

    /**
     * Updates text area string and calls onTextChange function to inform parent components
     * @param {sting} updatedText 
     */
    function updateText(updatedText: string) {
        setInputText(updatedText);

        if (props.onTextChange) {
            props.onTextChange(updatedText);
        }
    }

    /**
     * Handles changes in the text area, listening for emoji short names and injecting when needed
     * @param {ChangeEvent<HTMLTextAreaElement> onChangeEvent 
     */
    function handleTextChange(onChangeEvent: ChangeEvent<HTMLTextAreaElement>) {
        const { target } = onChangeEvent;
        const { value: newText, selectionEnd: cursorLocation } = target;

        const options = searchForEmojiOptions(newText, cursorLocation);
        setEmojiOptions(options);
        const selectedEmoji = options[emojiOptionSelected];
        const { updatedText, cursorOffset } = injectEmojiIntoText(newText, cursorLocation, selectedEmoji);
        if (updatedText !== newText) setEmojiOptions([]);

        setCursorLocation(target, cursorLocation + cursorOffset);

        updateText(updatedText);

        setEmojiOptionSelected(0);
    }

    /**
     * If an emoji shortname is being written, it is replaced with the currently selected emoji from the dropdown menu
     * @param {KeyboardEvent<HTMLTextAreaElement>}event event emitted on keydown event
     */
    function handleEmojiOptionEnter(event: KeyboardEvent<HTMLTextAreaElement>) {
        event.preventDefault();
        const target = (event.target as HTMLTextAreaElement);
        const { value: newText, selectionEnd: cursorLocation } = target;

        const selectedEmoji = emojiOptions[emojiOptionSelected];
        const formattedShortname = newText.substring(0, cursorLocation) + EMOJI_SHORTNAME_SEARCH_END_CHARACTER + newText.substring(cursorLocation);
        const { updatedText, cursorOffset } = injectEmojiIntoText(formattedShortname, cursorLocation + 1, selectedEmoji);
        if (updatedText !== newText) setEmojiOptions([]);

        setCursorLocation(target, cursorLocation + cursorOffset);

        updateText(updatedText);
        setEmojiOptionSelected(0);
    }

    /**
     * Moves selected emoji from emoji options up
     * @param {KeyboardEvent<HTMLTextAreaElement>}event event emitted on keydown event
     */
    function handleEmojiOptionUp(event: KeyboardEvent<HTMLTextAreaElement>): void {
        event.preventDefault();
        setEmojiOptionSelected(curSel => Math.max(0, curSel - 1));
    }

    /**
     * Moves selected emoji from emoji options down
     * @param {KeyboardEvent<HTMLTextAreaElement>}event event emitted on keydown event
     */
    function handleEmojiOptionDown(event: KeyboardEvent<HTMLTextAreaElement>): void {
        event.preventDefault();
        setEmojiOptionSelected(curSel => Math.min(emojiOptions.length - 1, curSel + 1));
    }

    /**
     * Map of handler for all keydown events
     */
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
        if (textAreaProps.onKeyDown) textAreaProps.onKeyDown(event);
    }

    return (
        <div className="relative">
            <textarea {...textAreaProps} onKeyDown={handleTextAreaSubmit} onChange={handleTextChange} value={propValue ?? inputText} />
            <ul className="absolute bg-white w-full">
                {emojiOptionDropdown}
            </ul>
        </div>
    )
}

export default EmojiTextArea;