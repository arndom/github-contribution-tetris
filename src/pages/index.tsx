import { ReactNode, useEffect, useRef, useState } from "react";

import {
  TextField,
  Typography,
  Box,
  useTheme,
  Button,
  InputAdornment,
  Select,
  SelectChangeEvent,
  MenuItem,
  CircularProgress,
  Slider
} from "@mui/material";

import axios from "axios";
import { DataStruct, drawContributions } from "../utils/drawContributions";

export default function Home() {
  const theme = useTheme();

  const [year, setYear] = useState(`${new Date().getFullYear()}`);
  const [loading, setLoading] = useState(false);
  const [userError] = useState(false);
  const [data, setData] = useState<DataStruct>();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // current year to year github was founded(2008)
  const years = () => {
    let currentYear = new Date().getFullYear();
    const _years = [currentYear];

    while (currentYear !== 2008) {
      _years.push(--currentYear);
    }

    return _years;
  };

  const handleYearChange = (event: SelectChangeEvent) => {
    setYear(event.target.value);
  };

  const handleLoading = () => {
    setLoading(true);

    axios
      .get("/api/test")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (canvasRef.current && data) {
      drawContributions(canvasRef.current, {
        data,
        username: "arndom",
        themeName: "githubDark",
        skipHeader: true,
      });
    }
  }, [data]);

  if (!data) {
    return (
      <>
        <Typography
          variant="h2"
          component="h1"
          fontWeight={500}
          sx={{
            filter: "drop-shadow(0 0 .3rem #ffffff70)",
          }}
        >
          Your GitHub story as Tetris
        </Typography>

        <Typography variant="body1" mt={2.5} color="grey">
          Enter your GitHub username to
          <br />
          generate tetris from your contribution graph
        </Typography>

        <Box
          mt={3.25}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <TextField
            variant="outlined"
            placeholder="username"
            name="gh_username"
            error={userError}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "inherit",
                borderRadius: "8px",
                fontSize: "1.15rem",

                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  boxShadow: "0 0 1.25rem 0.15rem rgba(39, 213, 69, 0.5)",
                  borderWidth: "2px",
                },

                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "unset",
                  borderWidth: "2px",
                  boxShadow: "0 0 1.25rem 0.15rem rgba(39, 213, 69, 0.25)",
                },

                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                  borderWidth: "2px",
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography sx={{ fontSize: "1.15rem", color: "#687473" }}>
                    |
                  </Typography>

                  <Select
                    variant="standard"
                    label="Year"
                    value={year}
                    onChange={handleYearChange}
                    sx={{
                      "& .MuiSelect-select": {
                        color: "#fff",
                        letterSpacing: "0.045em",
                      },

                      "& .MuiSvgIcon-root": {
                        color: "#fff",
                      },

                      "&:after, :before": {
                        border: "none",
                      },

                      "&:hover:not(.Mui-disabled, .Mui-error):before": {
                        border: "none",
                      },
                    }}
                    MenuProps={{
                      sx: {
                        "& .MuiPaper-root": {
                          background: theme.palette.background.default,
                          maxHeight: "180px",
                        },
                      },
                    }}
                  >
                    {years().map((yr) => (
                      <MenuItem key={yr} value={yr}>
                        {yr}
                      </MenuItem>
                    ))}
                  </Select>

                  {!loading && (
                    <Button
                      onClick={handleLoading}
                      sx={{
                        borderRadius: "8px",
                        boxShadow: "none",
                      }}
                    >
                      Generate
                    </Button>
                  )}

                  {loading && (
                    <CircularProgress
                      sx={{
                        color: "rgba(39, 213, 69, 0.75)",
                        filter: "drop-shadow(0 0 .3rem #ffffff70)",
                      }}
                    />
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {userError && (
          <Typography variant="body2" color="error" mt={2}>
            Sorry, user not found on github
          </Typography>
        )}
      </>
    );
  }

  return (
    <>
      <Box>
        <canvas ref={canvasRef} />
        <Slider
          size="small"
          defaultValue={70}
          valueLabelDisplay="auto"
          sx={{ mt: -1 }}
        />
      </Box>

      <Typography variant="body1" mb={2} color="grey">
        Use the slider to select your playable section
      </Typography>
      <Button variant="outlined">Generate Game</Button>
    </>
  );
}
