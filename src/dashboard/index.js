import React, {useEffect, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import FaqList from './faq';
import Profile from "./profile";
import Timesheets from "./timesheets";
import InvoicesTable from './components/invoicesTable'
import pulse from "../pulse";
import LinearProgress from "@material-ui/core/LinearProgress";

export default function Dashboard(props) {

    return (
        <Grid container spacing={0}>
            <Grid item md={12}>
                <div style={{padding: 20}}>
                    {props.match.url === "/dashboard" && <InvoicesTable  newItem={true} source={'all'}/>}
                    {props.match.url === "/dashboard/faq" && <FaqList/>}
                    {props.match.url === "/dashboard/timesheets" && <Timesheets/>}
                    {props.match.url === "/dashboard/profile" && <Profile/>}
                    {props.match.url === "/dashboard/invoices" && <InvoicesTable  newItem={true} source={'all'}/>}
                </div>
            </Grid>
        </Grid>
    )
}
