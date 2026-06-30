import { parseStringPromise } from "xml2js";

export async function parseXml(xmlString) {
  return parseStringPromise(xmlString, {
    explicitArray: false,
    ignoreAttrs: true,
    trim: true,
  });
}
