import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import Button from "@material-ui/core/Button/index";
import Typography from '@material-ui/core/Typography/index';
import {makeStyles} from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import DropzoneAreaExample from './components/Dropzone';
import RejectInvoice from './components/RejectInvoice';
import SimpleSelect from './components/projectsList';
import Step02 from './steps/step02';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from "@material-ui/core/CircularProgress";
import Menu from '@material-ui/core/Menu';
import SaveIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem'
import pulse from '../pulse';
import {Paper} from "@material-ui/core";
import AllUsersSelect from "./components/allUsers";
import RowDetailsCorrections from "../adminPanel/Submissions/RowDetailsCorrections";
import Link from "@material-ui/core/Link";
import {API_URL} from "../config";
import MailModalDialog from "../adminPanel/Submissions/mail";

import ConfirmationDialog from './components/confirmationDialog';

const AddInvoice = (props) => {
    const classes = useStyles();

    const [disabled, setDisabled] = useState(false);
    const [invoice, setInvoice] = useState(false);
    const [filesLength, setFilesLength] = useState(0);
    const [is_correction, setIsCorrection] = useState(false);
    const [loading, setLoading] = useState(true);
    const [invoiceNumberSave, setInvoiceNumberSave] = useState(false);
    const [internalNumberSave, setInternalNumberSave] = useState(false);
    const [invoiceTypeData, setInvoiceType] = useState({type: '', id: ''});
    const [correction_text, setCorrectionText] = useState([]);
    const [expanded, setExpanded] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [originalFiles, setOriginalFiles] = useState([]);
    const [originalID, setOriginalInvoiceID] = useState([]);
    const statuses = ['szkic', 'oczekuje na akceptacje', 'odrzucona', 'zaakceptowana', 'zapłacona', 'wysłana'];

    // correction
    const [correction_description, setCorrectionDescription] = useState('');

    // invoice numbers
    const [invoice_number, setInvoiceNumber] = useState('');
    const [internal_invoice_number, setInternalInvoiceNumber] = useState('');

    // from:to
    const [vendor, setVendor] = useState();
    const [purchaser, setPurchaser] = useState();


    const [vendor_name, setVendorName] = useState();
    const [vendor_nip, setVendorNip] = useState();
    const [vendor_address, setVendorAddress] = useState();

    const [purchaser_name, setPurchaserName] = useState();
    const [purchaser_nip, setPurchaserNip] = useState();
    const [purchaser_address, setPurchaserAddress] = useState();

    // invoice status
    const [status, setStatus] = useState(true);

    let step2ref = React.createRef();

    // get invoice obj
    async function getInvoice(match) {
        const invoice = await pulse.invoices.getInvoice({id: match});

        // set obj
        setInvoice(invoice);

        // set desc
        setCorrectionDescription(invoice.data.correction_description);

        // set numbers

        setInvoiceNumber(invoice.data.invoice_number);
    
        setInternalInvoiceNumber(invoice.data.internal_invoice_number);

        if (invoice.data.is_correction) {
            setIsCorrection(true);
            setOriginalInvoiceID(invoice.data.original.id)
            setOriginalFiles(invoice.data.original.files)
        }

        // from:to
        setVendor(invoice.data.vendor);
        setPurchaser(invoice.data.purchaser);

        setVendorName(invoice.data.vendor_name);
        setVendorNip(invoice.data.vendor_nip);
        setVendorAddress(invoice.data.vendor_address);

        setPurchaserName(invoice.data.purchaser_name);
        setPurchaserNip(invoice.data.purchaser_nip);
        setPurchaserAddress(invoice.data.purchaser_address);

        // show data
        setTimeout(() => {
            if (invoice.data.status !== 0 || invoice.data.status !== 2) {
                if (pulse.user.role !== 1) {
                    // setDisabled(true);
                }
                // setStatus(false);
            }
            setLoading(false);
        }, 800);


        // ACCEPTED
        if (invoice.data.status === 3) {
            setStatus(false);
            setDisabled(true);
        }

        // PAID
        if (invoice.data.status === 4) {
            setStatus(false);
            setDisabled(true);
        }

        // w8 for approval
        if (invoice.data.status === 1) {
            setStatus(false);
            setDisabled(true);
        }

        //setLoading(false);
    }

    // correctionText
    function correctionText(val) {
        setCorrectionDescription(val);
    }

    function invoiceType(val) {
        setInvoiceType(val);
    }

    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    function handleChangeInvoiceStatus(id) {
        setInvoice({
            data: {
                ...invoice.data,
                status: id
            }
        });
        setAnchorEl(null);

        pulse.invoices.updateInvoice({
            id: parseInt(props.match.params.id),
            // user_id: pulse.user.userData[0].id,
            status: id
        });

        setTimeout(() => {
            window.location.reload()
        }, 400)

    }

    // update number
    function handleChangeInvoiceNumber(el) {
        setInvoiceNumber(el.target.value)
    }

    // update internal number
    function handleChangeInvoiceInternalNumber(el) {
        setInternalInvoiceNumber(el.target.value)
    }

    /**
     * udpate numbers
     * */
    function saveInvoiceNumbers(name) {
        if (name === 'invoice_number') {
            setInvoiceNumberSave(true)
        } else {
            setInternalNumberSave(true)
        }

        const number = (name === 'invoice_number') ? invoice_number : internal_invoice_number;
        
        pulse.invoices.updateInvoice({
            id: parseInt(props.match.params.id),
            user_id: pulse.user.id,
            [name]: number
        }).then(res => {
            if (res.status !== undefined) {
                // alert(res.status)
            }

            // hide circle
            setTimeout(() => {
                setInvoiceNumberSave(false);
                setInternalNumberSave(false);
            }, 1000);
        });
    }

    /**
     * correction
     * */
    function createCorrection(id) {
        pulse.invoices.createCorrection({
            creator: pulse.user.id,
            user_id: pulse.user.id,
            correction_id: parseInt(id)
        });
    }

    // set files length
    function filesLengthConn(val) {
        setFilesLength(parseInt(val))
    }

    // invoice from:to
    function handleSelectVendor(val) {
        if (val) setVendor(val.id)
    }

    function handleSelectPurchaser(val) {
        if (val) setPurchaser(val.id);
    }

    function handleRemove(id) {
        const remove = window.confirm('Na pewno chcesz usunąć fakturę?');
        if(remove === true) {
            pulse.invoices.deleteInvoice({id: id})
        }
    }

    useEffect(() => {
        if (!invoice) getInvoice(props.match.params.id)
    }, [props.match.params.id, disabled]);

    return (

        <div className={is_correction ? (classes.root_correction) : (classes.root)}>

            <Grid container spacing={5}>
                <Grid item xs={12}>

                    {/* rejected */}
                    {invoice && <>
                        {invoice.data.status === 2 && (
                            <Button variant="contained" fullWidth color="secondary">
                                {invoice.data.rejection_type} <br/>
                                {invoice.data.rejection_description}
                            </Button>
                        )
                        }
                    </>}
                    {/* rejected */}

                    <ExpansionPanel expanded
                                    className={clsx(classes.ExpansionPanel, {
                                        [classes.ExpansionPanel1]: status,
                                        [classes.ExpansionPanel2]: !status,
                                    })}
                    >
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel3a-content"
                            id="panel3a-header"
                        >
                            <Typography className={classes.heading}>
                                {invoice && <Chip
                                    label={statuses[invoice.data.status]}
                                    className={classes.chip}/>}
                                {pulse.text.invoice.number}
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            {/* INVOICE NUMBERS */}
                            <Grid container alignContent="center" alignItems="flex-start" spacing={0}>
                                {invoice && (
                                    <React.Fragment>
                                        {pulse.user.role === 1 ? (
                                            <React.Fragment>
                                                {pulse.user.id !== invoice.data.creator && (
                                                    <Grid item xs={12} md={6}>
                                                        {invoice && <TextField
                                                            disabled={disabled}
                                                            label={pulse.text.invoice.contractor_number}
                                                            defaultValue={invoice_number}
                                                            key={invoice_number}
                                                            name="invoice_number"
                                                            onBlur={(el) => (handleChangeInvoiceNumber(el))}
                                                            variant="outlined"
                                                            margin="dense"
                                                            // fullWidth
                                                            style={{minWidth: 350}}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />}
                                                        {/*<Button disabled={disabled} style={{margin: 10}}
                                                                onClick={() => {
                                                                    saveInvoiceNumbers('invoice_number')
                                                                }} variant="contained"
                                                                color="primary">{pulse.text.save}</Button>
                                                        {invoiceNumberSave &&
                                                        <CircularProgress size={21} style={{marginLeft: 15}}/>}*/}
                                                    </Grid>
                                                )
                                                }
                                            </React.Fragment>
                                        ) : (
                                            <Grid item xs={12} md={6}>
                                                {/*<Typography variant="h6" gutterBottom>*/}
                                                {/*    {pulse.text.invoice.contractor_number}*/}
                                                {/*</Typography>*/}
                                                {invoice && <TextField
                                                    disabled={disabled}
                                                    label={pulse.text.invoice.contractor_number}
                                                    defaultValue={invoice_number}
                                                    key={invoice_number}
                                                    name="invoice_number"
                                                    onBlur={(el) => (handleChangeInvoiceNumber(el))}
                                                    variant="outlined"
                                                    margin="dense"
                                                    // fullWidth
                                                    style={{minWidth: 350}}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />}
                                                {/*<Button disabled={disabled} style={{margin: 10}} onClick={() => {
                                                    saveInvoiceNumbers('invoice_number')
                                                }} variant="contained" color="primary">{pulse.text.save}</Button>
                                                {invoiceNumberSave &&
                                                <CircularProgress size={21} style={{marginLeft: 15}}/>}*/}
                                            </Grid>
                                        )}
                                    </React.Fragment>
                                )}
                                {/* field */}

                                {/* field */}
                                {pulse.user.role === 1 && (
                                    <Grid item xs={12} md={6} style={{marginBottom: 0}}>
                                        {/*<Typography variant="h6" gutterBottom>*/} 
                                        {/*    {pulse.text.invoice.internal_number_text}*/}
                                        {/*</Typography>*/}
                                        {invoice && <TextField
                                            disabled={disabled}
                                            label={pulse.text.invoice.internal_number_text}
                                            defaultValue={internal_invoice_number}
                                            name="internal_invoice_number"
                                            key={internal_invoice_number}
                                            onBlur={(el) => (handleChangeInvoiceInternalNumber(el))}
                                            variant="outlined"
                                            margin="dense" 
                                            // fullWidth
                                            style={{minWidth: 350}}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />}
                                        {/*<Button disabled={disabled} style={{margin: 10}} onClick={() => {
                                            saveInvoiceNumbers('internal_invoice_number')
                                        }} variant="contained" color="primary">{pulse.text.save}</Button>
                                        {internalNumberSave && <CircularProgress size={21} style={{marginLeft: 15}}/>}*/}
                                    </Grid>
                                )}
                            </Grid>
                            {/* INVOICE NUMBERS */}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <Grid container alignContent="center" alignItems="stretch" spacing={1}>
                        {!is_correction && pulse.user.role === 1 && (
                            <Grid item xs={4}>
                                <ExpansionPanel expanded
                                                className={clsx(classes.ExpansionPanel, {
                                                    [classes.ExpansionPanel1]: status,
                                                    [classes.ExpansionPanel2]: !status,
                                                })}>
                                    <ExpansionPanelSummary
                                        expandIcon={<ExpandMoreIcon/>}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header">
                                        <Typography
                                            className={classes.heading}>{pulse.text.invoice.invoice_type}</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <Grid container alignContent="center" alignItems="flex-start" spacing={5}>
                                            <Grid item xs={12}>
                                                {loading === true ? (
                                                    <div style={{textAlign: "center"}}><CircularProgress size={24}/>
                                                    </div>
                                                ) : (
                                                    <React.Fragment>
                                                        {invoice && <SimpleSelect
                                                            role={pulse.user.role}
                                                            invoice={invoice}
                                                            correction_description={invoice}
                                                            correctionText={(val) => {
                                                                correctionText(val);
                                                            }}
                                                            invoiceType={(val) => {
                                                                invoiceType(val);
                                                            }}/>}
                                                    </React.Fragment>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            </Grid>
                        )}
                        {pulse.user.role === 1 && !is_correction && (

                            <Grid item xs={4}>
                                <ExpansionPanel expanded
                                                className={clsx(classes.ExpansionPanel, {
                                                    [classes.ExpansionPanel1]: status,
                                                    [classes.ExpansionPanel2]: !status,
                                                })}>
                                    <ExpansionPanelSummary
                                        expandIcon={<ExpandMoreIcon/>}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header">
                                        <Typography
                                            className={classes.heading}>Sprzedawca</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <Grid container alignContent="center" alignItems="flex-start" spacing={2}>
                                            {loading === true ? (
                                                <Grid item xs={12}>
                                                    <div style={{textAlign: "center"}}><CircularProgress size={24}/>
                                                    </div>
                                                </Grid>
                                            ) : (
                                                <React.Fragment>
                                                    
                                                        <Typography variant="h6" className={classes.h6Title}
                                                                    gutterBottom>
                                                        </Typography>
                                                        {invoice ? (
                                                            <TextField
                                                                disabled={disabled}
                                                                label="Nazwa sprzedawcy"
                                                                defaultValue={vendor_name}

                                                                name="vendor_name"
                                                                onChange={(el) => (setVendorName(el.target.value))}
                                                                variant="outlined"
                                                                margin="dense"
                                                                // fullWidth
                                                                style={{minWidth: 350}}
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                            />
                                                        ) : (
                                                            <CircularProgress/>
                                                        )}
                                                        {invoice ? (
                                                            <TextField
                                                                disabled={disabled}
                                                                label="NIP sprzedawcy"
                                                                defaultValue={vendor_nip}
                                                                name="vendor_nip"
                                                                onChange={(el) => (setVendorNip(el.target.value))}
                                                                variant="outlined"
                                                                margin="dense"
                                                                // fullWidth
                                                                style={{minWidth: 350}}
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                            />
                                                        ) : (
                                                            <CircularProgress/>
                                                        )}
                                                        {invoice ? (
                                                            <TextField
                                                                disabled={disabled}
                                                                label="Adres sprzedawcy"
                                                                defaultValue={vendor_address}
                                                                name="vendor_address"
                                                                onChange={(el) => (setVendorAddress(el.target.value))}
                                                                variant="outlined"
                                                                margin="dense"
                                                                // fullWidth
                                                                style={{minWidth: 350}}
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                            />
                                                        ) : (
                                                            <CircularProgress/>
                                                        )}
                                                    
                                                </React.Fragment>
                                            )}
                                        </Grid>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            </Grid>
                        )}
                    {pulse.user.role === 1 && !is_correction && (

                            <Grid item xs={4}>
                                <ExpansionPanel expanded
                                                className={clsx(classes.ExpansionPanel, {
                                                    [classes.ExpansionPanel1]: status,
                                                    [classes.ExpansionPanel2]: !status,
                                                })}>
                                    <ExpansionPanelSummary
                                        expandIcon={<ExpandMoreIcon/>}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header">
                                        <Typography
                                            className={classes.heading}>Nabywca</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <Grid container alignContent="center" alignItems="flex-start" spacing={2}>
                                            {loading === true ? (
                                                <Grid item xs={12}>
                                                    <div style={{textAlign: "center"}}><CircularProgress size={24}/>
                                                    </div>
                                                </Grid>
                                            ) : (
                                                <React.Fragment>
                                                    
                                                        <Typography variant="h6" className={classes.h6Title}
                                                                    gutterBottom>
                                                        </Typography>
                                                        {invoice ? (
                                                            <TextField
                                                                disabled={disabled}
                                                                label="Nazwa sprzedawcy"
                                                                defaultValue={purchaser_name}
                                                                name="purchaser_name"
                                                                onChange={(el) => (setPurchaserName(el.target.value))}
                                                                variant="outlined"
                                                                margin="dense"
                                                                // fullWidth
                                                                style={{minWidth: 350}}
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                            />
                                                        ) : (
                                                            <CircularProgress/>
                                                        )}
                                                        {invoice ? (
                                                            <TextField
                                                                disabled={disabled}
                                                                label="NIP sprzedawcy"
                                                                defaultValue={purchaser_nip}
                                                                name="purchaser_nip"
                                                                onBlur={(el) => (setPurchaserNip(el.target.value))}
                                                                variant="outlined"
                                                                margin="dense"
                                                                // fullWidth
                                                                style={{minWidth: 350}}
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                            />
                                                        ) : (
                                                            <CircularProgress/>
                                                        )}
                                                        {invoice ? (
                                                            <TextField
                                                                disabled={disabled}
                                                                label="Adres sprzedawcy"
                                                                defaultValue={purchaser_address}
                                                                name="purchaser_address"
                                                                onChange={(el) => (setPurchaserAddress(el.target.value))}
                                                                variant="outlined"
                                                                margin="dense"
                                                                // fullWidth
                                                                style={{minWidth: 350}}
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                            />
                                                        ) : (
                                                            <CircularProgress/>
                                                        )}
                                                  
                                                    
                                                </React.Fragment>
                                            )}
                                        </Grid>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            </Grid>
                        )}
                    </Grid>

                    <ExpansionPanel expanded
                                    className={clsx(classes.ExpansionPanel, {
                                        [classes.ExpansionPanel1]: status,
                                        [classes.ExpansionPanel2]: !status,
                                    })}
                    >
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                        >
                            <Typography className={classes.heading}>{pulse.text.invoice.details}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            {loading === true ? (
                                <div style={{textAlign: "center"}}><CircularProgress size={24}/></div>
                            ) : (
                                <Step02 invoice={invoice}
                                        invoiceNumber={invoice_number} 
                                        match={props.match}
                                        invoiceType={invoiceTypeData}
                                        invoice_number={invoice_number}
                                        internal_invoice_number={internal_invoice_number}
                                        correction_description={correction_description}
                                        filesLength={filesLength}
                                        purchaser={purchaser}
                                        vendor={vendor}
                                        purchaser_name={purchaser_name} 
                                        purchaser_nip={purchaser_nip} 
                                        purchaser_address={purchaser_address}
                                        vendor_nip={vendor_nip}
                                        vendor_name={vendor_name}  
                                        vendor_address={vendor_address} 
                                        disabled={disabled}
                                        ref={step2ref}
                                />
                            )}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <ExpansionPanel expanded
                                    className={clsx(classes.ExpansionPanel, {
                                        [classes.ExpansionPanel1]: status,
                                        [classes.ExpansionPanel2]: !status,
                                    })}
                    >
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={classes.heading}>{pulse.text.files}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container alignContent="center" alignItems="flex-start" spacing={5}>
                                {loading === true ? (
                                    <Grid item xs={12}>
                                        <div style={{textAlign: "center"}}><CircularProgress size={24}/></div>
                                    </Grid>
                                ) : (
                                    <React.Fragment>
                                        <Grid item xs={6}>
                                            <Typography variant="h5" gutterBottom>
                                                Timesheet
                                            </Typography>
                                            {invoice ? (
                                                <DropzoneAreaExample
                                                    disabled={disabled}
                                                    originalFiles={originalFiles}
                                                    originalID={originalID}
                                                    files={invoice.data.files}
                                                    source_id={props.match.params.id}
                                                    source={1}
                                                    type={0}
                                                    filesLength={(val) => {
                                                        filesLengthConn(val);
                                                    }}/>
                                            ) : (
                                                <div style={{textAlign: "center"}}><CircularProgress size={24}/></div>
                                            )}
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="h5" gutterBottom>
                                                {pulse.text.confirmations}
                                            </Typography>
                                            {invoice ? (
                                                <DropzoneAreaExample
                                                    disabled={disabled}
                                                    originalFiles={originalFiles}
                                                    originalID={originalID}
                                                    files={invoice.data.files}
                                                    source_id={props.match.params.id}
                                                    source={1}
                                                    type={1}/>
                                            ) : (
                                                <div style={{textAlign: "center"}}><CircularProgress size={24}/></div>
                                            )}
                                        </Grid>
                                    </React.Fragment>
                                )}
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    {invoice && (
                        <React.Fragment>
                            {invoice.data.corrections.length > 0 &&
                            (

                                <ExpansionPanel expanded
                                                className={clsx(classes.ExpansionPanel, {
                                                    [classes.ExpansionPanel1]: status,
                                                    [classes.ExpansionPanel2]: !status,
                                                })}
                                >
                                    <ExpansionPanelSummary
                                        expandIcon={<ExpandMoreIcon/>}
                                        aria-controls="panel3a-content"
                                        id="panel3a-header"
                                    >
                                        <Typography className={classes.heading}>{pulse.text.corrections}</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <Paper style={{width: '100%'}}>
                                            <RowDetailsCorrections items={invoice.data.corrections}/>
                                        </Paper>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            )
                            }
                        </React.Fragment>
                    )}

                    {invoice && pulse.user.role === 1 && (
                        <ExpansionPanel expanded
                                        className={clsx(classes.ExpansionPanel, {
                                            [classes.ExpansionPanel1]: status,
                                            [classes.ExpansionPanel2]: !status,
                                        })}>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel3a-content"
                                id="panel3a-header"
                            >
                                <Typography className={classes.heading}>{pulse.text.invoice.send_mail}</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <MailModalDialog invoice={invoice}/>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    )}

                    <ExpansionPanel expanded
                                    className={clsx(classes.ExpansionPanel, {
                                        [classes.ExpansionPanel1]: status,
                                        [classes.ExpansionPanel2]: !status,
                                    })}
                    >
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel3a-content"
                            id="panel3a-header"
                        >
                            <Typography className={classes.heading}>{pulse.text.invoice.invoice_management}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            {/* STATUS */}
                            <Grid container
                                  alignItems="center"
                                  spacing={5}>

                                {pulse.user.role === 1 && (<Grid item xs={12}>
                                        <Paper className={classes.grayPaper}>
                                            <Grid container justify="space-between" spacing={5}>
                                                <Grid item xs={12}>
                                                    Tylko dla superuser: <br/><br/>
                                                </Grid>
                                                {invoice &&
                                                <React.Fragment>
                                                    <Grid item >
                                                        <Button aria-controls="simple-menu" aria-haspopup="true"
                                                                size="large" variant="contained" color="primary"
                                                                onClick={handleClick}>
                                                            <SaveIcon
                                                                className={clsx(classes.leftIcon, classes.iconSmall)}/>
                                                            Zmień status faktury
                                                        </Button>
                                                        <br/>
                                                        <br/>
                                                        <Typography
                                                            variant="h5">{statuses[invoice.data.status]}</Typography>
                                                        <Menu
                                                            id="simple-menu"
                                                            anchorEl={anchorEl}
                                                            keepMounted
                                                            open={Boolean(anchorEl)}
                                                            onClose={handleClose}>

                                                            {pulse.user.id !== invoice.data.creator && (
                                                                <React.Fragment>
                                                                    <MenuItem
                                                                        onClick={() => handleChangeInvoiceStatus(0)}>{statuses[0]}</MenuItem>
                                                                    <MenuItem
                                                                        onClick={() => handleChangeInvoiceStatus(1)}>{statuses[1]}</MenuItem>
                                                                   
                                                                    <MenuItem
                                                                        onClick={() => handleChangeInvoiceStatus(3)}>{statuses[3]}</MenuItem>
                                                                </React.Fragment>
                                                            )}

                                                            <MenuItem
                                                                onClick={() => handleChangeInvoiceStatus(5)}>{statuses[5]}</MenuItem>
                                                            <MenuItem
                                                                onClick={() => handleChangeInvoiceStatus(4)}>{statuses[4]}</MenuItem>
                                                        </Menu>
                                                    </Grid>

                                                    {pulse.user.id !== invoice.data.creator && (
                                                        <Grid item  >
                                                            {invoice && <RejectInvoice invoice={invoice}/>}
                                                        </Grid>
                                                    )}

                                                    {pulse.user.role === 1 && (
                                                        <Grid item >
                                                            <Button size="large" variant="contained" color="secondary"
                                                                    onClick={() => handleRemove(invoice.data.id)}>
                                                                Usuń fakturę
                                                            </Button>
                                                        </Grid>
                                                    )}

                                                </React.Fragment>
                                                }
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                )}

                                {invoice && (
                                    <Grid item xs={12}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                {pulse.user.role !== 1 && (
                                                    <ConfirmationDialog disabled={disabled} id={props.match.params.id}/>
                                                )}
                                            </Grid>
                                            <Grid item xs={3}>
                                                {pulse.lang == 'pl_PL' ? (
                                                    <Link target="_blank"
                                                          href={`${API_URL}/invoice/` + props.match.params.id + '/html'}>
                                                        <Button fullWidth size="large" variant="outlined"
                                                                color="primary">
                                                            {pulse.text.preview} HTML
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <Link target="_blank"
                                                          href={`${API_URL}/invoice/` + props.match.params.id + '/html/en_GB'}>
                                                        <Button fullWidth size="large" variant="outlined"
                                                                color="primary">
                                                            {pulse.text.preview} HTML
                                                        </Button>
                                                    </Link>
                                                )}

                                            </Grid>
                                            <Grid item xs={3}>
                                                {pulse.lang == 'pl_PL' ? (
                                                    <Link target="_blank"
                                                          href={`${API_URL}/invoice/` + props.match.params.id + '/pdf'}>
                                                        <Button fullWidth size="large" variant="outlined"
                                                                color="primary">
                                                            {pulse.text.preview} PDF
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <Link target="_blank"
                                                          href={`${API_URL}/invoice/` + props.match.params.id + '/pdf/en_GB'}>
                                                        <Button fullWidth size="large" variant="outlined"
                                                                color="primary">
                                                            {pulse.text.preview} PDF
                                                        </Button>
                                                    </Link>
                                                )}

                                            </Grid>
                                            {invoice &&
                                            <Grid item xs={6}>
                                                {!is_correction && pulse.user.id === invoice.data.creator && invoice.data.status === 3 && (
                                                    <Button size="large" variant="contained" color="secondary"
                                                            onClick={() => createCorrection(props.match.params.id)}>
                                                        {pulse.text.invoice.create_correction}
                                                    </Button>
                                                )}
                                            </Grid>
                                            }
                                            {/*{invoice &&*/}
                                            {/*<Grid item xs={6}>*/}
                                            {/*    <DownloadInvoice id={props.match.params.id}/>*/}
                                            {/*</Grid>*/}
                                            {/*}*/}
                                        </Grid>
                                    </Grid>
                                )}

                            </Grid>
                            {/* STATUS */}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </Grid>


            </Grid>
        </div>
    )
};

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        padding: '15px 25px'
    },
    root_correction: {
        border: '6px dashed #1e69b8',
        flexGrow: 1,
        padding: '15px 25px',
        margin: theme.spacing(3),
    },
    paper: {
        padding: theme.spacing(1),
        // textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    grayPaper: {
        padding: theme.spacing(2),
        // textAlign: 'center',
        backgroundColor: '#f0f0f0',
        color: theme.palette.text.secondary,
    },
    button: {
        marginTop: theme.spacing(),
        marginBottom: theme.spacing(),
        marginRight: theme.spacing(),
    },
    actionsContainer: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(2),
        // backgroundColor: '#d0d0d0',
        padding: 5,
        borderRadius: 0
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
    leftIcon: {
        marginRight: theme.spacing(2),
    },
    rightIcon: {
        marginLeft: theme.spacing(),
    },
    iconSmall: {
        fontSize: 20,
    },
    confirmBtn: {
        color: 'white',
        backgroundColor: 'green',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    chip: {
        marginRight: 20
    },
    ExpansionPanel: {},
    ExpansionPanel1: {},
    ExpansionPanel2: {
        backgroundColor: '#e1e1e1'
    },
    h6Title: {
        fontSize: 14
    },
    rejected: {
        backgroundColor: '#f50057',
        color: '#FFF',
        padding: 10
    }
}));

export default AddInvoice;