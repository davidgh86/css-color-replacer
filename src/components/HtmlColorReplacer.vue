<template>
  <div>
    <div><input type="text" v-model="htmlContent" /></div>
    <div>
      <button type="button" @click="updateUrlContent($event)">Click Me!</button>
    </div>
    <div>
      <!-- <native-generic-element .content="urlContent"></native-generic-element> -->
      <iframe :src="srcIFrame"></iframe>
    </div>
    <!-- <div>
      <native-generic-element .content="urlContent"></native-generic-element>
    </div> -->
    <!-- <iframe v-html="urlContent"></iframe> -->
    <div>{{ urlContent }}</div>
    <!-- <native-hello-world class="uno" :content="urlContent"></native-hello-world> -->
    <ColorReplacer />
  </div>
</template>

<script>
//import "./native/native-hello-world";
//import "./native/native-generic-element2";
import { ref, computed } from "vue";
//import { getUrlContent } from "../services/client";
import ColorReplacer from "./ColorReplacer.vue";
import { fromByteArray } from "base64-js/index";
//import base64 from "base-64/base64";

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
      const byteArray = utf8Encode.encode(this.urlContent.value);
      const data = fromByteArray(byteArray);
      return `data:text/html;base64,${data}`;
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
