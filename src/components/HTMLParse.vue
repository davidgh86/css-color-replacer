<template>
  <div>hola</div>
</template>

<script>
//import getResources from "html-resources";

export default {
  name: "HTTMLParse",
  mounted() {
    this.getList().then((a) => alert(a));
  },
  methods: {
    async getList() {
      const html = (await this.axios.get("http://localhost:3000/users")).data;
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      console.log(doc);
      const images = doc.getElementsByTagName("img");
      console.log(images);
      return html;
    },
  },
};
</script>

<style></style>
