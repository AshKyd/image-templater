const path = require("path");
const SVGTemplateNode = require("../src/SVGTemplateNode");

const template = new SVGTemplateNode(
  path.join(__dirname, "./cards-template.svg")
)
  .replaceText("PLACEHOLDER0", "Generate awesome template dynamically!")
  .replaceText("PLACEHOLDER1", "Fast")
  .replaceText("PLACEHOLDER2", "Dynamic")
  .replaceText("PLACEHOLDER3", "Neato!")
  .replaceText("PLACEHOLDER4", "Get started now");

for (let i = 0; i < 4; i++) {
  const size = 200 + i;
  template.replaceImageByAttribute(
    "style",
    "ff0000",
    `https://placekitten.com/${size}/${size}`,
    i
  );
  template.replaceImageByAttribute(
    "style",
    "00ff00",
    `https://placekitten.com/${size + 10}/${size + 10}`,
    i
  );
  template.replaceImageByAttribute(
    "style",
    "0000ff",
    `https://placekitten.com/${size + 100}/${size + 100}`,
    i
  );
}

template.sync().then((template) => console.log(String(template)));
