import { Poppins } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

export const poppins = Poppins({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#005f2c",
      contrastText: "#fff"
    },
    secondary: {
      main: "#09241b",
      contrastText: "#fff"
    },
    error: {
      main: '#eb2945',
    },
    background: {
      default: "#00040B",
    },
  },

  typography: {
    fontFamily: poppins.style.fontFamily,
    allVariants: {
      color: '#fff'
    },
     button: {
      textTransform: 'capitalize'
     }
  }
});

export default theme;
