import * as React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Logo from '../assest/images/37a39cb7092d94d7297953ad09f2dee5.png';
import { PiPhoneCallBold } from "react-icons/pi";
import { AiOutlineUserAdd, AiOutlineLogin } from "react-icons/ai";
const pages = [
    { name: 'Home', path: '/' },
    { name: 'Patients', path: '/patients' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Pharmacy', path: '/pharmacy' },
    { name: 'Staff', path: '/staff' }
];

function Header() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <div>
            <AppBar position="static" sx={{ backgroundColor: '#fff', padding: "6px" }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <img src={Logo} alt="Logo" width={70} className="mr-11" />

                        {/* Menu icon for mobile view */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="menu"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="black"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                keepMounted
                                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{ display: { xs: 'block', md: 'none' } }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                                        <Link to={page.path} style={{ textDecoration: 'none', color: '#000' }}>
                                            <Typography sx={{ textAlign: 'center', textTransform: "capitalize" }}>
                                                <span className="text-[18px] font-[poppins] text-slate-600">{page.name}</span> </Typography>
                                        </Link>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>

                        {/* Desktop view menu */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => (
                                <Link key={page.name} to={page.path} style={{ textDecoration: 'none' }}>
                                    <Button
                                        onClick={handleCloseNavMenu}
                                        sx={{ my: 2, color: 'black', display: 'block', fontWeight: '500', textTransform: "capitalize" }}
                                    >
                                        <span className="text-[18px] font-[poppins] text-slate-600">{page.name}</span>
                                    </Button>
                                </Link>
                            ))}
                        </Box>

                        {/* Register and Log In buttons */}

                        <div className="flex items-center justify-between gap-2"> {/**login button section */}

                            <button className=' bg-green outline  outline-slate-500 xl:flex lg:flex md:flex sm:hidden xsm:hidden items-center justify-between text-[18px]  rounded-md px-2 py-1'> <AiOutlineUserAdd className='mx-1' /><Link to="/register" >Register</Link> </button>
                            <button className='outline  text-slate-600  outline-slate-500 flex items-center justify-between text-[18px]  rounded-md px-2 py-1'> <AiOutlineLogin className='mx-1' />
                                <Link to="/signin" >LogIn</Link>
                            </button>

                        </div>


                        {/* <Box sx={{ flexGrow: 0, display: 'flex', gap: 2 }}>
                            <Link to="/register" className='no-underline'>
                                <Button
                                    variant="contained"
                                    disableElevation
                                    sx={{
                                        height: '30px',
                                        backgroundColor: '#97CE4F',
                                        color: '#000',
                                        fontWeight: '500',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        padding: { xs: '4px 8px', md: 'auto' },
                                    }}
                                >
                                    <HiUserAdd style={{ fontSize: '18px' }} />
                                    <Typography sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
                                        Register
                                    </Typography>
                                </Button>
                            </Link>

                            <Link to="/signin" className='no-underline'>
                                <Button
                                    variant="contained"
                                    disableElevation
                                    sx={{
                                        height: '30px',
                                        backgroundColor: '#97CE4F',
                                        color: '#000',
                                        fontWeight: '500',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        padding: { xs: '4px 8px', md: 'auto'  },
                                    }}
                                >
                                    <IoLogIn style={{ fontSize: '18px' }}  />
                                    <Typography style={{fontFamily:"Poppins"}}  sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
                                        Log In
                                    </Typography>
                                </Button>
                            </Link>
                        </Box> */}
                    </Toolbar>
                </Container>
            </AppBar>

            {/**second section nav bar*/}
            <div className="w-[100%]
            
            xl:flex lg:flex md:flex sm:grid xsm:grid
            
            
              xl:items-center  lg:items-center md:items-center sm:items-start xsm:items-start
              
              xl:justify-between lg:justify-between md:justify-between sm:justify-start xsm:justify-start
              
              bg-green p-2

            ">

                <div className="p-2">
                    <h1 className=' xl:text-[40px] lg:text-[40px] md:text-[38px] sm:text-[34px] xsm:text-[32px] font-bold tracking-wide uppercase text-fontDark'>Amarasingha <span className='text-white'>medicare</span></h1>
                </div>

                <div className=" p-2">
                    <h1 className='flex text-start items-center xl:text-[40px] lg:text-[40px] md:text-[38px] sm:text-[34px] xsm:text-[34px]  font-bold tracking-wide uppercase text-gray-800'> <PiPhoneCallBold className="mr-2" />  <span className='text-white'>036 2259 545</span> </h1>
                </div>

            </div>
        </div>
    );
}

export default Header;
