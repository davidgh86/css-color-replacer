// import { shallowMount } from "@vue/test-utils";
// import HelloWorld from "@/components/ColorReplacer.vue";
import { parse } from "@/services/htmlParse";
const fs = require("fs");

//import clientService from "@/services/client";

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const html = fs.readFileSync("tests/unit/resources/finofilipino.txt");

    // const cssContent = `
    // p {
    //   color: red;
    //   text-align: center;
    // }
    //     `;

    //clientService.getUrlContent = jest.fn(() => cssContent);

    //clientService.getUrlContent = jest.fn(() => cssContent);

    //parser.getUrlContent = jest.fn(() => cssContent);
    parse(html, "https://finofilipino.org");

    //expect(getUrlContent).toHaveBeenCalledWith(`${BASE_URL}/users`);
    //parse()
    //expect(wrapper.text()).toMatch(msg);
  });
});
