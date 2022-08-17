import { getUrlContent } from "@/services/client";
import ccsom from "cssom";

const elementAttributes = ["src", "href"];

export function parse(html, hostname) {
  const url = cleanHostName(hostname);
  console.log(html, url);
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  groupPosibleStylesInHeader(doc);
  for (const elementAttribute of elementAttributes) {
    const elementsLinkReplaceable = getElementsByAtributeSelector(
      doc,
      elementAttribute
    );
    replaceResources(elementsLinkReplaceable, url, elementAttribute);
  }
  const linkElements = doc.getElementsByTagName("link");
  for (const linkElement of linkElements) {
    replaceStyleContent(linkElement, doc);
  }
  groupPosibleStylesInHeader(doc);
  const styles = doc.getElementsByTagName("style")[0].innerHTML;
  filterNonAppliedStyles(doc, styles);
  return doc;
}

function isRuleApplied(element, selector) {
  if (typeof element.matches == "function") return element.matches(selector);

  if (typeof element.matchesSelector == "function")
    return element.matchesSelector(selector);

  var matches = (element.document || element.ownerDocument).querySelectorAll(
    selector
  );
  var i = 0;

  while (matches[i] && matches[i] !== element) i++;

  return matches[i] ? true : false;
}

function filterNonAppliedStyles(htmlDoc, styles) {
  const a = ccsom.parse(styles);
  const allElemetns = htmlDoc.body.getElementsByTagName("*");

  let result = "";

  for (let i = 0; i < a.cssRules.length; i++) {
    const rule = a.cssRules[i];
    for (const el of allElemetns) {
      let ruleApplied;
      try {
        ruleApplied = isRuleApplied(el, rule.selectorText);
      } catch (e) {
        // if checking if rule applied fails assume it could be true
        ruleApplied = true;
      }
      if (ruleApplied) {
        result += rule.cssText;
        break;
      }
    }
  }

  return result;
}

function groupPosibleStylesInHeader(htmlDoc) {
  let cssStyle = "";
  const styleTags = htmlDoc.getElementsByTagName("style");
  for (const styleTag of styleTags) {
    cssStyle += styleTag.innerHTML;
    styleTag.remove();
  }
  const uniqStyleElement = htmlDoc.createElement("style");
  const cssContentTextNode = htmlDoc.createTextNode(cssStyle);
  uniqStyleElement.appendChild(cssContentTextNode);
  htmlDoc.head.appendChild(uniqStyleElement);
}

function replaceStyleContent(linkElement, doc) {
  if (linkElementIsStyle(linkElement)) {
    const linkUrl = linkElement.href;
    // todo download link.
    const elementStyle = getElementStyle(linkUrl, doc);
    linkElement.parentNode.replaceChild(elementStyle, linkElement);
  }
}

function getElementStyle(linkUrl, doc) {
  const el = doc.createElement("style");
  el.innerHTML = getUrlContent(linkUrl);
  return el;
}

function linkElementIsStyle(linkElement) {
  return (
    linkElement.href &&
    linkElement.href.length > 0 &&
    linkElement.href.trim().split("?")[0].split(".").pop() === "css"
  );
}

function getElementsByAtributeSelector(domElement, elementAttribute) {
  return domElement.querySelectorAll(`[${elementAttribute}]`);
}

function cleanHostName(hostname) {
  return hostname;
}

function replaceResources(elements, url, linkAttributeName) {
  for (const element of elements) {
    replaceSingleResource(element, url, linkAttributeName);
  }
}

function replaceSingleResource(element, url, linkAttributeName) {
  let src = element[linkAttributeName];
  if (!isFullPath(src)) {
    element[linkAttributeName] = getFullPathSource(src, url);
  }
}

function isFullPath(src) {
  return src.startsWith("http://") || src.startsWith("https://");
}

function getFullPathSource(src, hostName) {
  if (isFullPath(src)) {
    return src;
  }
  return getResourceFullUri(src, hostName);
}

function getResourceFullUri(src, hostName) {
  // "https://finofilipino.org/wp-content/uploads/2020/12/logofinofilipino.png"
  return hostName + src;
}

// function isRuleApplied(element, selector) {
//   if (typeof element.matches == "function") return element.matches(selector);

//   if (typeof element.matchesSelector == "function")
//     return element.matchesSelector(selector);

//   var matches = (element.document || element.ownerDocument).querySelectorAll(
//     selector
//   );
//   var i = 0;

//   while (matches[i] && matches[i] !== element) i++;

//   return matches[i] ? true : false;
// }
