const https = require("https");
const SVGTemplate = require("./SVGTemplate.js");

class SVGTemplateNode extends SVGTemplate {
  async fetchImage(url) {
    const response = await new Promise((resolve) => https.get(url, resolve));

    if (response.statusCode > 299 || response.statusCode < 200) {
      throw new Error(
        `Could not fetch image, got response code ${response.statusCode} for ${url}`
      );
    }

    const binaryData = [];

    response.on("data", function (chunk) {
      binaryData.push(chunk);
    });

    await new Promise((resolve) => response.on("end", resolve));

    const buffer = Buffer.concat(binaryData);
    const dataUrl = buffer.toString("base64");
    const contentType = response.headers["content-type"];
    return `data:${contentType};base64,${dataUrl}`;
  }
}

module.exports = SVGTemplateNode;
