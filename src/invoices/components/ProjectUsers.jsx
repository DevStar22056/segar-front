import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import TextField from "@material-ui/core/TextField";
import CircularProgress from '@material-ui/core/CircularProgress';
import pulse from "../../pulse";
import IntegrationReactSelect from "../../adminPanel/Projects/usersList";

export default function ProjectUsers(props) {
    const classes = useStyles();

    const [selectedContracors, setContractors] = useState([]);
    const [expanded, setExpanded] = useState(false);

    // contractors from project
    const [project_contractors, setProjectContractors] = React.useState([]);

    // selected contractors from invoice
    const [invoice_contractors, setInvoiceContractors] = React.useState([]);

    // rates
    const [rates, setRates] = useState([]);

    function handleSaveRates() {
        rates.map(item => pulse.rates.createRate(item));
    }

    const setContractorRate = (e, index) => {
        rates[index].hours_value = e.target.value;
        // netto
        const netto = parseFloat(e.target.value) * parseFloat(rates[index].internal_hour_rate);
        rates[index].netto = netto.toFixed(2);
        // vat
        const vat = parseFloat(rates[index].netto) * 0.23;
        rates[index].vat = vat.toFixed(2);
        // gross
        rates[index].gross = (netto + vat).toFixed(2);
        // set c
        setRates([...rates]);
    };

    function handleSelectUsers(e) {
        const _e = (e !== null) ? e : [];
        if (_e) {
            setRates(_e);
            setContractors(_e);
        }
    }

    async function getProject(id, invoice_id) {
        await pulse.projects.getProject({
            id: id
        }).then(
            res => {
                setProjectContractors(res.map(item => ({...item, invoice_id: invoice_id})));
            }
        );
    }

    async function getInvoiceContractors(id) {
        await pulse.rates.getRate({
            id: id
        }).then(
            res => {
                setTimeout(() => {
                    const _res = res.data.map(item => ({...item, invoice_id: id}));
                    setInvoiceContractors(_res);
                    setContractors(_res);
                    setRates(_res);
                    setExpanded(true);
                }, 100);
            }
        );
    }

    useEffect(() => {
        getProject(props.invoice_type_id, props.invoice_id);
        getInvoiceContractors(props.invoice_id);
    }, [props.invoice_id]);

    return (
        <div style={{padding: 20}} className={classes.root}>
            <ExpansionPanel className={classes.expansionPanel} defaultExpanded>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1c-content"
                    id="panel1c-header"
                >
                    <div className={classes.column}>
                        <Typography className={classes.heading}>Kontraktorzy</Typography>
                    </div>
                    <div className={classes.column}>
                        <Typography className={classes.secondaryHeading}>Wybierz kontraktorów </Typography>
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.details}>
                    {expanded ? (
                        <IntegrationReactSelect
                            selected={(val) => {
                                handleSelectUsers(val)
                            }}
                            contractors={project_contractors}
                            invoice_contractors={invoice_contractors}/>
                    ) : (
                        <CircularProgress/>
                    )}
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel className={classes.expansionPanel} expanded={expanded} defaultExpanded={expanded}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1c-content"
                    id="panel1c-header">
                    <div className={classes.column}>
                        <Typography className={classes.heading}>Stawki</Typography>
                    </div>
                    <div className={classes.column}>
                        <Typography className={classes.secondaryHeading}>Godziny kontraktorów na fakturze.</Typography>
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.details}>
                    <Grid item xs={12}>
                        {/* LIST */}
                        {selectedContracors.length > 0 && selectedContracors.map((item, index) => {
                            if (rates[index] !== undefined) {
                                return (
                                    <Grid key={index} container spacing={5} alignItems="center">
                                        <Grid item xs={12} style={{marginBottom: -30}}>
                                            <Typography variant="h6" gutterBottom style={{float: 'left'}}>
                                                Liczba godzin - {item.name} {item.surname}
                                                <Chip style={{marginLeft: 20}}
                                                      label={`Stawka wewnętrzna - ${item.internal_hour_rate}`}/>
                                            </Typography>
                                        </Grid>
                                        <Grid item md={3} lg={2}>
                                            <TextField
                                                disabled={props.disabled}
                                                label="Liczba godzin"
                                                required={true}
                                                name="hours_value"
                                                type="number"
                                                variant="outlined"
                                                margin="dense"
                                                // helperText={pulse.user.hourly_rate}
                                                fullWidth={true}
                                                value={rates[index].hours_value}
                                                onChange={(e) => {
                                                    setContractorRate(e, index)
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={3} lg={2}>
                                            <TextField
                                                id="hours_value_netto"
                                                name="hours_value_netto"
                                                type="number"
                                                disabled
                                                label="Netto"
                                                value={rates[index].netto}
                                                className=""
                                                variant="outlined"
                                                margin="dense"
                                                fullWidth={true}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={3} lg={2}>
                                            <TextField
                                                id="hours_value_gross"
                                                name="hours_value_gross"
                                                type="number"
                                                disabled
                                                label="Brutto"
                                                value={rates[index].gross}
                                                className={classes.grossValue}
                                                variant="outlined"
                                                margin="dense"
                                                fullWidth={true}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={3} lg={2}>
                                            <TextField
                                                id="hours_value_vat"
                                                name="hours_value_vat"
                                                type="number"
                                                disabled
                                                label="Vat"
                                                value={rates[index].vat}
                                                className=""
                                                variant="outlined"
                                                margin="dense"
                                                fullWidth={true}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                )
                            }
                        })}
                        {/* LIST */}
                    </Grid>
                </ExpansionPanelDetails>
                <Divider/>
                <ExpansionPanelActions>
                    {/*<Button size="small">Cancel</Button>*/}
                    <Button onClick={handleSaveRates} size="small" variant="outlined" color="primary">
                        Zapisz
                    </Button>
                </ExpansionPanelActions>
            </ExpansionPanel>
        </div>
    );
}

const useStyles = makeStyles(theme => ({
    paper: {
        width: 300,
        height: 140,
        overflow: 'auto',
    },
    button: {
        margin: theme.spacing(0.5, 0),
    },
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    icon: {
        verticalAlign: 'bottom',
        height: 20,
        width: 20,
    },
    details: {
        alignItems: 'center',
    },
    column: {
        flexBasis: '33.33%',
    },
    helper: {
        borderLeft: `2px solid ${theme.palette.divider}`,
        padding: theme.spacing(1, 2),
    },
    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    expansionPanel: {
        margin: '0 !important'
    }
}));