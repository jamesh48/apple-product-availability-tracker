import { Box, MenuItem, Select, Typography } from "@mui/material";

import { useState } from "react";
import { useGetStudioDisplayQuery } from "./app/services/productNotificationSlice";

const App = () => {
  const [currSearchProduct, setCurrSearchProduct] = useState("MK0U3LL/A");
  const { data: storeProductAvailability } = useGetStudioDisplayQuery(currSearchProduct);

  const handleChange = (event) => {
    setCurrSearchProduct(event.target.value);
  };

  return (
    <Box
      sx={{
        mt: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h4">Studio Display Availability Tracker!</Typography>
      <Select
        onChange={handleChange}
        defaultValue="MK0U3LL/A"
        sx={{ textAlign: "center", marginY: "1rem", width: "90%" }}
      >
        <MenuItem value="MK0U3LL/A">Studio Display, Tilt Standard Glass</MenuItem>
        <MenuItem value="MK0Q3LL/A">
          Studio Display, Tilt- and Height-adjustable Standard Glass
        </MenuItem>
        <MenuItem value="MMYW3LL/A">Studio Display, Tilt, Nano Texture Glass</MenuItem>
        <MenuItem value="MMYV3LL/A">
          Studio Display, Tilt- and height- adjustable stand, Nano Texture Glass
        </MenuItem>
        <MenuItem value="MMYQ3LL/A">Studio Display, Vesa Mount, Standard Glass</MenuItem>
        <MenuItem value="MMYX3LL/A">Studio Display, Vesa Mount, Nano Texture Glass</MenuItem>
      </Select>

      {storeProductAvailability?.length ? (
        <Box
          sx={{
            width: "87.5%",
            border: "1px solid black",
            display: "flex",
            flexDirection: "column",
            padding: ".5rem",
            maxHeight: "70rem",
            overflowY: "auto",
          }}
        >
          {storeProductAvailability.map((storeRange) => {
            return (
              <Box sx={{ pl: ".5rem" }}>
                <Typography sx={{ textDecoration: "underline" }}>{storeRange[0].state}</Typography>
                {storeRange.every(
                  (storeInState) => storeInState.availabilityStatus === "Currently unavailable",
                ) ? (
                  <Box sx={{ display: "flex", gap: "1rem", pl: "1rem" }}>
                    <Typography sx={{ flex: 1 }}>...has no availability</Typography>
                  </Box>
                ) : (
                  storeRange.map((store) => {
                    return (
                      <Box
                        sx={{
                          display: "flex",
                          gap: "1rem",
                          backgroundColor:
                            store.availabilityStatus !== "Currently unavailable"
                              ? "green"
                              : "white",
                          color:
                            store.availabilityStatus !== "Currently unavailable"
                              ? "white"
                              : "black",
                          pl: "1rem",
                        }}
                      >
                        <Typography sx={{ flex: 1 }}>{store.storeName}</Typography>
                        <Typography sx={{ flex: 1 }}>{store.availabilityStatus}</Typography>
                      </Box>
                    );
                  })
                )}
              </Box>
            );
          })}
        </Box>
      ) : null}
    </Box>
  );
};

export default App;
