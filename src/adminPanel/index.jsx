import React, {useEffect, useState} from 'react';
import AdminSubmissions from "./Submissions";
import UsersMenager from "./Users";
import Projects from "./Projects";
import FaqManager from "./Faq";
import Summary from "./Summary";
import Purchasers from './Contractors/index';
import Grid from "@material-ui/core/Grid";
import Sellers from "./Sellers";

export default function AdminPanel(props) {
    return (
        <Grid container spacing={0}>
            <Grid item md={12}>
                <div style={{padding: 20}}>
                    {props.match.url === "/admin" && <AdminSubmissions/>}
                    {props.match.url === "/admin/invoices" && <AdminSubmissions/>}
                    {props.match.url === "/admin/users" && <UsersMenager/>}
                    {props.match.url === "/admin/projects" && <Projects/>}
                    {props.match.url === "/admin/faq" && <FaqManager/>}
                    {props.match.url === "/admin/summary" && <Summary/>}
                    {props.match.url === "/admin/contractors" && <Purchasers/>}
                    {props.match.url === "/admin/sellers" && <Sellers/>}
                </div>
            </Grid>
        </Grid>
    );
}