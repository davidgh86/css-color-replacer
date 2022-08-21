<template>
  <div>
    <div><input type="text" v-model="htmlUrl" /></div>
    <div>
      <button type="button" @click="updateUrlContent($event)">Load url</button>
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
        :content="urlDestContent"
        :scale="scale"
      />
    </div>
    <ColorReplacer :cssText="cssText" @cssReplaced="updateDestContent" />
  </div>
</template>

<script>
import { ref } from "vue";
import ColorReplacer from "./ColorReplacer.vue";
import FullHtmlRenderer from "./FullHtmlRenderer.vue";
import { getUrlContent } from "@/services/client";
import { parse } from "@/services/htmlParse";

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
    const urlDestContent = ref(``);
    const updateUrlContent = () => {
      getUrlContent(htmlUrl.value)
        .then((content) => {
          urlContent.value = content;
        })
        .catch((error) => alert(error));
    };
    const loadedSrc = () => {
      cssText.value = urlContent.value;
      // TODO get hostname
      const htmlElement = parse(urlContent.value, "https://finofilipino.org");
      urlDestContent.value = new XMLSerializer().serializeToString(htmlElement);
    };
    const updateDestContent = (replacedColorsCode) => {
      urlDestContent.value = replacedColorsCode;
    };
    return {
      htmlContent,
      urlContent,
      urlDestContent,
      updateUrlContent,
      scale,
      htmlUrl,
      loadedSrc,
      cssText,
      updateDestContent,
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
