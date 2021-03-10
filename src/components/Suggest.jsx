import React, {useEffect} from 'react';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from "prop-types";
import pulse from '../pulse';
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import HelpRounded from '@material-ui/icons/HelpRounded';
import LinearProgress from '@material-ui/core/LinearProgress';

let suggestions = [];
let selected1 = [];

function renderInputComponent(inputProps) {
    const {
        classes, inputRef = () => {
        }, ref, ...other
    } = inputProps;

    return (
        <TextField
            fullWidth
            InputProps={{
                inputRef: node => {
                    ref(node);
                    inputRef(node);
                },
                classes: {
                    input: classes.input,
                },
            }}
            {...other}
        />
    );
}

function handleItemClick(id) {
    if (id) {
        const item = pulse.clients.clients.find(item => item.id === parseInt(id));
        selected1 = [item];
    }
}

function renderSuggestion(suggestion, {query, isHighlighted}) {
    const matches = match(suggestion.company_name, query);
    const parts = [
        suggestion.id,
        parse(suggestion.company_name, matches)
    ];

    return (
        <MenuItem selected={isHighlighted} component="div">
            <div>
                {parts[1].map((part, index) => (
                    <span onClick={handleItemClick(parts[0])} key={part.text}
                          style={{fontWeight: part.highlight ? 500 : 400}}>
                        {part.text}
                    </span>
                ))}
            </div>
        </MenuItem>
    );
}

function getSuggestions(value) {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
        ? []
        : suggestions.filter(suggestion => {
            const keep =
                count < 150 && suggestion.company_name.slice(0, inputLength).toLowerCase() === inputValue;

            if (keep) {
                count += 1;
            }

            return keep;
        });
}

function getSuggestionValue(suggestion) {
    return suggestion.company_name;
}

const styles = theme => ({
    root: {
        // height: 150,
        flexGrow: 1,
    },
    container: {
        position: 'relative',
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        zIndex: 1000,
        marginTop: 1,
        left: 0,
        right: 0,
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
        background: 'white',
        zIndex: 9999,
        maxHeight: 200,
        overflow: 'auto'
    },
    divider: {
        height: 200,
    },
});

function IntegrationAutosuggest(props) {
    const {classes} = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [state, setState] = React.useState({
        single: '',
        popper: '',
    });

    const [selected, setSelected] = React.useState('');
    props.selected(selected);
    // console.log(selected);
    useEffect(() => {
        const d = pulse.clients.clients;
        suggestions = [...new Set(d)];
        if (suggestions.length > 0) {
            setLoading(false);
        }
    }, []);

    const [stateSuggestions, setSuggestions] = React.useState([]);

    const handleSuggestionsFetchRequested = ({value}) => {
        setSuggestions(getSuggestions(value));
    };

    const handleSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const handleChange = name => (event, {newValue, id}) => {
        setState({
            ...state,
            [name]: newValue,
        });
        setSelected(selected1);
    };

    const autosuggestProps = {
        renderInputComponent,
        suggestions: stateSuggestions,
        onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
        onSuggestionsClearRequested: handleSuggestionsClearRequested,
        getSuggestionValue,
        handleItemClick,
        renderSuggestion,
    };

    return (
        <div className={classes.root}>
            <Typography variant="h6" gutterBottom style={{float: 'left', marginBottom: 15}}>
                {/*Issue date*/}
                Company name
            </Typography>
            <Tooltip
                style={{
                    top: -7,
                    marginLeft: 10
                }}
                title={
                    <React.Fragment>
                        <Typography color="inherit">Create an invoice for selected company.</Typography>
                    </React.Fragment>
                }
                aria-label="Add"
                placement="top">
                <IconButton aria-label="Delete">
                    <HelpRounded/>
                </IconButton>
            </Tooltip>
            <div style={{position: 'relative'}}>
                {loading && <LinearProgress style={{position: 'absolute', top: 0, width: '100%'}}/>}
            </div>
            <Autosuggest
                {...autosuggestProps}
                inputProps={{
                    classes,
                    variant: "outlined",
                    id: 'react-autosuggest-simple',
                    label: 'Company name',
                    placeholder: 'Search a company',
                    value: state.single,
                    onChange: handleChange('single'),
                }}
                theme={{
                    container: classes.container,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion,
                }}
                renderSuggestionsContainer={options => (
                    <Paper {...options.containerProps} square>
                        {options.children}
                    </Paper>
                )}
            />

        </div>
    );
}


IntegrationAutosuggest.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IntegrationAutosuggest);