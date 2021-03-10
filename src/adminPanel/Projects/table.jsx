import React, {useEffect, useState} from 'react';
// import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
// import FullScreenDialog from './editModal';
// import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {
    CustomPaging,
    DataTypeProvider,
    FilteringState,
    IntegratedFiltering,
    IntegratedPaging,
    IntegratedSorting,
    PagingState,
    RowDetailState,
    SelectionState,
    SortingState
} from '@devexpress/dx-react-grid';
import {
    DragDropProvider,
    Grid,
    PagingPanel,
    Table,
    TableColumnReordering,
    TableColumnVisibility,
    TableFilterRow,
    TableHeaderRow,
    TableSelection
} from '@devexpress/dx-react-grid-material-ui';
import FullScreenDialog from "./editDialog";
import Button from "@material-ui/core/Button";
import pulse from "../../pulse";

/**
 * Status formatter
 * @param value
 * @returns {*}
 * @constructor
 */


// const BooleanFormatter = ({value}) => <Chip label={value}/>;
const BooleanFormatter = ({value}) => <Chip label={value ? 'Tak' : 'Nie'}/>;

const BooleanEditor = ({value, onValueChange}) => (
    <Select
        input={<Input/>}
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

function handleRemove(id) {
    console.log(id)
    // setLoading(true);
    pulse.projects.deleteProject({
        id: id
    });
    setTimeout(() => {
        // fetchProjects();
        window.location.reload();
    }, 500);
}

const OverHelp = el => {
    const elem = el.el;
    return (
        <React.Fragment>
            {elem && (
                <div className={'over-helper'}>
                    <Button style={{marginBottom: 5}} variant="text" color="inherit" size="medium">
                        Wybrano projekt: <strong
                        style={{marginLeft: 10}}>{elem.id} - {elem.title}</strong>
                    </Button>
                    <br/>
                    <FullScreenDialog project={elem}/>
                    <Button variant="contained" color="secondary"
                            onClick={() => handleRemove(elem.id)}>
                        Usuń
                    </Button>
                </div>
            )}
        </React.Fragment>
    )
};

export default function ProjectsExtended(props) {

    const [columns] = useState([
        {name: 'id', title: 'ID'},
        {name: 'name', title: 'Nazwa projektu'},
        {name: 'description', title: 'Opis projektu'},
        {name: 'company_name', title: 'Nazwa klienta'},
    ]);

    const [rows, setRows] = useState([]);

    const [pageSizes] = useState([5, 10, 15, 0]);

    const [dateColumns] = useState(['issue_date', 'payment_date']);
    const [tableColumnExtensions] = useState([
        {columnName: 'id', width: 60},
    ]);

    const [leftColumns] = useState(['id', 'name']);
    const [rightColumns] = useState(['actions']);
    const [booleanColumns] = useState(['is_active', 'can_login', 'verified']);
    const [numberLink] = useState(['internal_invoice_number']);
    const [textRow] = useState(['name']);
    const [textRow2] = useState(['surname']);
    const [purchaser_extended] = useState(['purchaser_extended']);
    const [integratedFilteringColumnExtensions] = useState([
        // {columnName: 'name', predicate: cityPredicate},
        {columnName: 'id', filteringEnabled: false}
    ]);
    const [selection, setSelection] = useState([]);
    const [columnOrder, setColumnOrder] = useState(JSON.parse(window.localStorage.getItem('sale_table')) || ['status', 'id', 'name', 'surname', 'internal_invoice_number', 'invoice_number', 'description', 'hours_value', 'hours_value_netto', 'hours_value_gross', 'issue_date', 'payment_date', 'purchaser_extended']);

    /**
     * row selection
     *  */
    const changeSelection = selectedItem => {
        const lastSelected = selectedItem.find(selectedItem => selection.indexOf(selectedItem) === -1);
        setSelection([lastSelected])
    };

    const setColumnOrderFn = nextOrder => {
        window.localStorage.setItem("sale_table", JSON.stringify(nextOrder));
        setColumnOrder(nextOrder)
    };

    /**
     * pagination
     **/
    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);

    async function fetchNewInvoices() {
        await pulse.projects.getAllProjects({
            page: currentPage + 1
        })
            .then(res => res)
            .then(res => {
                // setRows(res.data.data);
                setRows(res.data);
                setTotalCount(res.total);
                setPageSize(res.per_page);
                setLoading(false);
            });
    }

    useEffect(() => {
        fetchNewInvoices();
    }, [currentPage]);

    return (
        <Paper>
            <Grid
                rows={rows}
                columns={columns}
            >
                <OverHelp el={rows[selection]}/>
                <PagingState
                    currentPage={currentPage}
                    onCurrentPageChange={setCurrentPage}
                    pageSize={pageSize}
                />

                <CustomPaging
                    totalCount={totalCount}
                />

                <RowDetailState
                    // expandedRowIds={expandedRowIds}
                    // onExpandedRowIdsChange={changeExpandedDetails}
                />

                <SortingState
                    defaultSorting={[
                        {columnName: 'name', direction: 'asc'},
                    ]}
                />

                <FilteringState/>

                <IntegratedSorting/>

                <SelectionState/>

                <IntegratedFiltering/>

                <BooleanTypeProvider
                    for={booleanColumns}
                />

                <SelectionState
                    selection={selection}
                    onSelectionChange={selectedItem => changeSelection(selectedItem, rows)}
                />

                <DragDropProvider/>

                <Table columnExtensions={tableColumnExtensions}/>

                {/*<TableColumnReordering*/}
                {/*    defaultOrder={['id', 'name', 'description', 'company_name']}*/}
                {/*/>*/}

                <TableSelection
                    selectByRowClick
                    highlightRow
                    showSelectionColumn={false}
                />

                <TableHeaderRow showSortingControls/>

                {/*<TableRowDetail*/}
                {/*    contentComponent={RowDetail}*/}
                {/*/>*/}

                <TableFilterRow showFilterSelector={true}/>

                <PagingPanel/>

                <TableColumnVisibility
                    defaultHiddenColumnNames={''}
                />

                {/*<Toolbar/>*/}

                {/*<ColumnChooser/>*/}

            </Grid>
        </Paper>
    );
}
