<template>
  <div>
    <div><input type="text" v-model="htmlContent" /></div>
    <div>
      <button type="button" @click="updateUrlContent($event)">Click Me!</button>
    </div>
    <div>
      <native-generic-element
        content="<style>.afs{background-color: lightblue;}</style><div class='afs'>hola</div>"
      ></native-generic-element>
    </div>
    <div>
      <native-generic-element
        content="<style>.afs{background-color: red;}</style><div class='afs'>hola</div>"
      ></native-generic-element>
    </div>
    <!-- <div :v-html="urlContent"></div> -->
    <div>{{ urlContent }}</div>
    <!-- <native-hello-world class="uno" :content="urlContent"></native-hello-world> -->
    <ColorReplacer />
  </div>
</template>

<script>
//import "./native/native-hello-world";
import "./native/native-generic-element";
import { ref } from "vue";
//import { getUrlContent } from "../services/client";
import ColorReplacer from "./ColorReplacer.vue";

export default {
  name: "HtmlColorReplacer",
  components: {
    ColorReplacer,
  },
  setup() {
    const htmlContent = ref("");
    const urlContent = ref(
      "<div><style>.afs{background-color: red;}</style><div class='afs'>hola</div></div>"
    );
    const updateUrlContent = () => {
      // getUrlContent(htmlContent.value).then((content) => {
      //   urlContent.value = content;
      // });
      urlContent.value = "cambiado";
      document
        .querySelector("native-hello-world.uno")
        .setAttribute("css", urlContent.value);
      //urlContent.value = `adfsfdasf`;
    };
    return {
      htmlContent,
      urlContent,
      updateUrlContent,
    };
  },
};
</script>

<style></style>
