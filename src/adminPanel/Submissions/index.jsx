import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import pulse from "../../pulse";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CircularProgress from "@material-ui/core/CircularProgress";
import ExpenseTable from "./Expenses/ExpenseTable";
import SaleTable from "./Sales/SaleTable";

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}

export default function AdminSubmissions(props) {
    const [value, setValue] = React.useState(0);

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    return (
        <Paper>
            <Grid container spacing={0}>
                <Grid item md={12}>
                    <div style={{padding: 0}}>
                        <Tabs
                            value={value}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={handleChange}
                            aria-label="disabled tabs example"
                            style={{padding: '0 20px 0 20px'}}>
                            <Tab label="Faktury kosztowe"/>
                            <Tab label="Faktury sprzedażowe"/>
                        </Tabs>
                        <TabPanel value={value} index={0}>
                            <ExpenseTable newItem={false} source={'all'}/>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <SaleTable newItem={true} source={'all'}/>
                        </TabPanel>
                    </div>
                </Grid>
            </Grid>
        </Paper>
    );
}

const useStyles = makeStyles(theme => ({
    root: {
        // width: '100%',
        backgroundColor: '#FFFFFF'
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
}));