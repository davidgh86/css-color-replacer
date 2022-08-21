//import * as ShadyCSS from "@webcomponents/shadycss";

const template = document.createElement("template");
template.innerHTML = `
<div id="iframecontainer">
  <div id="iframe">
    <div id="iframewrapper">
    </div>
  </div>
</div>`;

//ShadyCSS.prepareTemplate(template, "native-generic-element");

class NativeGenericElement extends HTMLElement {
  static get observedAttributes() {
    return ["content"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
    <div id="iframecontainer">
      <div id="iframe">
        <div id="iframewrapper">
        </div>
      </div>
    </div>`;
    this.iframe = document.createElement("iframe");
    this.iframe.setAttribute("frameborder", "0");
    this.iframe.setAttribute("id", "iframeResult");
    this.iframe.setAttribute("name", "iframeResult");
    this.iframe.setAttribute("allowfullscreen", "true");
    this.shadowRoot.getElementById("iframewrapper").innerHTML = "";
    this.shadowRoot.getElementById("iframewrapper").appendChild(this.iframe);
    //this.attachShadow({ mode: "open" });
    //this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    //ShadyCSS.styleElement(this);
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
        // var ifrw = this.iframe.contentWindow
        //   ? this.iframe.contentWindow
        //   : this.iframe.contentDocument.document
        //   ? this.iframe.contentDocument.document
        //   : this.iframe.contentDocument;
        // ifrw.document.open();
        // ifrw.document.write(newValue);
        // ifrw.document.close();
        // if (ifrw.document.body && !ifrw.document.body.isContentEditable) {
        //   ifrw.document.body.contentEditable = true;
        //   ifrw.document.body.contentEditable = false;
        // }
        this.iframe.innerHTML = newValue;
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
