import React, {useState} from 'react';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {DataTypeProvider, EditingState,} from '@devexpress/dx-react-grid';
import {Grid, Table, TableEditColumn, TableEditRow, TableHeaderRow,} from '@devexpress/dx-react-grid-material-ui';
import pulse from "../../pulse";

const getRowId = row => row.id;

const BooleanFormatter = ({value}) => (
    <Chip color={value === 1 ? "primary" : "secondary"} label={value ? 'Tak' : 'Nie'}/>);

const BooleanEditor = ({value, onValueChange}) => (
    <Select
        input={<Input/>}
        value={value ? 'Tak' : 'Nie'}
        onChange={event => onValueChange(event.target.value === 'Tak')}
        style={{width: '100%'}}>
        <MenuItem value="Tak">
            Tak
        </MenuItem>
        <MenuItem value="Nie">
            Nie
        </MenuItem>
    </Select>
);

const BooleanTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={BooleanFormatter}
        editorComponent={BooleanEditor}
        {...props}
    />
);

const editColumnMessages = {
    editCommand: 'Edytuj',
    deleteCommand: 'Usuń',
    commitCommand: 'Zapisz',
    cancelCommand: 'Anuluj',
};

export default function ChangesTable(props) {

    const [columns] = useState([
        {name: 'field_name', title: 'Nazwa pola'},
        {name: 'new_value', title: 'Nowa wartość'},
        {name: 'old_value', title: 'Stara wartość'},
        {name: 'created_at', title: 'Utworzono'},
        {name: 'accepted', title: 'Zaakceptowane?'},
    ]);
    const [rows, setRows] = useState(props.changes);

    const [editingStateColumnExtensions] = useState([
        {columnName: 'field_name', editingEnabled: false},
        {columnName: 'new_value', editingEnabled: false},
        {columnName: 'old_value', editingEnabled: false},
        {columnName: 'created_at', editingEnabled: false},
    ]);

    const [booleanColumns] = useState(['accepted']);

    const commitChanges = ({added, changed, deleted}) => {
        let changedRows;
        if (changed) {
            changedRows = rows.map(row => {
                return (
                    changed[row.id] ? {...row, ...changed[row.id]} : row
                )
            });

            // look for accept change
            const key = Object.keys(changed);
            if (changed[key] !== undefined) {
                if (changed[key].hasOwnProperty('accepted')) {
                    const row = rows.find(item => item.id === parseInt(key));
                    const val = changed[key]['accepted'];
                    pulse.user.updateChangeRequest({id: key, accepted: val, row: row})
                }
            }
        }

        if (deleted) {
            if (window.confirm('Czy na pewno chcesz usunąc propozycję zmiany z bazy danych ?    ')) {
                pulse.user.removeChangeRequest({id: deleted[0]});
                const deletedSet = new Set(deleted);
                changedRows = rows.filter(row => !deletedSet.has(row.id));
            } else {
                return false;
            }
        }

        setRows(changedRows);
    };

    return (
        <Paper>
            <Grid
                rows={rows}
                columns={columns}
                getRowId={getRowId}>
                <BooleanTypeProvider
                    for={booleanColumns}
                />
                <EditingState
                    columnExtensions={editingStateColumnExtensions}
                    onCommitChanges={commitChanges}
                />
                <Table/>
                <TableHeaderRow/>
                <TableEditRow/>
                <TableEditColumn
                    messages={editColumnMessages}
                    // showAddCommand
                    showEditCommand
                    showDeleteCommand
                />
            </Grid>
        </Paper>
    );
};