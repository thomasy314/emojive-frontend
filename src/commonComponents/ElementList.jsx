function ElementList({ data, element: Element, attribute }) {
  return (
    <>
      {data.map((item, index) => (
        <Element key={index} {...{ [attribute]: item }} />
      ))}
    </>
  );
}

export default ElementList;
