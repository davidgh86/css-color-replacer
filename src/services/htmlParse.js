import parser from "@/services/client";

const elementAttributes = ["src", "href"];

export function parse(html, hostname) {
  const url = cleanHostName(hostname);
  console.log(html, url);
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
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
  el.innerHTML = parser.getUrlContent(linkUrl);
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
