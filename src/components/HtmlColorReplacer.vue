<template>
  <div>
    <div><input type="text" v-model="htmlContent" /></div>
    <div>
      <button type="button" @click="updateUrlContent($event)">Click Me!</button>
    </div>
    <div>
      <iframe :src="srcIFrame" sandbox="allow-same-origin"></iframe>
    </div>
    <ColorReplacer />
  </div>
</template>

<script>
import { ref, computed } from "vue";
import ColorReplacer from "./ColorReplacer.vue";
import { fromByteArray } from "base64-js/index";

export default {
  name: "HtmlColorReplacer",
  components: {
    ColorReplacer,
  },
  setup() {
    const htmlContent = ref("");
    const urlContent = ref(
      `<!DOCTYPE html>
<html>
<head>
<style>
body {
  background-color: lightblue;
}

h1 {
  color: white;
  text-align: center;
}

p {
  font-family: verdana;
  font-size: 20px;
}
</style>
</head>
<body>

<h1>My First CSS Example</h1>
<p>This is a paragraph.</p>

</body>
</html>`
    );
    const srcIFrame = computed(() => {
      const utf8Encode = new TextEncoder();
      const byteArray = utf8Encode.encode(urlContent.value);
      const dat = fromByteArray(byteArray);
      return `data:text/html;base64,${dat}`;
    });
    const updateUrlContent = () => {
      // getUrlContent(htmlContent.value).then((content) => {
      //   urlContent.value = content;
      // });
      urlContent.value =
        "<div><style>.afs{background-color: red;}</style><div class='afs'>hola</div></div>";
      // document
      //   .querySelector("native-hello-world.uno")
      //   .setAttribute("css", urlContent.value);
      //urlContent.value = `adfsfdasf`;
    };
    return {
      htmlContent,
      urlContent,
      updateUrlContent,
      srcIFrame,
    };
  },
};
</script>

<style></style>
