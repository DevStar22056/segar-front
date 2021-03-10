import React, {useEffect, useState} from 'react';
// import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
import FullScreenDialog from './editModal';
// import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {
    DataTypeProvider,
    FilteringState,
    IntegratedFiltering,
    IntegratedSorting,
    PagingState,
    SelectionState,
    SortingState,
    CustomPaging
} from '@devexpress/dx-react-grid';
import {
    DragDropProvider,
    Grid,
    PagingPanel,
    Table,
    TableColumnReordering,
    TableColumnVisibility,
    TableFilterRow,
    TableFixedColumns,
    TableHeaderRow,
    TableSelection
} from '@devexpress/dx-react-grid-material-ui';
import {API_URL} from "../../config";
import pulse from "../../pulse";


/**
 * Status formatter
 * @param value
 * @returns {*}
 * @constructor
 */


// const BooleanFormatter = ({value}) => <Chip label={value}/>;
const BooleanFormatter = ({value}) => <Chip color={value ? 'primary' : 'secondary'} label={value ? 'Tak' : 'Nie'}/>;

const BooleanEditor = ({value = '', onValueChange}) => (
    <Select
        input={<Input value=""/>}
        value={value}
        onChange={event => {
            onValueChange(event.target.value)
        }}
        style={{width: '100%'}}>
        <MenuItem value="1">
            Tak
        </MenuItem>
        <MenuItem value="0">
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

// search by ID
const ClientFormatter = ({value, row}) => {
    if (row.client) {
        return (
            <Chip key={value} label={row.client.company_name}/>
        )
    }
    return (<></>);
};

const ClientTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={ClientFormatter}
        {...props}
    />
);

export default function UsersExtended(props) {

    const [columns] = useState([
        {name: 'id', title: 'ID'},
        {name: 'name', title: 'Imię'},
        {name: 'surname', title: 'Nazwisko'},
        {name: 'email', title: 'Email'},
        {name: 'is_active', title: 'Aktywny?', dataType: 'boolean'},
        {name: 'can_login', title: 'Logowanie?', dataType: 'boolean'},
        {name: 'verified', title: 'Zweryfikowany?', dataType: 'boolean'},
        {name: 'hrm_candidat_id', title: 'HRM ID'},
        {name: 'client_id', title: 'Klient'},
    ]);
    const [rows, setRows] = useState([]);
    const [tableColumnExtensions] = useState([
            {columnName: 'id', width: 70},
        ]
    );
    const [leftColumns] = useState(['id', 'name']);
    const [rightColumns] = useState(['actions']);
    const [booleanColumns] = useState(['is_active', 'can_login', 'verified']);
    const [client] = useState(['client_id']);
    const [selection, setSelection] = useState([]);
    const [columnOrder, setColumnOrder] = useState(JSON.parse(window.localStorage.getItem('users_table')) || ['id', 'name', 'surname', 'email', 'is_active', 'can_login', 'verified', 'hrm_candidat_id', 'client_id']);

    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);

    /**
     * row selection
     *  */
    const changeSelection = selectedItem => {
        const lastSelected = selectedItem.find(selectedItem => selection.indexOf(selectedItem) === -1);
        setSelection([lastSelected])
    };

    const setColumnOrderFn = nextOrder => {
        localStorage.setItem("users_table", JSON.stringify(nextOrder));
        setColumnOrder(nextOrder)
    };

    /**
     * pagination
     **/
    async function fetchUsers() {
        await pulse.users.getAllUsers({
            page: currentPage + 1
        })
            .then(res => res)
            .then(res => {
                setRows(res.data);
                setTotalCount(res.total);
                setPageSize(res.per_page);
                setLoading(false);
            });
    }

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    return (
        <Paper>
            <Grid
                rows={rows}
                columns={columns}>

                <DragDropProvider/>

                <PagingState
                    // defaultCurrentPage={}
                    currentPage={currentPage}
                    onCurrentPageChange={setCurrentPage}
                    pageSize={pageSize}
                />

                <CustomPaging
                    totalCount={totalCount}
                />

                <SortingState
                    defaultSorting={[
                        {columnName: 'name', direction: 'asc'},
                    ]}
                />

                <FilteringState/>

                <IntegratedFiltering/>

                <IntegratedSorting/>

                <SelectionState/>

                <BooleanTypeProvider
                    for={booleanColumns}
                />

                <ClientTypeProvider
                    for={client}
                />

                <SelectionState
                    selection={selection}
                    onSelectionChange={selectedItem => changeSelection(selectedItem, rows)}
                />

                {/* TABLE */}
                <Table columnExtensions={tableColumnExtensions}/>
                <TableColumnReordering
                    order={columnOrder}
                    onOrderChange={nextOrder => setColumnOrderFn(nextOrder)}
                />
                {/* TABLE */}

                <TableHeaderRow showSortingControls/>

                {/*<TableRowDetail*/}
                {/*    contentComponent={RowDetail}*/}
                {/*/>*/}

                <TableSelection
                    selectByRowClick
                    highlightRow
                    showSelectionColumn={false}
                />

                <TableFilterRow showFilterSelector={true}/>

                <TableFixedColumns
                    leftColumns={leftColumns}
                    rightColumns={rightColumns}
                />

                <PagingPanel />

                <TableColumnVisibility
                    defaultHiddenColumnNames={''}
                />

            </Grid>

            {selection.length > 0 && <FullScreenDialog user={rows[selection]}/>}

        </Paper>
    );
}