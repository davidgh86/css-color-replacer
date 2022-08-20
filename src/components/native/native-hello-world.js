class HelloWorldComponent extends HTMLElement {
  constructor() {
    super();
    this.css = "";
  }

  static get observedAttributes() {
    return ["css", "content"];
  }

  attributeChangedCallback(nameAtr, oldValue, newValue) {
    switch (nameAtr) {
      case "css":
        alert(newValue);
        this.css = newValue;
        break;
      case "content":
        this.content = newValue;
    }
    this.innerHTML = `<h1>Hello world! ${this.css}</h1>`;
  }

  connectedCallback() {
    this.innerHTML = `<h1>Hello world! ${this.css}</h1>`;
  }
}

customElements.define("native-hello-world", HelloWorldComponent);
