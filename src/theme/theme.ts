import React from "react";

const palette = {
  lightgray: "#F5F5F5",
  lightblue: "#0ECD9D",
  lightgreen: "#5EBD9E",
  lightyellow: "#F0C987",
  lightred: "#FF7F7F",
  darkgray: "#333333",
  darkblue: "#272727",
  darkgreen: "#3C947F",
  darkyellow: "#C9B13B",
  darkred: "#FF6666",

  black: "#000000",
  blacklighter: "#7F7F7F",

  white: "#FFFFFF",
  whitelighter: "#BEBEBE",
};

export const theme = {
  colors: {
    background: palette.lightgray,
    foreground: palette.darkgray,
    primary: palette.lightgreen,
    secondary: palette.lightyellow,
    danger: palette.lightred,

    blue: palette.lightblue,
    green: palette.lightgreen,
    yellow: palette.lightyellow,

    primaryText: palette.black,
    secondaryText: palette.blacklighter,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  textVariants: {
    header: {
      // TODO:
      //   fontFamily: "Raleway",
      fontSize: 36,
      fontWeight: "bold",
    },
    body: {
      //   fontFamily: "Merriweather",
      fontSize: 16,
    },
  },
};

export const darkTheme = {
  ...theme,
  colors: {
    background: palette.darkgray,
    foreground: palette.lightgray,
    primary: palette.darkgreen,
    secondary: palette.darkyellow,
    danger: palette.darkred,

    blue: palette.darkblue,
    green: palette.darkgreen,
    yellow: palette.darkyellow,

    primaryText: palette.white,
    secondaryText: palette.whitelighter,
  },
};

export const ThemeContext = React.createContext(theme);
