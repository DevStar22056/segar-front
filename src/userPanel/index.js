import React from 'react';
import Step01 from './step01';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import pulse from "../pulse";

const useStyles = makeStyles(theme => ({
    root: {
        padding: 40
    },
}));

export default function UserPanel(props) {
    const classes = useStyles();
    return (
        <Grid direction="column" alignItems="flex-start" container spacing={0}>
            {/* FORM FIELD ROW */}
            <Grid alignItems="center" container spacing={0}>
                {/*<Grid item xs={12} md={2}></Grid>*/}
                <Grid item xs={12} md={12}>
                    <Paper className={classes.root}>
                        <Typography variant={"h4"} color="inherit" style={{marginBottom: 50, textAlign: "center"}}>
                            {pulse.text.questionnaire}
                        </Typography>
                        <Step01 can_edit={props.can_edit} read_only={true}/>
                    </Paper>
                </Grid>
            </Grid>
        </Grid>
    )
}
