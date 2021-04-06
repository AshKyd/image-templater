const { DOMParser, XMLSerializer } = require("xmldom");
const xpath = require("xpath");
const fs = require("fs");
const path = require("path");
const queue = require("async/queue");

class SVGTemplate {
  constructor(filename) {
    this.filename = filename;
    const templateString = fs.readFileSync(
      path.resolve(__dirname, filename),
      "utf8"
    );
    this.doc = new DOMParser().parseFromString(templateString);
    this.queue = queue(async (task) => {
      this.status = "processing";
      await task();
    }, 20);
  }

  toString() {
    return new XMLSerializer().serializeToString(this.doc);
  }

  replaceText(name, value) {
    const doc = this.doc;
    const placeholder = xpath.select(`//*[text() = '${name}']`, doc)[0];
    if (!placeholder) {
      console.error(`Could not replace text for "${name}`);
      return this;
    }

    placeholder.removeChild(placeholder.childNodes[0]);
    const newNode = doc.createTextNode(value);
    placeholder.appendChild(newNode);

    return this;
  }

  replaceImage(selector, imageUrl, index = 0) {
    const doc = this.doc;
    let placeholder;

    try {
      placeholder = xpath.select(selector, doc)[index];
    } catch (e) {
      console.error(
        `Invalid selector in replaceImage: ${selector}. ${e.message}`
      );
      return this;
    }

    if (!placeholder) {
      console.error(`Could not replace image for "${selector}. None found.`);
      return this;
    }

    this.queue.push(async () => {
      try {
        const dataUrl = await this.fetchImage(imageUrl);
        const svgImage = doc.createElement("image");
        svgImage.setAttribute("href", dataUrl);
        svgImage.setAttribute("width", placeholder.getAttribute("width"));
        svgImage.setAttribute("height", placeholder.getAttribute("height"));
        svgImage.setAttribute("x", placeholder.getAttribute("x"));
        svgImage.setAttribute("y", placeholder.getAttribute("y"));

        placeholder.parentNode.replaceChild(svgImage, placeholder);
      } catch (e) {
        console.error(
          `Could not replace image for "${selector}" - ${e.message}`
        );
      }
    });

    return this;
  }

  replaceImageByAttribute(attribute, value, imageUrl, index) {
    const selector = `//*[contains(@${attribute}, '${value}')]`;
    return this.replaceImage(selector, imageUrl, index);
  }

  async sync() {
    await this.queue.drain();
    return this;
  }
}

module.exports = SVGTemplate;
