import { Box, MenuItem, Select, Typography, SelectChangeEvent, MenuList } from "@mui/material";

import { useState } from "react";
import { useGetStudioDisplayQuery } from "./app/services/productNotificationSlice";

const App = () => {
  const [currSelect, setCurrSelect] = useState("M2 Macbook Air");
  const [currSearchProduct, setCurrSearchProduct] = useState("MK0U3LL/A");
  const { data: storeProductAvailability } = useGetStudioDisplayQuery(currSearchProduct);

  const handleProductChange = (event: SelectChangeEvent<string>) => {
    if (event.target.value === "Select Desired Product") {
      return;
    }
    setCurrSearchProduct(event.target.value);
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setCurrSelect(event.target.value);
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
      <Typography variant="h4" sx={{ paddingY: "1rem" }}>
        {currSelect} Availability Tracker!
      </Typography>
      <Select onChange={handleSelectChange} defaultValue={currSelect}>
        <MenuItem value="M2 Macbook Air">M2 Macbook Air</MenuItem>
        <MenuItem value="Studio Display">Studio Display</MenuItem>
      </Select>

      <Select
        onChange={handleProductChange}
        defaultValue="Select Desired Product"
        sx={{ textAlign: "center", marginY: "1rem", width: "90%" }}
      >
        <MenuItem value="Select Desired Product">Select Desired Product</MenuItem>
        {currSelect === "Macbook Air" && [
          <MenuItem value="Z161">MacBook Air with M2 chip - Midnight</MenuItem>,
          <MenuItem value="Z15Y">MacBook Air with M2 chip - Starlight</MenuItem>,
          <MenuItem value="Z15S">MacBook Air with M2 chip - Space Gray</MenuItem>,
          <MenuItem value="Z15W">MacBook Air with M2 chip - Silver</MenuItem>,
        ]}
        {currSelect === "Studio Display" && [
          <MenuItem value="MK0U3LL/A">Studio Display, Tilt Standard Glass</MenuItem>,
          <MenuItem value="MK0Q3LL/A">
            Studio Display, Tilt- and Height-adjustable Standard Glass
          </MenuItem>,
          <MenuItem value="MMYW3LL/A">Studio Display, Tilt, Nano Texture Glass</MenuItem>,
          <MenuItem value="MMYV3LL/A">
            Studio Display, Tilt- and height- adjustable stand, Nano Texture Glass
          </MenuItem>,
          <MenuItem value="MMYQ3LL/A">Studio Display, Vesa Mount, Standard Glass</MenuItem>,
          <MenuItem value="MMYX3LL/A">Studio Display, Vesa Mount, Nano Texture Glass</MenuItem>,
        ]}
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
