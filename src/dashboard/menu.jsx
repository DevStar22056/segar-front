import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {NavLink} from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import pulse from '../pulse';

export default function NestedList() {
    const classes = useStyles();
    const [open1, setOpen1] = React.useState(true);
    const [open2, setOpen2] = React.useState(true);

    function handleClick(name) {
        if (name === 'menu1') setOpen1(!open1);
        if (name === 'menu2') setOpen2(!open2);
    }

    const LinkRef = React.forwardRef((props, ref) => <div ref={ref}><NavLink {...props} /></div>);

    return (
        <List
            component="nav"
            className={classes.root}>
            <List component="div" disablePadding>
                <ListItem component={LinkRef} to="/dashboard/invoices" button key={0} className={classes.nested}
                          activeClassName="Mui-selected">
                    <ListItemText className={classes.link} primary={pulse.text.invoices}/>
                </ListItem>
                <ListItem component={LinkRef} to="/dashboard/profile" button key={1} className={classes.nested}
                          activeClassName="Mui-selected">
                    <ListItemText className={classes.link} primary={pulse.text.data}/>
                </ListItem>
                <ListItem component={LinkRef} to="/dashboard/timesheets" button key={2} className={classes.nested}
                          activeClassName="Mui-selected">
                    <ListItemText className={classes.link} primary="Timesheets"/>
                </ListItem>
                <ListItem component={LinkRef} to="/dashboard/faq" button key={3} className={classes.nested}
                          activeClassName="Mui-selected">
                    <ListItemText className={classes.link} primary={pulse.text.faq}/>
                </ListItem>
            </List>
        </List>
    );
}

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    nested: {
        paddingLeft: theme.spacing(2),
    },
    link: {
        // margin: theme.spacing(1),
        textDecoration: 'none',
        color: '#000',
        // display: 'block',
        fontSize: 11
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    iconSmall: {
        fontSize: 18,
    },
}));