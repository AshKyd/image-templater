const https = require("https");
import SVGTemplate from "./SVGTemplate";

interface response {
  headers: {
    "content-type": string;
  };
  on(arg0: string, arg1: (chunk: any) => void);
  statusCode: number;
}

export default class SVGTemplateNode extends SVGTemplate {
  async fetchImage(url) {
    const response: response = await new Promise((resolve) =>
      https.get(url, () => resolve(response))
    );

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
