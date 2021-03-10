import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import FormDialog from './newBankAccountModal';
import pulse from "../../pulse";

export default function BankAccountsList(props) {
    const classes = useStyles();

    return (
        <List className={classes.root}>
            <Typography variant="h6" className={classes.title}>
                {pulse.text.BANK_ACC}
                <FormDialog resource_id={props.resource_id}/>
            </Typography>
            {props.bank_accounts.map(item => (
                <>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            {item.bank_iban}
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <React.Fragment>
                                    {item.invoice_bank_no}
                                </React.Fragment>
                            }
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        <strong>{pulse.text.bank_name}</strong> <br/>
                                        {item.bank_name}
                                    </Typography>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        <strong>{pulse.text.bank_no}</strong> <br/>
                                        {item.invoice_bank_no}
                                    </Typography>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        <strong>IBAN</strong> <br/>
                                        {item.bank_iban}
                                    </Typography>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        <strong>SWIFT</strong> <br/>
                                        {item.bank_swift_bic}
                                    </Typography>
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                    <Divider variant="inset" component="li"/>
                </>
            ))}
        </List>
    );
}

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'block',
        marginBottom: 10
    },
    title: {
        margin: theme.spacing(0, 0, 1),
        borderBottom: '1px solid #ccc'
    },
    button: {
        marginLeft: theme.spacing(4),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        marginRight: theme.spacing(1),
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
}));
