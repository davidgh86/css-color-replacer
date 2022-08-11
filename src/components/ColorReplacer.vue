<template>
  <div>
    Usar transparencias <input type="checkbox" v-model="useTransparences" />
    <div class="wrapper">
      <div class="one">
        <textarea
          v-model="inputCss"
          @input="updateInputCss"
          placeholder="input css"
        ></textarea>
      </div>
      <div class="two">
        <textarea v-model="replaceColors" placeholder="output css"></textarea>
      </div>
    </div>
    <div v-for="(color, index) in colors" :key="index">
      <div class="wrapper">
        <div
          class="one"
          :style="{ backgroundColor: 'rgb(' + color.colorOrig + ')' }"
        >
          {{ color.colorOrig }} | {{ toHex(color.colorOrig) }}
        </div>
        <div
          class="two"
          :style="{ backgroundColor: 'rgb(' + color.colorDest + ')' }"
        >
          <div>{{ color.colorDest }} | {{ toHex(color.colorDest) }}</div>
          <div><input type="text" v-model="color.colorDest" /></div>
        </div>
      </div>
      <div v-if="useTransparences && color.transparencies">
        <div
          v-for="(transparency, idx) in color.transparencies"
          :key="idx"
          class="wrapper"
        >
          <div
            class="one"
            :style="{
              backgroundColor:
                'rgba(' + color.colorOrig + ', ' + transparency + ')',
            }"
          >
            {{ color.colorOrig }}, {{ transparency }}
          </div>
          <div
            class="two"
            :style="{
              backgroundColor:
                'rgba(' + color.colorDest + ', ' + transparency + ')',
            }"
          >
            {{ color.colorDest }}, {{ transparency }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from "lodash";
//import hexToInt from "../services/color";

export default {
  name: "HelloWorld",
  data() {
    return {
      colors: [],
      colorsCache: new Map(),
      useTransparences: false,
      inputCss: "",
      replaceColors: "",
    };
  },
  mounted() {},
  watch: {
    // inputCss() {
    //   debounce(() => {
    //     alert("dfsa");
    //   }, 2000);
    // },
  },
  methods: {
    // updateInputCss: _.debounce(() => {
    //   this.colors = this.initializeModelColorMap();
    //   this.updateColorsCache();
    // }, 2000),
    updateInputCss: debounce(function () {
      this.initializeModelColorMap();
      this.updateColorsCache();
    }, 2000),
    initializeModelColorMap: function () {
      const result = [];
      const auxMap = new Map();
      const allColors = this.obtainAllColors(this.inputCss);
      for (const [, originalValue] of allColors) {
        const standarizedKey =
          originalValue.red +
          ", " +
          originalValue.green +
          ", " +
          originalValue.blue;
        if (!auxMap.has(standarizedKey)) {
          auxMap.set(standarizedKey, []);
        }
        if (originalValue.alpha || originalValue.alpha == 0) {
          auxMap.get(standarizedKey).push(originalValue.alpha);
        }
      }
      for (const [key, transparenciesList] of auxMap) {
        const previousCoincidentColor = this.colors.find(
          (color) => color.colorOrig === key
        );
        if (previousCoincidentColor) {
          // to keep color if existed previosly and it was modified before when changing input css
          result.push(previousCoincidentColor);
          continue;
        } else {
          if (this.colorsCache.has(key)) {
            result.push(this.colorsCache.get(key));
            continue;
          }
        }
        let resultData = {
          colorOrig: key,
          colorDest: key,
        };
        if (transparenciesList.length > 0) {
          resultData = {
            ...resultData,
            transparencies: transparenciesList,
          };
        }
        result.push(resultData);
      }
      this.colors = result;
    },
    updateColorsCache: function () {
      for (const historyColor of this.colors) {
        this.colorsCache.set(historyColor.colorOrig, historyColor);
      }
    },
    componentToHex: function (c) {
      var integer = parseInt(c);
      return this.integerToHEX(integer);
    },
    integerToHEX: function (i) {
      var hex = i.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    },
    toHex: function (str) {
      const components = str.split(",");
      return (
        "#" + components.map((s) => this.componentToHex(s.trim())).join("")
      );
    },
    getReplacementMap() {
      const result = new Map();
      for (const color of this.colors) {
        result.set(
          color.colorOrig,
          this.normalizeSimpleColorObject(color.colorDest)
        );
        if (color.transparencies) {
          for (const transparence of color.transparencies) {
            result.set(
              color.colorOrig,
              this.normalizeSimpleColorObject(
                color.colorDest + ", " + transparence
              )
            );
          }
        }
      }
      return result;
    },
    obtainAllColors: function (s) {
      const allRgb = this.obtainRGBValues(s);
      const allRgba = this.obtainRGBAValues(s);
      const hexValues = this.obtainHEXValues(s);

      const accMap = new Map();

      const allColors = [...allRgb, ...allRgba, ...hexValues];

      allColors.forEach((colorObject) => {
        if (accMap.has(colorObject.originalString)) {
          return;
        }
        let data = {
          red: colorObject.red,
          green: colorObject.green,
          blue: colorObject.blue,
        };
        if (colorObject.alpha || colorObject.alpha == 0) {
          data = {
            ...data,
            alpha: colorObject.alpha,
          };
        }
        accMap.set(colorObject.originalString, data);
      });
      return accMap;
    },
    uuid: function () {
      var ret = "",
        value;
      for (var i = 0; i < 32; i++) {
        value = (Math.random() * 16) | 0;
        // Insert the hypens
        if (i > 4 && i < 21 && !(i % 4)) {
          ret += "-";
        }
        // Add the next random character
        ret += (i === 12 ? 4 : i === 16 ? (value & 3) | 8 : value).toString(16);
      }
      return ret;
    },
    replaceAllColors: function (cssOriginalContent, colorsMap) {
      const replacementMap = this.getReplacementMap();

      let resultantCss = (" " + cssOriginalContent).slice(1);

      // to avoid wrong replacements
      let uuid;
      do {
        uuid = this.uuid();
      } while (this.obtainHEXValues("#" + uuid).length == 0);

      const orderedColorsMap = new Map(
        [...colorsMap].sort((a, b) => b[0].length - a[0].length)
      );
      // to avoid wrong replacements

      for (const [key, originalValue] of orderedColorsMap) {
        const normalized = this.normalizeSimpleColorNameString(originalValue);
        const replacementValue = replacementMap.get(normalized);
        const newColorValue =
          "#" + uuid + this.rgbaObjectToHEX(replacementValue).substring(1);
        resultantCss = resultantCss.replaceAll(key, newColorValue);
      }

      resultantCss.replaceAll(uuid, "");
      return resultantCss;
    },
    normalizeSimpleColorNameString: function (colorObj) {
      const result =
        colorObj.red + ", " + colorObj.green + ", " + colorObj.blue;
      if (colorObj.alpha || colorObj.alpha == 0) {
        return result + ", " + colorObj.alpha;
      }
      return result;
    },
    normalizeSimpleColorObject: function (colorString) {
      const splitColorString = colorString.split(",");
      const data = {
        red: parseInt(splitColorString[0]),
        green: parseInt(splitColorString[1]),
        blue: parseInt(splitColorString[2]),
      };
      if (splitColorString.length == 4) {
        return {
          ...data,
          alpha: parseFloat(splitColorString[3]),
        };
      }
      return data;
    },

    rgbaObjectToHEX: function (obj) {
      const result =
        "#" +
        this.integerToHEX(obj.red) +
        this.integerToHEX(obj.green) +
        this.integerToHEX(obj.blue);
      if (obj.alpha || obj.alpha == 0) {
        return result + this.integerToHEX(parseInt(obj.alpha * 255));
      }
      return result;
    },
    obtainRGBValues: function (s) {
      const res = [];
      let regexRGB =
        /rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/gi;
      let results = s.matchAll(regexRGB);
      for (let result of results) {
        const red = parseInt(result[1]);
        const green = parseInt(result[2]);
        const blue = parseInt(result[3]);

        if (red < 256 && blue < 256 && green < 256) {
          res.push({
            originalString: result[0],
            red: red,
            green: green,
            blue: blue,
          });
        }
      }
      return res;
    },
    obtainRGBAValues: function (s) {
      const res = [];
      let regexRGBA =
        /rgba\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\.(\d+)|0(\.\d+)?|1(\.0+)?)\s*\)/gi;
      let results = s.matchAll(regexRGBA);
      for (let result of results) {
        const red = parseInt(result[1]);
        const green = parseInt(result[2]);
        const blue = parseInt(result[3]);
        const alpha = parseFloat(result[4]);

        if (red < 256 && blue < 256 && green < 256 && alpha <= 1) {
          res.push({
            originalString: result[0],
            red: red,
            green: green,
            blue: blue,
            alpha: alpha,
          });
        }
      }
      return res;
    },
    obtainHEXValues: function (s) {
      const res = [];
      let regexHEX = /#([A-F0-9]{3,8})/gi;
      let results = s.matchAll(regexHEX);
      for (let result of results) {
        const rgbElement = this.obtainRGBValuesFromHex(result[0], result[1]);
        if (rgbElement) {
          res.push(rgbElement);
        }
      }
      return res;
    },
    obtainRGBValuesFromHex: function (originalString, s) {
      const upperCaseCode = s.toUpperCase();
      const length = upperCaseCode.length;
      let r;
      let g;
      let b;
      let a;
      if (length == 3 || length == 4) {
        r = s[0] + s[0];
        g = s[1] + s[1];
        b = s[2] + s[2];
        if (length == 4) {
          a = s[3] + s[3];
        }
      } else if (length == 6 || length == 8) {
        r = s[0] + s[1];
        g = s[2] + s[3];
        b = s[4] + s[5];
        if (length == 8) {
          a = s[6] + s[7];
        }
      } else {
        return null;
      }

      const data = {
        originalString: originalString,
        red: this.hexToInt(r),
        green: this.hexToInt(g),
        blue: this.hexToInt(b),
      };
      if (a || a == 0) {
        return {
          ...data,
          alpha: parseInt((this.hexToInt(a) / 255) * 100) / 100,
        };
      }

      return data;
    },
    hexToInt: function (s) {
      return parseInt(s, 16);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
textarea {
  height: 100%;
  width: 100%;
  -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
  -moz-box-sizing: border-box; /* Firefox, other Gecko */
  box-sizing: border-box; /* Opera/IE 8+ */
}
.wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
  grid-auto-rows: minmax(100px, auto);
}
.one {
  grid-column: 1;
}
.two {
  grid-column: 2;
}
</style>
