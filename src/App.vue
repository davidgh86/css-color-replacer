<template>
  <HtmlColorReplacer />
</template>

<script>
import HtmlColorReplacer from "./components/HtmlColorReplacer.vue";


export default {
  name: "App",
  components: {
    HtmlColorReplacer
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
