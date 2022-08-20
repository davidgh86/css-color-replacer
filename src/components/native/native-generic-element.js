import * as ShadyCSS from "@webcomponents/shadycss";

const template = document.createElement("template");
template.innerHTML = `<div></div>`;

ShadyCSS.prepareTemplate(template, "native-generic-element");

class NativeGenericElement extends HTMLElement {
  static get observedAttributes() {
    return ["content"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    //this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    ShadyCSS.styleElement(this);
    this._upgradeProperty("content");
  }

  set content(value) {
    if (value) {
      this.setAttribute("content", value);
    } else {
      this.removeAttribute("content");
    }
  }

  get content() {
    return this.getAttribute("content");
  }

  attributeChangedCallback(nameAtr, oldValue, newValue) {
    switch (nameAtr) {
      case "content":
        this.shadowRoot.innerHTML = newValue;
        ShadyCSS.styleElement(this);
        break;
    }
  }

  _upgradeProperty(prop) {
    // eslint-disable-next-line no-prototype-builtins
    if (this.hasOwnProperty(prop)) {
      let value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }
}

customElements.define("native-generic-element", NativeGenericElement);
