import axios from "axios";

export async function getUrlContent(url) {
  // TODO do
  // const cssContent =
  // console.log(url);
  // return `
  //   p {
  //     color: red;
  //     text-align: center;
  //   }
  //       `;
  return (await axios.get(url)).data;
}
