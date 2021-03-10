import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from "@material-ui/core/Paper";
import UpdateFormDialog from './components/updateProfile';
import BankAccountsList from './components/multipleBankAccounts';
import pulse from "../pulse";

export default function Profile() {
    const classes = useStyles();
    const [user, setUser] = useState(false);

    async function getUserData() {
        const user = (pulse.user.userData.length <= 0) ? await pulse.user.getUserData() : pulse.user.userData[0];
        setUser({...user});
    }

    function userDetailsUpdate() {
        alert('userDetailsUpdate')
    }

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <div className={classes.root}>
            <Grid container spacing={5}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        {user &&
                        <Grid container spacing={5}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" className={classes.title}>
                                    {pulse.text.data}
                                </Typography>
                                <div className={classes.demo}>
                                    <List dense>
                                        <ListItem>
                                            <ListItemText
                                                primary={pulse.text.name}
                                                secondary={user.name}
                                            />
                                        </ListItem>

                                        <ListItem>
                                            <ListItemText
                                                primary={pulse.text.surname}
                                                secondary={user.surname}
                                            />
                                        </ListItem>

                                        <ListItem>
                                            <ListItemText
                                                primary={pulse.text.email}
                                                secondary={user.email}
                                            />
                                        </ListItem>

                                        <ListItem>
                                            <ListItemText
                                                primary={pulse.text.phone}
                                                secondary={user.user_phone}
                                            />
                                        </ListItem>

                                        <ListItem>
                                            <ListItemText
                                                primary={pulse.text.street}
                                                secondary={user.user_street}
                                            />
                                        </ListItem>

                                        <ListItem>
                                            <ListItemText
                                                primary={pulse.text.postal_code}
                                                secondary={user.user_postal_code}
                                            />
                                        </ListItem>

                                        <ListItem>
                                            <ListItemText
                                                primary={pulse.text.city}
                                                secondary={user.user_city}
                                            />
                                        </ListItem>

                                    </List>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" className={classes.title}>
                                    {pulse.text.company_data}
                                </Typography>
                                <div className={classes.demo}>
                                    <List dense>
                                        <ListItem>
                                            <ListItemText
                                                primary={pulse.text.company_name}
                                                secondary={user.invoice_company_name}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary={pulse.text.street}
                                                secondary={user.company_street}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary={pulse.text.postal_code}
                                                secondary={user.company_postal_code}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary={pulse.text.city}
                                                secondary={user.company_city}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="NIP"
                                                secondary={user.company_nip}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary={pulse.text.company_type}
                                                secondary={pulse.text.company_type_text[user.company_type]}
                                            />
                                        </ListItem>
                                    </List>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" className={classes.title}>
                                    {pulse.text.finance_data}
                                </Typography>
                                <div className={classes.demo}>
                                    <List dense>
                                        <ListItem>
                                            <ListItemText
                                                primary={pulse.text.hourly_rate}
                                                secondary={user.hourly_rate}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary={pulse.text.overtime_hour_rate}
                                                secondary={user.overtime_hour_rate}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="VAT %"
                                                secondary={user.vat_value}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary={pulse.text.invoice_payment_currency}
                                                secondary={user.invoice_payment_currency}
                                            />
                                        </ListItem>
                                    </List>
                                </div>
                                <Typography variant="h6" className={classes.title}>
                                    {pulse.text.bill_data}
                                </Typography>
                                <div style={{marginBottom: 20}} className={classes.demo}>
                                    <List dense>
                                        <ListItem>
                                            <ListItemText
                                                primary={pulse.text.bank_name}
                                                secondary={user.bank_name}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary={pulse.text.bank_no}
                                                secondary={user.invoice_bank_no}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="IBAN"
                                                secondary={user.bank_iban}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="SWIFT"
                                                secondary={user.bank_swift_bic}
                                            />
                                        </ListItem>
                                    </List>
                                </div>
                                <BankAccountsList bank_accounts={user.bank_accounts}/>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" className={classes.title}>
                                    {pulse.text.devices}
                                </Typography>
                                <div className={classes.demo}>
                                    {user.devices.length > 0 ? (
                                        <Paper>
                                            <List dense={true}>
                                                {user.devices.map(item => (
                                                    <ListItem key={item.id}>
                                                        <ListItemText
                                                            primary={pulse.text.device_title + ' - ' + item.device_name}
                                                            secondary={"ID - " + item.device_id}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Paper>
                                    ) : (
                                        <div style={{marginLeft: 15}}>{pulse.text.no_content}</div>
                                    )}
                                </div>
                            </Grid>
                        </Grid>}
                    </Paper>
                    {/* UPDATE */}
                    {user && <UpdateFormDialog user={user}/>}
                </Grid>
            </Grid>
        </div>
    );
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    demo: {
        // backgroundColor: '#e4e4e4',
    },
    title: {
        margin: theme.spacing(0, 0, 1),
        borderBottom: '1px solid #ccc'
    },
    listitem: {
        borderBottom: '1px solid #e4e4e4'
    },
    paper: {
        padding: theme.spacing(2)
    }
}));