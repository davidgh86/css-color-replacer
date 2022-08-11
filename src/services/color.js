function hexToInt(s) {
  return parseInt(s, 16);
}

function integerToHEX(i) {
  var hex = i.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function obtainRGBValuesFromHex(originalString, s) {
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
    red: hexToInt(r),
    green: hexToInt(g),
    blue: hexToInt(b),
  };
  if (a || a == 0) {
    return {
      ...data,
      alpha: parseInt((hexToInt(a) / 255) * 100) / 100,
    };
  }

  return data;
}

export function obtainHEXValues(s) {
  const res = [];
  let regexHEX = /#([A-F0-9]{3,8})/gi;
  let results = s.matchAll(regexHEX);
  for (let result of results) {
    const rgbElement = obtainRGBValuesFromHex(result[0], result[1]);
    if (rgbElement) {
      res.push(rgbElement);
    }
  }
  return res;
}

function obtainRGBAValues(s) {
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
}

function obtainRGBValues(s) {
  const res = [];
  let regexRGB = /rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/gi;
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
}

export function rgbaObjectToHEX(obj) {
  const result =
    "#" +
    integerToHEX(obj.red) +
    integerToHEX(obj.green) +
    integerToHEX(obj.blue);
  if (obj.alpha || obj.alpha == 0) {
    return result + integerToHEX(parseInt(obj.alpha * 255));
  }
  return result;
}

export function normalizeSimpleColorObject(colorString) {
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
}

export function normalizeSimpleColorNameString(colorObj) {
  const result = colorObj.red + ", " + colorObj.green + ", " + colorObj.blue;
  return result;
}

function componentToHex(c) {
  var integer = parseInt(c);
  return integerToHEX(integer);
}

export function toHex(str) {
  const components = str.split(",");
  return "#" + components.map((s) => componentToHex(s.trim())).join("");
}

export function obtainAllColors(s) {
  const allRgb = obtainRGBValues(s);
  const allRgba = obtainRGBAValues(s);
  const hexValues = obtainHEXValues(s);

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
}
