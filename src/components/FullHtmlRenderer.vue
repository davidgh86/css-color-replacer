<template>
  <div>
    <iframe
      :src="srcIFrame"
      class="frame"
      frameborder="0"
      v-bind:style="{ transform: 'scale(' + scale + ')' }"
      @load="loaded()"
    ></iframe>
  </div>
</template>

<script>
import { computed } from "vue";
import { fromByteArray } from "base64-js/index";

export default {
  name: "FullHtmlRenderer",
  emits: ["load"],
  components: {},
  props: {
    content: {
      type: String,
      required: true,
    },
    scale: {
      type: Number,
      default: 1,
    },
  },
  setup(props, { emit }) {
    const srcIFrame = computed(() => {
      const utf8Encode = new TextEncoder();
      const byteArray = utf8Encode.encode(props.content);
      const dat = fromByteArray(byteArray);
      return `data:text/html;base64,${dat}`;
    });
    const loaded = () => {
      emit("load");
    };
    return {
      srcIFrame,
      loaded,
    };
  },
};
</script>

<style>
.frame {
  width: 100%;
  transform-origin: 0 0;
  left: 0;
  top: 0;
}
</style>
