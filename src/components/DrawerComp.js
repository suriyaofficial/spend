import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Drawer, List, ListItemButton, ListItemText, ListItemIcon, IconButton } from '@mui/material'
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from "react-router-dom";


const DrawerComp = () => {
    let navigate = useNavigate();
    const [openDrawer, setOpenDrawer] = useState(false);
    const logout = async () => {
        setOpenDrawer(false)
        await localStorage.clear();
        navigate("/");
        window.location.reload();
    }
    return (
        <>
            <Drawer open={openDrawer}
                onClose={() => setOpenDrawer(false)} sx={{ backgroundColor: "black" }}
            >
                <List sx={{ backgroundColor: "black", height: "100vh" }}>
                    <Link to="/" className='NavLink'>
                        <ListItemButton onClick={() => setOpenDrawer(false)}>
                            <ListItemIcon sx={{ color: "white" }} >
                                <TextSnippetIcon />
                                <ListItemText  >Home</ListItemText>
                            </ListItemIcon>
                        </ListItemButton>
                    </Link>
                    <Link to="templates" className='NavLink'>
                        <ListItemButton onClick={() => setOpenDrawer(false)}>
                            <ListItemIcon sx={{ color: "white" }} >

                                <TextSnippetIcon />
                                <ListItemText  >TEMPLETE</ListItemText>
                            </ListItemIcon>
                        </ListItemButton>
                    </Link>
                    <Link to="about" className='NavLink'>
                        <ListItemButton onClick={() => setOpenDrawer(false)}>
                            <ListItemIcon sx={{ color: "white" }} >
                                <InfoIcon />
                                <ListItemText  >ABOUT US</ListItemText>
                            </ListItemIcon>
                        </ListItemButton>
                    </Link>
                    <ListItemButton onClick={logout}>
                        <ListItemIcon sx={{ color: "white" }} >
                            <InfoIcon />
                            <ListItemText  >Logout</ListItemText>
                        </ListItemIcon>
                    </ListItemButton>

                </List>
            </Drawer >

            <IconButton sx={{ marginLeft: "auto" }} onClick={() => setOpenDrawer(!openDrawer)}>
                <MenuIcon sx={{ color: "white" }} />
            </IconButton>

        </>
    )
}

export default DrawerComp
