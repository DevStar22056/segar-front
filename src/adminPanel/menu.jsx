import React from 'react';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {NavLink} from 'react-router-dom';
import clsx from 'clsx';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import ListAltIcon from '@material-ui/icons/ListAlt';
import pulse from '../pulse';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import DescriptionIcon from '@material-ui/icons/Description';
import GroupIcon from '@material-ui/icons/Group';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';
import TimelineIcon from '@material-ui/icons/Timeline';
import TimelapseIcon from '@material-ui/icons/Timelapse';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';

const drawerWidth = 170;

function getDrawer() {
    return localStorage.getItem("drawer") === 'true' ? true : false;
}

export default function NestedList(props) {
    const classes = useStyles();
    const theme = useTheme();
    const LinkRef = React.forwardRef((props, ref) => <li ref={ref}><NavLink {...props} /></li>);
    const [open, setOpen] = React.useState(getDrawer());

    const handleDrawerOpen = () => {
        setOpen(true);
        if (getDrawer() === false) {
            localStorage.setItem('drawer', true);
        }
    };

    const handleDrawerClose = () => {
        setOpen(false);
        if (getDrawer()) {
            localStorage.setItem('drawer', false);
        }

    };

    return (
        <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
            })}
            classes={{
                paper: clsx({
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                }),
            }}
            open={open}>

            <div className={classes.toolbar}>
                <IconButton
                    color="inherit"
                    onClick={handleDrawerClose}
                    edge="start"
                    className={clsx(classes.menuButton, {
                        [classes.hide]: !open,
                    })}
                >
                    <ChevronLeftIcon/>
                </IconButton>
                <IconButton
                    color="inherit"
                    onClick={handleDrawerOpen}
                    edge="start"
                    className={clsx(classes.menuButton, {
                        [classes.hide]: open,
                        [classes.menuButton2]: open,
                    })}
                >
                    <ChevronRightIcon/>
                </IconButton>
            </div>

            {pulse.user.role === 1 && (
                <React.Fragment>
                    <List className={classes.adminMenu}>

                        <Tooltip title="Faktury" placement="right">
                            <ListItem component={LinkRef} to="/admin/invoices" className={classes.itemLink} button
                                      activeClassName="Mui-selected">

                                <ListItemIcon className={classes.ico}><DescriptionIcon/></ListItemIcon>
                                <ListItemText primary="Faktury"/>

                            </ListItem>
                        </Tooltip>

                        <Tooltip title="Użytkownicy" placement="right">
                            <ListItem component={LinkRef} to="/admin/users" className={classes.itemLink} button
                                      activeClassName="Mui-selected">
                                <ListItemIcon className={classes.ico}><GroupIcon/></ListItemIcon>
                                <ListItemText primary="Użytkownicy"/>
                            </ListItem>
                        </Tooltip>

                        <Tooltip title="Projekty" placement="right">
                            <ListItem component={LinkRef} to="/admin/projects" className={classes.itemLink} button
                                      activeClassName="Mui-selected">
                                <ListItemIcon className={classes.ico}><ListAltIcon/></ListItemIcon>
                                <ListItemText primary="Projekty"/>
                            </ListItem>
                        </Tooltip>

                        <Tooltip title="FAQ" placement="right">
                            <ListItem component={LinkRef} to="/admin/faq" className={classes.itemLink} button
                                      activeClassName="Mui-selected">
                                <ListItemIcon className={classes.ico}><LiveHelpIcon/></ListItemIcon>
                                <ListItemText primary="FAQ"/>
                            </ListItem>
                        </Tooltip>

                        <Tooltip title="Podsumowanie" placement="right">
                            <ListItem component={LinkRef} to="/admin/summary" className={classes.itemLink} button
                                      activeClassName="Mui-selected">
                                <ListItemIcon className={classes.ico}><TimelineIcon/></ListItemIcon>
                                <ListItemText primary="Podsumowanie"/>
                            </ListItem>
                        </Tooltip>

                        <Tooltip title="Kontrahenci" placement="right">
                            <ListItem component={LinkRef} to="/admin/contractors" className={classes.itemLink} button
                                      activeClassName="Mui-selected">
                                <ListItemIcon className={classes.ico}><PeopleOutlineIcon/></ListItemIcon>
                                <ListItemText primary="Kontrahenci"/>
                            </ListItem>
                        </Tooltip>

                        <Tooltip title="Sprzedawcy" placement="right">
                            <ListItem component={LinkRef} to="/admin/sellers" className={classes.itemLink} button
                                      activeClassName="Mui-selected">
                                <ListItemIcon className={classes.ico}><SupervisedUserCircleIcon/></ListItemIcon>
                                <ListItemText primary="Sprzedawcy"/>
                            </ListItem>
                        </Tooltip>
                    </List>

                </React.Fragment>
            )}

            <Divider/>
            {pulse.user.role !== 1 && (
                <List>
                    <Tooltip title={pulse.text.invoices} placement="right">
                        <ListItem component={LinkRef} to="/dashboard/invoices" className={classes.itemLink} button
                                  activeClassName="Mui-selected">
                            <ListItemIcon className={classes.ico2}><DescriptionIcon/></ListItemIcon>
                            <ListItemText className={classes.link} primary={pulse.text.invoices}/>
                        </ListItem>
                    </Tooltip>

                    <Tooltip title={pulse.text.data} placement="right">
                        <ListItem component={LinkRef} to="/dashboard/profile" className={classes.itemLink} button
                                  activeClassName="Mui-selected">
                            <ListItemIcon className={classes.ico2}><PersonIcon/></ListItemIcon>
                            <ListItemText className={classes.link} primary={pulse.text.data}/>
                        </ListItem>
                    </Tooltip>

                    <Tooltip title="Timesheets" placement="right">
                        <ListItem component={LinkRef} to="/dashboard/timesheets" className={classes.itemLink} button
                                  activeClassName="Mui-selected">
                            <ListItemIcon className={classes.ico2}><TimelapseIcon/></ListItemIcon>
                            <ListItemText className={classes.link} primary="Timesheets"/>
                        </ListItem>
                    </Tooltip>

                    <Tooltip title={pulse.text.faq} placement="right">
                        <ListItem component={LinkRef} to="/dashboard/faq" className={classes.itemLink} button
                                  activeClassName="Mui-selected">
                            <ListItemIcon className={classes.ico2}><LiveHelpIcon/></ListItemIcon>
                            <ListItemText className={classes.link} primary={pulse.text.faq}/>
                        </ListItem>
                    </Tooltip>
                </List>
            )}
        </Drawer>
    );
}

const useStyles = makeStyles(theme => ({
    menuButton: {
        marginLeft: 0,
        marginTop: 20,
        marginBottom: 10,
        padding: 0,
        // textAlign: 'center',
    },
    menuButton2: {
        left: 5
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        zIndex: 1190
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: drawerWidth,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(4) + 4,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        marginTop: 60
    },
    adminMenu: {
        backgroundColor: '#1e69b8',
        color: '#FFFFFF',
        borderBottom: '1px solid #fff'
    },
    ico: {
        color: '#FFFFFF',
        minWidth: 38
    },
    ico2: {
        minWidth: 38
    },
    itemLink: {
        padding: '4px 5px'
    },
}));