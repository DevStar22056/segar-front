import React, {Fragment, useState} from "react";
import {makeStyles} from '@material-ui/core/styles';
import plLocale from "date-fns/locale/pl";
import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import LinearProgress from '@material-ui/core/LinearProgress';
import {format} from "date-fns/esm";
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

function tree(data) {
    let list = '';
    list += '<ul>';
    if (typeof (data) == 'object') {
        for (var i in data) {
            // document.write('<li>' + i);
            // tree(data[i]);
            list += '<li>';
            list += i;
            list += tree(data[i]);
        }
    } else {
        list += data;
    }
    list += '</li>';
    list += '</ul>';
    return list;
}

export default function CheckBankAcc(props) {
    const classes = useStyles();

    const [selectedDate, handleDateChange] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [invoice_bank_no, setInvoice_bank_no] = useState(props.invoice_bank_no);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(false);
    const [response, setResponse] = useState({
        code: '',
        message: ''
    });

    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    function checkAccount(invoice_bank_no, selectedDate) {



        if (invoice_bank_no) {

            // set ux
            setChecking(true);
            setLoading(true);

            const number = invoice_bank_no.replace(/\s/g, '');
            const url = `https://wl-api.mf.gov.pl/api/search/bank-account/${number}?date=${selectedDate}`;

            fetch(url, {
                method: 'GET'
            })
                .then(
                    function (response) {
                        setTimeout(() => {
                            if (response.status !== 200) {
                                response.json().then(function (data) {
                                    setResponse({
                                        code: data.code,
                                        message: data.message
                                    });
                                    setLoading(false);
                                });

                                return;
                            }

                            response.json().then(function (data) {
                                // const res_text = (data.result.subjects.length > 0) ? tree(data.result.subjects) : "Rachunek nie figuruje na wykazie";
                                setResponse({
                                    code: data.result.requestId,
                                    message: data.result.subjects
                                });
                                setLoading(false);
                            });

                        }, 1000)
                    }
                );

        } else {
            alert('Dodaj numer konta i zapisz dane.')
        }
    }

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={plLocale}>
            <Fragment>
                <KeyboardDatePicker
                    autoOk
                    fullWidth
                    variant="inline"
                    inputVariant="outlined"
                    label="Data"
                    format="yyyy-MM-dd"
                    value={selectedDate}
                    onChange={handleDateChange}
                    InputAdornmentProps={{position: "start"}}
                />

                <Button color="primary" variant="contained"
                        className={classes.progress}
                        onClick={() => checkAccount(invoice_bank_no, selectedDate)}>Sprawdź numer
                    konta</Button>

                {loading && (<LinearProgress/>)}

                {checking && (
                    <div style={{marginTop: 10, marginBottom: 15}}>
                        <strong>Sprawdzane dane: </strong><br/>
                        Numer konta: <strong>{invoice_bank_no}</strong> <br/>
                        Data: <strong>{selectedDate}</strong>
                    </div>
                )}

                {checking && !loading && (
                    <Paper className={classes.resp}>
                        Kod: <strong>{response.code}</strong> <br/>
                        {response.message.map(item => {
                            return (
                                <List
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                    className={classes.root}
                                >
                                    <ListItem button>
                                        <ListItemText secondary="Firma (nazwa) lub imię i nazwisko"
                                                      primary={item.name}/>
                                    </ListItem>

                                    <ListItem button>
                                        <ListItemText secondary="NIP" primary={item.nip}/>
                                    </ListItem>

                                    <ListItem button>
                                        <ListItemText secondary="Status podatnika" primary={item.statusVat}/>
                                    </ListItem>

                                    <ListItem button>
                                        <ListItemText secondary="REGON" primary={item.regon}/>
                                    </ListItem>

                                    {/*<ListItem button>*/}
                                    {/*    <ListItemText secondary="pesel" primary={item.pesel}/>*/}
                                    {/*</ListItem>*/}

                                    <ListItem button>
                                        <ListItemText secondary="KRS" primary={item.krs}/>
                                    </ListItem>

                                    {item.residenceAddress &&
                                    <ListItem button>
                                        <ListItemText secondary="Adres stałego miejsca prowadzenia działalności "
                                                      primary={item.residenceAddress}/>
                                    </ListItem>
                                    }

                                    {item.workingAddress &&
                                    <ListItem button>
                                        <ListItemText secondary="Adres siedziby" primary={item.workingAddress}/>
                                    </ListItem>
                                    }

                                    <ListItem button>
                                        <ListItemText secondary="Data rejestracji jako podatnika VAT"
                                                      primary={item.registrationLegalDate}/>
                                    </ListItem>


                                    <ListItem button onClick={handleClick}>
                                        <ListItemText
                                            primary="Numery rachunków rozliczeniowych lub imiennych rachunków w SKOK"/>
                                        {open ? <ExpandLess/> : <ExpandMore/>}
                                    </ListItem>
                                    {item.accountNumbers.map(accountNumber => (
                                        <Collapse in={open} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                <ListItem button className={classes.nested}>
                                                    <ListItemText primary={accountNumber}/>
                                                </ListItem>
                                            </List>
                                        </Collapse>
                                    ))}

                                </List>
                            )
                        })}
                    </Paper>
                )}


            </Fragment>
        </MuiPickersUtilsProvider>
    );
}

const useStyles = makeStyles(theme => ({
    progress: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    resp: {
        // backgroundColor: '#deddff',
        padding: theme.spacing(2),
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));
