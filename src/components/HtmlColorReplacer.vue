<template>
  <div>
    <div><input type="text" v-model="aaaa" /></div>
    <div>
      <button type="button" @click="updateUrlContent($event)">Click Me!</button>
    </div>
    <div v-html="urlContent"></div>
    <ColorReplacer />
  </div>
</template>

<script>
import { ref } from "vue";
import { getUrlContent } from "../services/client";
import ColorReplacer from "./ColorReplacer.vue";

export default {
  name: "HtmlColorReplacer",
  components: {
    ColorReplacer,
  },
  setup() {
    const aaaa = ref("");
    const urlContent = ref("");
    const updateUrlContent = () => {
      alert(aaaa.value);
      getUrlContent(aaaa.value).then((content) => {
        urlContent.value = content;
      });
    };
    return {
      aaaa,
      urlContent,
      updateUrlContent,
    };
  },
};
</script>

<style></style>
