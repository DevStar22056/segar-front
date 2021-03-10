import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListAlt from '@material-ui/icons/ListAlt';
import Assignment from '@material-ui/icons/Assignment';
import SupervisedUserCircle from '@material-ui/icons/SupervisedUserCircleOutlined';
import QuestionAnswerOutlined from '@material-ui/icons/QuestionAnswerOutlined';
import {NavLink} from 'react-router-dom';
import Badge from "@material-ui/core/Badge";
import pulse from '../../pulse';

const drawerWidth = 200;

const StyledBadge = withStyles(theme => ({
    badge: {
        top: '50%',
        right: -3,
        border: `2px solid ${theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[900]}`,
    },
}))(Badge);

const BottomBadge = withStyles(theme => ({
    badge: {
        top: '90%',
        right: -3,
        border: `2px solid ${theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[900]}`,
    },
}))(Badge);

const styles = theme => ({
    root: {
        // display: 'flex',
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'center',
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
});

class AdminDrawer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: pulse.user.drawerIsOpen
        }
    }


    render() {
        const {classes} = this.props;
        const {open} = this.state;
        const LinkRef = React.forwardRef((props, ref) => <div ref={ref}><NavLink {...props} /></div>);
        return (
            <Drawer
                className={classes.drawer}
                variant="persistent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
                open={open}
            >
                <div className={classes.drawerHeader}>
                    <Typography variant="h6">
                        Zarządzanie
                    </Typography>
                </div>
                <Divider/>
                <List>
                    {/*<ListItem component={LinkRef} to="/admin/summary" button key={10} activeClassName="Mui-selected">*/}
                    {/*    <ListItemIcon>*/}
                    {/*        <BottomBadge color="primary">*/}
                    {/*            <Badge color="secondary">*/}
                    {/*                <ListAlt/>*/}
                    {/*            </Badge>*/}
                    {/*        </BottomBadge>*/}
                    {/*    </ListItemIcon>*/}
                    {/*    <ListItemText primary="Podsumowanie"/>*/}
                    {/*</ListItem>*/}
                    <ListItem component={LinkRef} to="/admin/invoices" button key={0} activeClassName="Mui-selected">
                        <ListItemIcon>
                            <BottomBadge color="primary">
                                <Badge color="secondary">
                                    <ListAlt/>
                                </Badge>
                            </BottomBadge>
                        </ListItemIcon>
                        <ListItemText primary="Faktury"/>
                    </ListItem>
                    <ListItem component={LinkRef} to="/admin/projects" button key={1} activeClassName="Mui-selected">
                        <ListItemIcon>
                            <StyledBadge color="primary">
                                <Assignment/>
                            </StyledBadge>
                        </ListItemIcon>
                        <ListItemText primary="Projekty"/>
                    </ListItem>
                    <ListItem component={LinkRef} to="/admin/users" button key={2} activeClassName="Mui-selected">
                        <ListItemIcon>
                            <StyledBadge color="primary">
                                <SupervisedUserCircle/>
                            </StyledBadge>
                        </ListItemIcon>
                        <ListItemText primary="Użytkownicy"/>
                    </ListItem>
                    <ListItem component={LinkRef} to="/admin/faq" button key={3} activeClassName="Mui-selected">
                        <ListItemIcon>
                            <StyledBadge color="primary">
                                <QuestionAnswerOutlined/>
                            </StyledBadge>
                        </ListItemIcon>
                        <ListItemText primary="FAQ"/>
                    </ListItem>
                    {/*<ListItem component={LinkRef} to="/admin/settings" button key={4} activeClassName="Mui-selected">*/}
                    {/*    <ListItemIcon><Settings/></ListItemIcon>*/}
                    {/*    <ListItemText primary="Ustawienia"/>*/}
                    {/*</ListItem>*/}
                </List>
            </Drawer>
        );
    }
}

AdminDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, {withTheme: true})(AdminDrawer);