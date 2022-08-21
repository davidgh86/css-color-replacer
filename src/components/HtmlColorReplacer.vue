<template>
  <div>
    <div><input type="text" v-model="htmlUrl" /></div>
    <div>
      <button type="button" @click="updateUrlContent($event)">Click Me!</button>
    </div>
    <div class="html-content-parent">
      <FullHtmlRenderer
        class="html-content-src"
        :content="urlContent"
        :scale="scale"
        @load="loadedSrc()"
      />
      <FullHtmlRenderer
        class="html-content-dest"
        :content="urlContent"
        :scale="scale"
      />
    </div>
    <ColorReplacer :cssText="cssText" />
  </div>
</template>

<script>
import { ref } from "vue";
import ColorReplacer from "./ColorReplacer.vue";
import FullHtmlRenderer from "./FullHtmlRenderer.vue";
import { getUrlContent } from "@/services/client";

export default {
  name: "HtmlColorReplacer",
  components: {
    ColorReplacer,
    FullHtmlRenderer,
  },
  setup() {
    const cssText = ref("");
    const htmlUrl = ref("");
    const htmlContent = ref("");
    const scale = ref(1);
    const urlContent = ref(``);
    const updateUrlContent = () => {
      getUrlContent(htmlUrl.value)
        .then((content) => {
          urlContent.value = content;
        })
        .catch((error) => alert(error));
    };
    const loadedSrc = () => {
      cssText.value = urlContent.value;
    };
    return {
      htmlContent,
      urlContent,
      updateUrlContent,
      scale,
      htmlUrl,
      loadedSrc,
      cssText,
    };
  },
};
</script>
<style>
.html-content-parent {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.html-content-src {
  grid-column: 1;
}
.html-content-dest {
  grid-column: 2;
}
</style>
