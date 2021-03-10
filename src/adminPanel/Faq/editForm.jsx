import React, {forwardRef, useImperativeHandle} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import pulse from "../../pulse";

const ControlledExpansionPanels = forwardRef((props, ref) => {

    const classes = useStyles();

    /* USER FIELDS */
    const [userDetails, setuserDetails] = React.useState(props.faq);
    const handleChangeUserDetails = event => {
        setuserDetails({...userDetails, [event.target.name]: event.target.value});
    };

    /* CLIENTS */
    useImperativeHandle(ref, () => ({
        handleSave() {
            pulse.faq.updateFaqItem({
                id: props.faq.id,
                ...userDetails
            });
            setOpen(true);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }));

    const [open, setOpen] = React.useState(false);

    function handleClick() {
        setOpen(true);
    }

    function handleClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    }

    return (
        <div className={classes.root}>
            <TextField
                label="Nazwa"
                fullWidth
                margin="dense"
                variant="outlined"
                value={userDetails.title}
                name="title"
                onChange={handleChangeUserDetails}
                className={classes.textField}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <br/>
            <br/>
            <TextField
                multiline
                label="Opis"
                fullWidth
                margin="dense"
                rows={4}
                rowsMax={6}
                variant="outlined"
                value={userDetails.description}
                name="description"
                onChange={handleChangeUserDetails}
                className={classes.textField}
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </div>
    )
});

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        padding: 40
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    formControl: {
        width: '100%'
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(0),
        marginRight: theme.spacing(2),
        width: '100%',
        fontSize: 12
    },
    controlCheckbox: {
        // position: 'relative',
        // top: -8
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },
    demo: {
        backgroundColor: '#efefef',
    },
    textFieldInputDiff: {
        backgroundColor: '#ecffe4'
    },
}));

export default ControlledExpansionPanels;