import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Link} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles/index';
import AppBar from '@material-ui/core/AppBar/index';
import Toolbar from '@material-ui/core/Toolbar/index';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid/index';
import logo from '../../LOGO_SEARGIN.svg';
import LangMenu from './langMenu';
import pulse from "../../pulse";

class ButtonAppBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            mobileMoreAnchorEl: null,
            open: (pulse) ? pulse.user.drawerIsOpen : false,
            isLoggedIn: this.props.status,
            is_active: (pulse) ? pulse.user.is_active : false
        };
    }

    handleDrawerOpen = () => {
    };

    handleProfileMenuOpen = event => {
        this.setState({anchorProfileEl: event.currentTarget});
    };

    handleUserMenuOpen = event => {
        this.setState({anchorUserEl: event.currentTarget});
    };

    handleMenuClose = () => {
        this.setState({anchorUserEl: null, anchorProfileEl: null});
    };

    handleLogout = event => {
        // localStorage.clear();
        // localStorage['appState'].clear();
        localStorage.removeItem('appState');
        localStorage.removeItem('_base_isAuthenticated');
        setTimeout(function () {
            window.location.reload()
        }, 0);
    };

    render() {
        const {classes} = this.props;
        const {open} = this.state;
        const {isLoggedIn} = this.state;
        const {is_active} = this.state;

        return (
            <AppBar position="fixed"
                    style={{backgroundColor: '#1e69b8'}}
                    className={classNames(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
            >
                <Toolbar>
                    <Grid container direction="row" alignItems="center" justify="center" spacing={0}>
                        <Grid item xs={1} md={2} xl={1}>
                            <Button component={Link} to="/" style={{padding: 0}}>
                                <img src={logo} alt="Seargin" height={45}/>
                            </Button>
                        </Grid>
                        <Grid item xs={2} md={3} xl={4}>

                        </Grid>
                        <Grid item style={{textAlign: "right"}} xs={9} md={7} xl={7}>
                            {isLoggedIn ? (
                                is_active ? (
                                    <div>
                                        <LangMenu/>
                                        {/*<Button*/}
                                        {/*    variant="outlined"*/}
                                        {/*    size="medium"*/}
                                        {/*    color="inherit"*/}
                                        {/*    style={{marginRight: 20, fontSize: 12}}*/}
                                        {/*    component={Link}*/}
                                        {/*    to={'/dashboard'}>*/}
                                        {/*    {pulse.text.panel}*/}
                                        {/*</Button>*/}
                                        {/*{isLoggedIn && pulse.user.role === 1 && (*/}
                                        {/*<Button*/}
                                        {/*    variant="outlined"*/}
                                        {/*    size="medium"*/}
                                        {/*    color="inherit"*/}
                                        {/*    style={{marginRight: 20, fontSize: 12}}*/}
                                        {/*    component={Link}*/}
                                        {/*    to={'/admin'}>*/}
                                        {/*    Administracja*/}
                                        {/*</Button>*/}
                                        {/*)}*/}
                                        <Button variant="contained"
                                                color="secondary"
                                                size="medium"
                                                onClick={this.handleLogout}>{pulse.text.logout}</Button>
                                    </div>
                                ) : (
                                    <>
                                        <LangMenu/>
                                        <Button variant="outlined" color="inherit"
                                                onClick={this.handleLogout}>{pulse.text.logout}</Button>
                                    </>
                                )
                            ) : (
                                <>
                                    <LangMenu/>
                                </>
                            )
                            }
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        );
    }

}

const drawerWidth = 200;

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
        textDecoration: 'none'
    },
    button: {
        marginRight: 10,
        fontSize: 12
    },
    hide: {
        display: 'none',
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    appBar: {
        zIndex: 2000,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: '100%',
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    iconSmall: {
        fontSize: 20,
    },
});

ButtonAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(ButtonAppBar);