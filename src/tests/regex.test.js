it("all tags are retrieved", () => {
  let xml = '<root lang="en"><foo a="qwe"><foobar></foobar></foo></root>';
  let correctResults = ['<root lang="en">', '<foo a="qwe">', "<foobar>", "</foobar>", "</foo>", "</root>"];
  let regex = /(<)[^>]+>/g;

  let result = xml.match(regex);
  console.log(result);
  expect(result.length).toBe(6);

  result.forEach((item, idx) => {
    expect(item).toBe(correctResults[idx]);
  });
});
