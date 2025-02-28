import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  // Card,
  // CardContent,
  Chip,
  ClickAwayListener,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  // OutlinedInput,
  Paper,
  Popper,
  Stack,
  // Switch,
  Typography
} from '@mui/material';

// third-party
// import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
// import UpgradePlanCard from './UpgradePlanCard';

// assets
import { IconLogout, IconSettings } from '@tabler/icons';
// ==============================|| PROFILE MENU ||============================== //
const ProfileSection = () => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);

  const [open, setOpen] = useState(false);

  const anchorRef = useRef(null);
  const handleLogout = async () => {
    try {
      document.cookie = 'shopKeeperAuthToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      window.location.href = '/login';
    } catch (error) {
      // Handle any errors, such as network issues or server errors
      console.error('Logout error:', error);
    }
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            '& svg': {
              stroke: theme.palette.primary.light
            }
          },
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Box sx={{ p: 2 }}>
                    <Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="h4">Good Morning,</Typography>
                        <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                          Johne Doe
                        </Typography>
                      </Stack>
                      <Typography variant="subtitle2">Employee Panel</Typography>
                    </Stack>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <List
                      component="nav"
                      sx={{
                        marginTop: '-20px',
                        width: '100%',
                        maxWidth: 350,
                        minWidth: 300,
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: '10px',
                        [theme.breakpoints.down('md')]: {
                          minWidth: '100%'
                        }
                      }}
                    >
                      <ListItemButton
                        sx={{ borderRadius: `${customization.borderRadius}px` }}
                        // selected={selectedIndex === 4}s
                        onClick={handleLogout}
                      >
                        <ListItemIcon>
                          <IconLogout stroke={1.5} size="1.3rem" />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                      </ListItemButton>
                    </List>
                  </Box>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
