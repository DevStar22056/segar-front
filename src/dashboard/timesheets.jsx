import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import pulse from "../pulse";
import {Link} from "react-router-dom";
import {API} from "../config";
import {Paper} from "@material-ui/core";

export default function Profile() {
    const classes = useStyles();
    const [timesheets, setTimesheets] = useState([]);

    async function getTimesheets() {
        const timesheets = await pulse.timesheets.getTimesheets();
        setTimesheets(timesheets);
    }

    useEffect(() => {
        getTimesheets();
    }, []);

    return (
        <div className={classes.root}>
            <Grid container spacing={5}>
                <Grid item xs={12}>
                    {timesheets &&
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <Typography variant="h6" className={classes.title}>
                                    Timesheets
                                </Typography>
                                <List dense={true}>
                                    {timesheets.map(file => (
                                        <ListItem key={file.id}>
                                            <Link href={API + file.filename} target="_blank">
                                                <ListItemText
                                                    primary={file.original_name}
                                                    secondary={file.updated_at}
                                                />
                                            </Link>
                                            <Button component={Link} to={'/invoices/show/' + file.source_id}
                                                    style={{marginLeft: 20}} color="primary"
                                                    variant="outlined">{pulse.text.check_invoice}</Button>
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>
                    </Grid>}
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
        backgroundColor: '#e4e4e4',
    },
    title: {
        margin: theme.spacing(0, 2, 2),
    },
    listitem: {
        borderBottom: '1px solid #e4e4e4'
    },
    paper: {
        padding: theme.spacing(2),
        width: '100%'
    }
}));