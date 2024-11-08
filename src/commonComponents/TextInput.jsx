function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      className="border rounded mt-10 placeholder:text-center placeholder:opacity-30 text-center text-xl"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}

export default TextInput;
