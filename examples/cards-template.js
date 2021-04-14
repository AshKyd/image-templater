"use strict";
exports.__esModule = true;
var path = require("path");
var SVGTemplateNode_1 = require("../src/SVGTemplateNode");
var template = new SVGTemplateNode_1["default"](path.join(__dirname, "./cards-template.svg"))
    .replaceText("PLACEHOLDER0", "Generate awesome template dynamically!")
    .replaceText("PLACEHOLDER1", "Fast")
    .replaceText("PLACEHOLDER2", "Dynamic")
    .replaceText("PLACEHOLDER3", "Neato!")
    .replaceText("PLACEHOLDER4", "Get started now");
for (var i = 0; i < 4; i++) {
    var size = 200 + i;
    template.replaceImageByAttribute("style", "ff0000", "https://placekitten.com/" + size + "/" + size, i);
    template.replaceImageByAttribute("style", "00ff00", "https://placekitten.com/" + (size + 10) + "/" + (size + 10), i);
    template.replaceImageByAttribute("style", "0000ff", "https://placekitten.com/" + (size + 100) + "/" + (size + 100), i);
}
template.sync().then(function (template) { return console.log(String(template)); });
