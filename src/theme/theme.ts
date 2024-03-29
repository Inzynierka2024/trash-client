import { createContext } from "react";

export const palette = {
  lightgray: "#F5F5F5",
  lightblue: "#0ECD9D",
  lightgreen: "#3c947f",
  lightyellow: "#F0C987",
  lightred: "#FF7F7F",
  darkgray: "#333333",
  darkblue: "#5048a8",
  darkgreen: "#3c947f",
  darkyellow: "#C9B13B",
  darkred: "#FF6666",

  gray: "#999999",

  brown: "#690d0d",

  dimmedBackground: "#00000099",

  navbar: "rgb(255, 255, 255)",
  navbardark: "rgb(18, 18, 18)",

  disabled: "#555",

  black: "#000000",
  blacklighter: "#7F7F7F",

  white: "#FFFFFF",
  whitelighter: "#BEBEBE",

  whiten: "#FFFFFF20",
  whiten2: "#FFFFFF60",
  darken: "#00000020",
  darken2: "#00000060",
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

    disabled: palette.disabled,
    navbar: palette.navbar,

    contrastOverlay: palette.darken,

    transparentBackground: palette.lightgray + "A0",
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

    disabled: palette.disabled,
    navbar: palette.navbardark,

    contrastOverlay: palette.whiten,

    transparentBackground: palette.darkgray + "A0",
  },
};

export const ThemeContext = createContext(theme);
export interface CTheme {
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    danger: string;

    blue: string;
    green: string;
    yellow: string;

    primaryText: string;
    secondaryText: string;

    disabled: string;
  };
  spacing: {
    s: number;
    m: number;
    l: number;
    xl: number;
  };
  textVariants: {
    header: {
      // TODO:
      //   fontFamily: "Raleway",
      fontSize: number;
      fontWeight: string;
    };
    body: {
      //   fontFamily: "Merriweather",
      fontSize: number;
    };
  };
}
