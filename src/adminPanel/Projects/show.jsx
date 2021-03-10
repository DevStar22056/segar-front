import React, {forwardRef, useImperativeHandle} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IntegrationAutosuggest from "./clients";
import pulse from '../../pulse';
import IntegrationReactSelect from './usersList';
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    icon: {
        marginRight: theme.spacing(2),
    },
    divider: {
        height: theme.spacing(3),
    }
}));

const ShowProject = forwardRef((props, ref) => {
    const classes = useStyles();

    const [formClient, setFormClient] = React.useState(props.project_obj.client_id);
    const [formCompanyName, setCompanyName] = React.useState(props.project_obj.company_name);
    const [formUsers, setSelectedUsers] = React.useState(props.project_obj.project_users);

    const [single, setSingle] = React.useState({
        name: props.project_obj.name,
        description: props.project_obj.description,
        client_id: props.project_obj.client_id,
    });

    useImperativeHandle(ref, () => ({

        handleSave() {
            const formUsersObj = (formUsers !== undefined) ? formUsers : [];
            pulse.projects.updateProject({
                id: props.project_obj.id,
                name: single.name,
                description: single.description,
                client_id: formClient,
                company_name: formCompanyName,
                selectedUsers: formUsersObj
            });
            setTimeout(() => {
                window.location.reload();
            }, 300);
        }
    }));

    const handleChange = e => {
        setSingle({...single, [e.target.name]: e.target.value});
    };

    const handleSelect = e => {
        if (e.length > 0) {
            setFormClient(e[0].id);
            setCompanyName(e[0].company_name);
        }
    };

    const handleSelectUsers = e => {
        if (e === null) {
            setSelectedUsers()
        } else {
            setSelectedUsers(e)
        }
    };

    return (
        <div>
            <div className={classes.divider}/>
            <Typography variant="h6" gutterBottom style={{float: 'left'}}>
                Nazwa projektu
            </Typography>
            <TextField
                value={single.name}
                name="name"
                label="Project name"
                style={{margin: '8 0'}}
                fullWidth
                margin="dense"
                variant="outlined"
                onChange={handleChange}
            />

            <div className={classes.divider}/>
            <Typography variant="h6" gutterBottom style={{float: 'left'}}>
                Opis projektu
            </Typography>
            <TextField
                value={single.description}
                label="Project description"
                style={{margin: '8 0'}}
                fullWidth
                margin="dense"
                variant="outlined"
                multiline
                rows="2"
                rowsMax="4"
                name="description"
                onChange={handleChange}
            />

            <div className={classes.divider}/>
            <Typography variant="h6" gutterBottom style={{float: 'left', marginBottom: 20}}>
                Nazwa klienta
            </Typography>
            <IntegrationAutosuggest selected={(val) => {
                handleSelect(val)
            }} default={single.client_id}/>

            <div className={classes.divider}/>
            <Typography variant="h6" gutterBottom style={{float: 'left'}}>
                Kontraktorzy
            </Typography>
            <IntegrationReactSelect selected={(val) => {
                handleSelectUsers(val)
            }} default={props.project}/>

            {/*<Button onClick={handleSave} component={Link} to={'/admin/projects'} color="primary">Save</Button>*/}

        </div>
    );
});

export default ShowProject;