import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import QuestionAnswer from '@material-ui/icons/QuestionAnswer';
import CircularProgress from "@material-ui/core/CircularProgress";
import pulse from "../pulse";

export default function FaqList() {
    const classes = useStyles();
    const [faq, setFaq] = useState([]);
    const [empty, setEmpty] = useState(false);

    async function fetchFaq() {
        const faq = await pulse.faq.getFaqItems();
        setFaq(faq);
        if (!faq.length) {
            setEmpty(true);
        }
    }

    useEffect(() => {
        fetchFaq();
    }, []);

    return (
        <div className={classes.root}>
            <Grid container spacing={5}>
                <Grid item xs={12}>
                    {faq.length > 0 ? (
                        <div className={classes.demo}>
                            <List dense>
                                {faq.map(item => (
                                    <ListItem key={item.id} className={classes.listitem}>
                                        <ListItemIcon>
                                            <QuestionAnswer/>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.title}
                                            secondary={item.description}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    ) : (
                        <>
                            {empty ? (
                                <Typography>{pulse.text.no_content}</Typography>
                            ) : (
                                <CircularProgress size={18}/>
                            )}
                        </>
                    )}
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
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        margin: theme.spacing(4, 0, 2),
    },
    listitem: {
        borderBottom: '1px solid #e4e4e4'
    }
}));