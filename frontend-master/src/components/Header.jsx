import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link } from "react-router-dom";


const pages1 = [
  {
    title: 'Add Patient',
    url: 'hospital/addPatient',
    showOnAuth: true,


  },
  {
    title:'Patient Orders',
    url: 'hospital/viewOrders',
    showOnAuth: true,
    
  },
  {
    title:'Accept Medicine',
    url: 'hospital/acceptMedicine',
    showOnAuth: true,
  },
  {
    title:'Login',
    url: '/login',
    showOnAuth: false,


  },
  {
    title:'SignUp',
    url: '/signup',
    showOnAuth: false,
  },
  {
    title:'Track Shipment',
    url: 'trackShipment',
    showOnAuth: true,

  },{
    title:'Feedback',
    url: 'feedback',
    showOnAuth: true,

  },
  {
    title:'Logout',
    showOnAuth: true,
  }
  

]

const pages2=[
  
  {
    title: 'Dispatch',
    url: 'vendor/dispatch',
    showOnAuth: true,
    
  },
  {
    title:'Vendor Orders',
    url: 'vendor/viewShipments',
    showOnAuth: true,

  },
  {
    title:'Add Medicine',
    url: 'vendor/Addmedicine',
    showOnAuth: true,
  },
  {
    title:'Login',
    url: '/login',
    showOnAuth: false,


  },
  {
    title:'SignUp',
    url: '/signup',
    showOnAuth: false,
  },
  
  {
    title:'Track Shipment',
    url: 'trackShipment',
    showOnAuth: true,

  },{
    title:'Feedback',
    url: 'feedback',
    showOnAuth: true,

  },
  
  {
    title:'Logout',
    showOnAuth: true,
  }

]

const pages3=[
  
  {
    title:'Login',
    url: '/login',
    showOnAuth: false,


  },
  {
    title:'SignUp',
    url: '/signup',
    showOnAuth: false,
  },
]

const pages4=[
  {
    title: 'Dashboard',
    url: 'government/dashboard',
    showOnAuth: true,

  },
  
  {
    title:'Logout',
    showOnAuth: true,
  }

]

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  



  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const isAuthenticated = localStorage.getItem("user") ? true : false;

  if (localStorage.getItem("user")) {
    var user = JSON.parse(localStorage.getItem("user"));
    var pages = null;
    if (user.type === "Hospital") {
      pages = pages1;
    }
    else if (user.type === "Vendor") {
       pages = pages2;
    }
    else if (user.type === "Government") {
      pages = pages4;
    }

  }
  else {
    pages = pages3;
  }

  

  return (
    <AppBar position="static" color='transparent'>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            MediChain
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => {
                if (page.showOnAuth === isAuthenticated) {

                  if(page.title === 'Logout')
                    return (
                      <MenuItem key={page.title} onClick={() => {
                        handleCloseNavMenu();
                        localStorage.removeItem("user");
                        window.location.href = "/login";
                      }}>
                        <Button color="inherit">
                          {page.title}
                        </Button>
                      </MenuItem>
                    );
                  
                  else
                  return (
                    <MenuItem key={page.title} onClick={handleCloseNavMenu}>
                      <Button color="inherit" component={Link} to={page.url}>
                        {page.title}
                      </Button>
                    </MenuItem>
                  );
                }
                else {
                  <MenuItem key={page.title} onClick={handleCloseNavMenu}>
                    <Button color="inherit" component={Link} to={page.url}>
                      {page.title}
                    </Button>
                  </MenuItem>
                }

              })}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'black',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) =>{
              if (page.showOnAuth === isAuthenticated) {


                if(page.title === 'Logout')
                  return (
                    <Button
                      key={page.title}
                      onClick={() => {
                        handleCloseNavMenu();
                        localStorage.removeItem("user");
                        window.location.href = "/login";
                      }}
                      sx={{
                        my: 2,
                        color: 'black',
                        display: 'block',
                      }}
                    >
                      {page.title}
                    </Button>
                  );
                
                else
                return (
                  <Button
                    key={page.title}
                    onClick={handleCloseNavMenu}
                    sx={{
                      my: 2,
                      color: 'black',
                      display: 'block',
                    }}
                    component={Link}
                    to={page.url}
                  >
                    {page.title}
                  </Button>
                );
              }
              else {
                <Button
                  key={page.title}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: 'black',
                    display: 'block',
                  }}
                  component={Link}
                  to={page.url}
                >
                  {page.title}
                </Button>
              }
            }
            )}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
