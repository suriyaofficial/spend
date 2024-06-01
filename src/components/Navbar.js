import React, { useState } from "react";
// import { app } from "./firebaseconfig";
import { AppBar, Toolbar, Tabs, Tab, useMediaQuery, useTheme, } from "@mui/material";
import { Link } from "react-router-dom";
import Drawer from "./DrawerComp";
import logo from "../assets/navlogo.jpg";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";



const Navbar = () => {
  // const auth = getAuth(app);

  let navigate = useNavigate();
  const [value, setValue] = useState();
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  const logout = async () => {
    try {

      // let result = await signOut(auth)
      console.log("🚀 ~ file: Navbar.js:23 ~ logout ~ result:", result)
      // await localStorage.clear();
      // navigate("/");
      // window.location.reload();
    } catch (error) {
      console.log("🚀 ~ file: Navbar.js:28 ~ logout ~ error:", error)

    }

  };

  return (

    <>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <AppBar position="float" sx={{ background: "#000000", borderBottom: "1px solid white" }}>
            <Toolbar>
              <img className="img" src={logo} alt="" />
              <Drawer />

            </Toolbar>
          </AppBar>
        </Grid>
      </Grid>
    </>
  );
};

export default Navbar;
