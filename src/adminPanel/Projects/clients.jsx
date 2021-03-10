import React, {useEffect} from 'react';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';
import pulse from '../../pulse';

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

const handleItemClick = id => {
    if (id) {
        const item = pulse.clients.clients.find(item => item.id === parseInt(id));
        selected1 = [item];
    }
};

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
                    <span onClick={handleItemClick(parts[0])}
                          key={index}
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

export default function IntegrationAutosuggest(props) {

    const classes = useStyles();
    const [state, setState] = React.useState({
        single: '',
        popper: '',
    });
    // const [selected, setSelected] = React.useState('');

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
        // setSelected(selected1);
        props.selected(selected1)
    };

    const autosuggestProps = {
        renderInputComponent,
        suggestions: stateSuggestions,
        onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
        onSuggestionsClearRequested: handleSuggestionsClearRequested,
        getSuggestionValue,
        handleItemClick: props,
        renderSuggestion,
    };

    async function getAllClientsPromise() {
        const clients = (pulse.clients.clients.length <= 0) ? await pulse.clients.getAllClientsPromise() : pulse.clients.clients;
        suggestions = [...new Set(clients)];
        if (typeof props.default === 'number') {
            const client = pulse.clients.clients.find(item => item.id === parseInt(props.default));
            setState({
                ...client,
                single: client.company_name,
            });
        }
    }

    useEffect(() => {
        getAllClientsPromise();
    }, []);

    return (
        <div className={classes.root}>
            <Autosuggest
                {...autosuggestProps}
                inputProps={{
                    classes,
                    variant: "outlined",
                    id: 'react-autosuggest-simple',
                    label: 'Nazwa firmy',
                    placeholder: 'Wyszukaj...',
                    value: state.single,
                    onChange: handleChange('single'),
                }}
                InputLabelProps={{
                    shrink: true,
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

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        marginTop: 16
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
        // top: -131
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
        maxHeight: 276,
        // height: 276,
        overflow: 'auto',
    },
    divider: {
        maxHeight: 276,
    },
}));


// const styles = theme => ({
//
// });
//
//
// IntegrationAutosuggest.propTypes = {
//     classes: PropTypes.object.isRequired,
// };
//
// export default withStyles(styles)(IntegrationAutosuggest);