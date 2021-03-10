import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from "@material-ui/core/Typography";
import pulse from '../../pulse';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: '0 0 30px 0',
        minWidth: 120,
        width: '100%',
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function SimpleSelect(props) {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        project: props.invoice.data.invoice_type_id,
        contractor: props.invoice.data.invoice_type_id
    });
    const typeData = (props.invoice.data.invoice_type) ? props.invoice.data.invoice_type : 0;
    const [type, setType] = React.useState(typeData);

    const inputLabel = React.useRef(null);
    const [projects, setProjects] = React.useState([]);
    const [contractors, setContractors] = React.useState([]);

    function handleTypeChange(event) {
        setType(event.target.value);
        props.invoiceType({
            type: event.target.value
        });
    }

    function handleChange(event) {
        setValues({...values, [event.target.name]: event.target.value});
        props.invoiceType({
            type: type,
            id: event.target.value
        });
    }

    async function getAllProjects() {
        const items = await pulse.projects.getAllProjects();
        setProjects(items)
    }

    async function getAllContractors() {
        const items = await pulse.contractors.getAllContractors();
        setContractors(items)
    }

    React.useEffect(() => {
        if (pulse.user.role === 1) {
            getAllProjects();
            getAllContractors();
        }
    }, []);

    return (
        <div>
            <FormControl disabled={props.invoice.data.status !== 0} variant="outlined" className={classes.formControl}>
                <Select
                    margin='dense'
                    value={type}
                    onChange={handleTypeChange}
                    input={<OutlinedInput margin="dense" name="type" id="type"/>}>
                    <MenuItem value="0">{pulse.text.invoice.invoice_basic}</MenuItem>
                    {pulse.user.role === 1 &&
                    <MenuItem value="1">
                        {pulse.text.invoice.invoice_project}
                    </MenuItem>}
                    {pulse.user.role === 1 &&
                    <MenuItem value="2">
                        {pulse.text.invoice.invoice_for_contractor}
                    </MenuItem>}
                </Select>
            </FormControl>

            {type == '1' && (
                <>
                    <Typography variant="h6" gutterBottom style={{marginBottom: 10}}>
                        {pulse.text.select_project}
                    </Typography>
                    <FormControl variant="outlined" className={classes.formControl}>

                        <Select
                            margin='dense'
                            value={values.project}
                            onChange={handleChange}
                            input={<OutlinedInput margin="dense" name="project" id="project"/>}>
                            {projects.length > 0 && projects.map(item =>
                                (
                                    <MenuItem key={item.id} value={item.id}>
                                        <ListItemText primary={item.name} secondary={item.company_name}/>
                                    </MenuItem>
                                )
                            )}
                        </Select>
                    </FormControl>
                </>
            )}

            {type == '2' && (
                <>
                    <Typography variant="h6" gutterBottom style={{marginBottom: 10}}>
                        {/*Issue date*/}
                        {pulse.text.select_contractor}
                    </Typography>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <Select
                            margin='dense'
                            value={values.contractor}
                            onChange={handleChange}
                            input={<OutlinedInput margin="dense" name="contractor" id="contractor"/>}>
                            {contractors && contractors.map(item =>
                                (
                                    <MenuItem key={item.id} value={item.id}>
                                        <ListItemText primary={item.name} secondary={item.surname}/>
                                    </MenuItem>
                                )
                            )}
                        </Select>
                    </FormControl>
                </>
            )}
        </div>
    );
}