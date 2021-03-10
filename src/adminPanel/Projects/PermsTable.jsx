import React from 'react';
// import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
// import FullScreenDialog from './editModal';
// import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {
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
    ColumnChooser,
    DragDropProvider,
    Grid,
    PagingPanel,
    Table,
    TableColumnReordering,
    TableColumnVisibility,
    TableFilterRow,
    TableHeaderRow,
    TableRowDetail,
    Toolbar
} from '@devexpress/dx-react-grid-material-ui';
import pulse from "../../pulse";

const RowDetail = ({row}) => (
    <>
        {/*<FullScreenDialog project={row}/>*/}
        {/*<Button variant="contained" color="secondary"*/}
        {/*        onClick={() => handleRemove(row.id)}>*/}
        {/*    Usuń*/}
        {/*</Button>*/}
    </>
);

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
    // setLoading(true);
    pulse.projects.deleteProject({
        id: id
    });
    setTimeout(() => {
        // fetchProjects();
        window.location.reload();
    }, 500);
}

/**
 annual_currency: null
 annual_rate: 0
 available_from: null
 candidate_id: 533
 created_at: "2014-03-25 00:21:26"
 employment_type: null
 end_date: null
 hourly_currency: null
 hourly_rate: 0
 id: 30
 interview_at: null
 project_id: 12
 start_date: null
 status: "deal"
 user_id: 1
 */

export default class Perms extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                {name: 'id', title: 'ID'},
                {name: 'annual_currency', title: 'annual_currency'},
                {name: 'annual_rate', title: 'annual_rate'},
                {name: 'available_from', title: 'available_from'},
                {name: 'candidate_id', title: 'candidate_id'},
                {name: 'created_at', title: 'created_at'},
                {name: 'employment_type', title: 'employment_type'},
                {name: 'end_date', title: 'end_date'},
                {name: 'hourly_currency', title: 'hourly_currency'},
                {name: 'hourly_rate', title: 'hourly_rate'},
                {name: 'interview_at', title: 'interview_at'},
                {name: 'project_id', title: 'project_id'},
                {name: 'start_date', title: 'start_date'},
                {name: 'status', title: 'status'},
                {name: 'user_id', title: 'user_id'},
            ],
            rows: props.projects,
            expandedRowIds: [],
            pageSizes: [0],
            // dateColumns: ['issue_date', 'payment_date'],
            tableColumnExtensions: [
                {columnName: 'id', width: 60},
                // {columnName: 'invoice_number', width: 180},
                // {columnName: 'description', width: 120},
                // {columnName: 'hours_value', width: 230},
                // {columnName: 'hours_value_netto', width: 230},
                // {columnName: 'hours_value_gross', width: 230},
                // {columnName: 'issue_date', width: 230},
                // {columnName: 'payment_date', width: 230},
                // {columnName: 'approval', width: 230},
                // {columnName: 'status', width: 230},
                // {columnName: 'actions', width: 230},
            ],
            leftColumns: ['id', 'name'],
            rightColumns: ['actions'],
            booleanColumns: ['is_active', 'can_login', 'verified']
        };

        this.changeExpandedDetails = expandedRowIds => this.setState({expandedRowIds});
        this.changeCurrentPage = currentPage => this.setState({currentPage});
        this.changePageSize = pageSize => this.setState({pageSize});
    }

    render() {
        const {
            rows, columns, expandedRowIds, pageSize, pageSizes, currentPage, tableColumnExtensions,
            leftColumns, rightColumns, booleanColumns
        } = this.state;

        return (
            <Paper>
                <Grid
                    rows={rows}
                    columns={columns}
                >

                    <PagingState
                        currentPage={currentPage}
                        onCurrentPageChange={this.changeCurrentPage}
                        pageSize={0}
                        onPageSizeChange={this.changePageSize}
                    />

                    <RowDetailState
                        expandedRowIds={expandedRowIds}
                        onExpandedRowIdsChange={this.changeExpandedDetails}
                    />

                    <SortingState
                        defaultSorting={[
                            {columnName: 'name', direction: 'asc'},
                        ]}
                    />

                    <FilteringState/>

                    <IntegratedPaging/>

                    <IntegratedSorting/>

                    <SelectionState/>

                    <IntegratedFiltering/>

                    <BooleanTypeProvider
                        for={booleanColumns}
                    />
                    <DragDropProvider/>
                    <Table columnExtensions={tableColumnExtensions}/>
                    {/*<TableColumnReordering*/}
                    {/*    defaultOrder={['id', 'name', 'description', 'company_name']}*/}
                    {/*/>*/}
                    {/* TABLE */}
                    {/*<VirtualTable columnExtensions={tableColumnExtensions}/>*/}
                    {/* TABLE */}

                    <TableHeaderRow showSortingControls/>

                    <TableRowDetail
                        contentComponent={RowDetail}
                    />

                    <TableFilterRow showFilterSelector={true}/>

                    {/*<TableFixedColumns*/}
                    {/*    leftColumns={leftColumns}*/}
                    {/*    rightColumns={rightColumns}*/}
                    {/*/>*/}

                    <PagingPanel pageSizes={pageSizes}/>

                    <TableColumnVisibility
                        defaultHiddenColumnNames={''}
                    />

                    <Toolbar/>

                    <ColumnChooser/>

                </Grid>
            </Paper>
        );
    }
}
