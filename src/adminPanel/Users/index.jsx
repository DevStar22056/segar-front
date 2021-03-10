import React from 'react'
import UsersExtended from './table'
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import NewUserDialog from './newUser';

const UsersManager = () => {
    return (
        <Paper>
            <Grid style={{padding: 20}} container spacing={0} className="container">
                <Grid item xs={6}>
                </Grid>
                <Grid item xs={6}>
                    <NewUserDialog/>
                </Grid>
                <Grid item xs={12}>
                    <UsersExtended/>
                </Grid>
            </Grid>
        </Paper>
    )
};

export default UsersManager;