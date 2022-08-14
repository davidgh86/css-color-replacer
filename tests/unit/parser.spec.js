// import { shallowMount } from "@vue/test-utils";
// import HelloWorld from "@/components/ColorReplacer.vue";
import { parse } from "@/services/htmlParse";
import { createAssignmentExpression } from "@vue/compiler-core";
const fs = require("fs");

import { getUrlContent } from "../../src/services/client";

jest.mock("../../src/services/client", () => {
  const originalModule = jest.requireActual("../../src/services/client");

  return {
    __esModule: true,
    ...originalModule,
    getUrlContent: jest.fn((url) => {
      //const axios = require("axios");
      const fsys = require("fs");
      let fileName = url.split("/").pop().split("?");
      let queryParams = "";
      if (fileName.length > 0) {
        queryParams = fileName[1].split("&");
        queryParams = queryParams
          .map((queryParam) => queryParam.replaceAll("=", "-"))
          .join("_");
      }

      fileName = fileName[0];
      fileName = fileName + queryParams;
      fileName = "tests/unit/resources/" + fileName;

      return fsys.readFileSync(fileName);
    }),
  };
});

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const html = fs.readFileSync("tests/unit/resources/finofilipino.txt");
    parse(html, "https://finofilipino.org");
  });
});
