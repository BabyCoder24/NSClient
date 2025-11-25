import type { Theme } from "@mui/material/styles";
import type { Components } from "@mui/material/styles";
import { listSubheaderClasses } from "@mui/material/ListSubheader";
import { listItemButtonClasses } from "@mui/material/ListItemButton";
import { typographyClasses } from "@mui/material/Typography";

/* eslint-disable import/prefer-default-export */
export const sidebarCustomizations: Components<Theme> = {
  MuiDrawer: {
    styleOverrides: {
      root: () => ({
        [`& .${listSubheaderClasses.root}`]: {
          lineHeight: 3,
        },
        [`& .${listItemButtonClasses.root}`]: {
          "&.Mui-selected": {
            [`& .${typographyClasses.root}`]: {
              color: "white",
            },
          },
        },
      }),
    },
  },
};
