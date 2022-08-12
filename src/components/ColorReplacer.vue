<template>
  <div>
    Usar transparencias <input type="checkbox" v-model="useTransparences" />
    <div class="inputrow">
      <div class="input-containter">
        <textarea
          v-model="inputCss"
          @input="updateInputCss"
          placeholder="input css"
        ></textarea>
      </div>
      <div class="button-containter">
        <!--button type="button" @click="transformCSS">Click Me!</button> -->
        <dialog id="dialog" class="dialog" v-bind:style="pickerPosition">
          <form method="dialog">
            <ColorPicker
              :color="pickerColor"
              alpha-channel="hide"
              :visible-formats="['rgb']"
              :default-format="'rgb'"
              @color-change="colorChange"
            ></ColorPicker>
            <button>OK</button>
          </form>
        </dialog>
      </div>
      <div class="output-containter">
        <textarea v-model="replacedColors" placeholder="output css"></textarea>
      </div>
    </div>
    <div v-for="(color, index) in colors" :key="index">
      <div class="wrapper">
        <div
          class="one"
          :style="{ backgroundColor: 'rgb(' + color.colorOrig + ')' }"
        >
          {{ color.colorOrig }} | {{ rgbStrintoHex(color.colorOrig) }}
        </div>
        <div
          class="two"
          :style="{ backgroundColor: 'rgb(' + color.colorDest + ')' }"
        >
          <div>
            {{ color.colorDest }} | {{ rgbStrintoHex(color.colorDest) }}
          </div>
          <div>
            <!-- <input type="text" v-model="color.colorDest" /> -->
            <button
              onclick="dialog.showModal()"
              @click="initColorPicker(index)"
            >
              Open Dialog
            </button>
          </div>
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
import {
  //obtainHEXValues,
  rgbaObjectToHEX,
  normalizeSimpleColorObject,
  normalizeSimpleColorNameString,
  obtainAllColors,
  toHex,
} from "../services/color";
import { v4 as uuidv4 } from "uuid";
import { ColorPicker } from "vue-accessible-color-picker";
//import { ColorPicker } from "vue-accessible-color-picker/unstyled";

export default {
  name: "HelloWorld",
  components: {
    ColorPicker,
  },
  data() {
    return {
      colors: [],
      colorsCache: new Map(),
      useTransparences: false,
      inputCss: "",
      replacedColors: "",
      pickerPosition: {
        top: "20px",
        left: "20px",
      },
      pickerColor: "rgb(255, 255, 255)",
      selectedIndex: 0,
    };
  },
  mounted() {},
  watch: {},
  methods: {
    updateInputCss: debounce(function () {
      this.initializeModelColorMap();
      this.updateColorsCache();
    }, 2000),
    initColorPicker: function (idx) {
      this.selectedIndex = idx;
      this.pickerColor = `rgb(${this.colors[idx].colorDest})`;
    },
    colorChange: function (eventData) {
      const value =
        parseInt(eventData.colors.rgb.r * 255) +
        ", " +
        parseInt(eventData.colors.rgb.g * 255) +
        ", " +
        parseInt(eventData.colors.rgb.b * 255);
      this.colors[this.selectedIndex].colorDest = value;
    },
    initializeModelColorMap: function () {
      const result = [];
      const auxMap = new Map();
      const allColors = obtainAllColors(this.inputCss);
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
    getReplacementMap() {
      const result = new Map();
      for (const color of this.colors) {
        result.set(
          color.colorOrig,
          normalizeSimpleColorObject(color.colorDest)
        );
        if (color.transparencies) {
          for (const transparence of color.transparencies) {
            result.set(
              color.colorOrig,
              normalizeSimpleColorObject(color.colorDest + ", " + transparence)
            );
          }
        }
      }
      return result;
    },
    replaceAllColors: function (cssOriginalContent, colorsMap) {
      const replacementMap = this.getReplacementMap();

      let resultantCss = (" " + cssOriginalContent).slice(1);

      // to avoid wrong replacements
      let uuid = uuidv4();

      const orderedColorsMap = new Map(
        [...colorsMap].sort((a, b) => b[0].length - a[0].length)
      );
      // to avoid wrong replacements

      for (const [key, originalValue] of orderedColorsMap) {
        const normalized = normalizeSimpleColorNameString(originalValue);
        const replacementValue = replacementMap.get(normalized);
        const newColorValue =
          "#" + uuid + rgbaObjectToHEX(replacementValue).substring(1);
        resultantCss = resultantCss.replaceAll(key, newColorValue);
      }

      return resultantCss.replaceAll(uuid, "");
    },
    rgbStrintoHex: function (s) {
      return toHex(s);
    },
    transformCSS: function () {
      const allColors = obtainAllColors(this.inputCss);
      const replacedCss = this.replaceAllColors(this.inputCss, allColors);
      this.replacedColors = replacedCss;
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
.inputrow {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 10px;
  grid-auto-rows: minmax(100px, auto);
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
.input-containter {
  grid-column: 1 / 6;
}
.button-containter {
  grid-column: 6 / 8;
}
.output-containter {
  grid-column: 8 / 13;
}

dialog {
  border: none !important;
  box-shadow: 0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 1.6rem;
  max-width: 400px;
  position: absolute;
  margin: 0 0 0 0px;
}

::backdrop {
  background-color: rgb(255, 255, 255, 6%);
}
</style>
