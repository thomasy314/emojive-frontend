import TextInput from "@commonComponents/TextInput";
import { isOnlyEmojis } from "@utils/emoji.utils";

function EmojiTextInput({ value, onChange, placeholder }) {
  const handleTextChange = (event) => {
    const newVal = event.target.value;
    if (!isOnlyEmojis(newVal)) {
      return;
    }
    onChange(newVal);
  };

  return (
    <TextInput
      value={value}
      onChange={handleTextChange}
      placeholder={placeholder}
    />
  );
}

export default EmojiTextInput;
