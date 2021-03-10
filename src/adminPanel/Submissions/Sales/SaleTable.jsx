import * as React from 'react';
import {useState} from 'react';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Select from '@material-ui/core/Select';
import {Link} from "react-router-dom";
import {
    CustomPaging,
    DataTypeProvider,
    FilteringState,
    IntegratedFiltering,
    IntegratedPaging,
    IntegratedSorting,
    PagingState,
    RowDetailState,
    SearchState,
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
    TableFixedColumns,
    TableHeaderRow,
    TableSelection
} from '@devexpress/dx-react-grid-material-ui';
import {format} from "date-fns/esm";
import NewInvoiceButton from "../../../invoices/newInvoiceButton";
import pulse from "../../../pulse";
import Tooltip from "@material-ui/core/Tooltip";
import TableRowOptions from './TableRowOptions';
import {useEffect} from "react";


/**
 * Date formatter
 * @param value
 * @returns {string}
 * @constructor
 */
const DateFormatter = ({value}) => format(new Date(value), 'yyyy-MM-dd');
const DateTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={DateFormatter}
        {...props}
    />
);

/**
 * Invoice number to link
 */
const LinkGenerator = ({row, value}) => {

    return (
        <Tooltip title={value}>
            <Link
                component="button"
                to={'/invoices/show/' + row.id}>
                {value}
            </Link>
        </Tooltip>
    )
};

const LinkGeneratorProvider = props => (
    <DataTypeProvider
        formatterComponent={LinkGenerator}
        {...props}
    />
);

/**
 * Status formatter
 * @param value
 * @returns {*}
 * @constructor
 */


const statuses = [
    pulse.text.invoice.draft,
    pulse.text.invoice.in_approval,
    pulse.text.invoice.rejected,
    pulse.text.invoice.approved,
    pulse.text.invoice.paid,
    pulse.text.invoice.sended,
];

const statuses_en = [
    pulse._text.invoice.draft,
    pulse._text.invoice.in_approval,
    pulse._text.invoice.rejected,
    pulse._text.invoice.approved,
    pulse._text.invoice.paid,
    pulse._text.invoice.sended,
];

const styles = {
    paid: {
        backgroundColor: '#a2e2a4',
    },
    approved: {
        backgroundColor: '#b3e5fc',
    },
    rejected: {
        backgroundColor: '#ffcdd2',
    },
    inapproval: {
        backgroundColor: '#f0f4c3',
    },
    draft: {
        backgroundColor: '#f5f5f5',
    },
    sended: {
        backgroundColor: '#202af5',
        color: '#ffffff'
    },
};

const BooleanFormatter = ({value}) => {
    const stat = statuses_en[value].toLowerCase().replace(' ', '');
    return (
        <Chip style={styles[stat]} label={statuses[value]}/>
    )
};

const BooleanEditor = ({value, onValueChange}) => {
    return (
        <Select
            native
            value={value}
            onChange={event => onValueChange(event.target.value)}
            style={{width: '100%'}}>
            <option value="">wybierz</option>
            {statuses.map((status, index) => (
                <option key={index} value={index}>
                    {statuses[index]}
                </option>
            ))}
        </Select>
    )
};

const BooleanTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={BooleanFormatter}
        editorComponent={BooleanEditor}
        {...props}
    />
);

// purchaser_extended
const PurchaserExtended = ({row}) => {
    return (
        <>{row.vendor_extended && row.vendor_extended.name} {row.vendor_extended && row.vendor_extended.surname}</>
    )
};

const PurchaserExtendedProvider = props => (
    <DataTypeProvider formatterComponent={PurchaserExtended} {...props}/>
);

// invoice row - creator name
const CreatorName = ({row}) => {
    return (
        <>{row.user.name}</>
    )
};

const CreatorNameProvider = props => (
    <DataTypeProvider formatterComponent={CreatorName} {...props}/>
);

// surname
const CreatorSurname = ({row}) => {
    return (
        <>{row.user.surname}</>
    )
};

const CreatorSurnameProvider = props => (
    <DataTypeProvider formatterComponent={CreatorSurname} {...props}/>
);

const toLowerCase = value => String(value).toLowerCase();
const cityPredicate = (value, filter) => toLowerCase(value).startsWith(toLowerCase(filter.value));


export default function SaleTable(props) {


    const [columns] = useState([
        {name: 'id', title: 'ID'},
        {name: 'name', title: pulse.text.name},
        {name: 'surname', title: pulse.text.surname},
        {name: 'internal_invoice_number', title: pulse.text.invoice.internal_number},
        {name: 'invoice_number', title: pulse.text.invoice.invoice_number},
        // {name: 'description', title: pulse.text.invoice.invoice_desc},
        {name: 'hours_value', title: pulse.text.invoice.hours_value},
        {name: 'hours_value_netto', title: pulse.text.invoice.hours_value_netto},
        {name: 'hours_value_gross', title: pulse.text.invoice.hours_value_gross},
        {name: 'issue_date', title: pulse.text.invoice.issue_date},
        {name: 'payment_date', title: pulse.text.invoice.payment_date},
        {name: 'purchaser_extended', title: pulse.text.invoice.purchaser},
        // {name: 'approval', title: pulse.text.invoice.approval},
        {name: 'status', title: 'Status', dataType: 'boolean'},
        // {name: 'actions', title: 'Akcje'},
    ]);

    const [rows, setRows] = useState([]);

    const [pageSizes] = useState([5, 10, 15, 0]);

    const [dateColumns] = useState(['issue_date', 'payment_date']);
    const [tableColumnExtensions] = useState([
        {columnName: 'status', width: 200},
        {columnName: 'id', width: 70},
        {columnName: 'internal_invoice_number', width: 150}]
    );

    const [leftColumns] = useState(['id', 'internal_invoice_number']);
    const [rightColumns] = useState(['status']);
    const [booleanColumns] = useState(['status']);
    const [numberLink] = useState(['internal_invoice_number']);
    const [textRow] = useState(['name']);
    const [textRow2] = useState(['surname']);
    const [purchaser_extended] = useState(['purchaser_extended']);
    const [integratedFilteringColumnExtensions] = useState([
        {columnName: 'name', predicate: cityPredicate},
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
        await pulse.invoices.getMyInvoices({
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
        fetchNewInvoices();
    }, [currentPage]);

    return (
        <React.Fragment>
            <div style={{textAlign: 'right'}}>
                {props.newItem && <NewInvoiceButton/>}
            </div>
            <Paper>
                <TableRowOptions el={rows[selection]}/>
                <Grid
                    rows={rows}
                    columns={columns}>
                    <DragDropProvider/>
                    <CreatorNameProvider
                        for={textRow}
                    />
                    <PurchaserExtendedProvider
                        for={purchaser_extended}
                    />
                    <CreatorSurnameProvider
                        for={textRow2}
                    />
                    <BooleanTypeProvider
                        for={booleanColumns}
                    />
                    <SearchState/>
                    <PagingState
                        currentPage={currentPage}
                        onCurrentPageChange={setCurrentPage}
                        pageSize={pageSize}
                    />

                    <CustomPaging
                        totalCount={totalCount}
                    />
                    <SortingState
                        defaultSorting={[
                            {columnName: 'id', direction: 'desc'},
                        ]}
                    />
                    <DateTypeProvider
                        for={dateColumns}
                    />
                    <LinkGeneratorProvider
                        for={numberLink}
                    />
                    <FilteringState/>
                    <IntegratedSorting/>
                    <SelectionState
                        selection={selection}
                        onSelectionChange={selectedItem => changeSelection(selectedItem, rows)}
                    />
                    <IntegratedFiltering columnExtensions={integratedFilteringColumnExtensions}/>
                    {/* TABLE */}
                    <DragDropProvider/>
                    <Table
                        columnExtensions={tableColumnExtensions}
                    />
                    <TableSelection
                        selectByRowClick
                        highlightRow
                        showSelectionColumn={false}
                    />
                    <TableColumnReordering
                        order={columnOrder}
                        onOrderChange={nextOrder => setColumnOrderFn(nextOrder)}
                    />
                    {/* TABLE */}
                    <TableHeaderRow showSortingControls/>
                    <TableFilterRow showFilterSelector={true}/>
                    <TableFixedColumns
                        leftColumns={leftColumns}
                        rightColumns={rightColumns}
                    />
                    <PagingPanel/>
                    <TableColumnVisibility
                        defaultHiddenColumnNames={''}
                    />
                </Grid>
            </Paper>
        </React.Fragment>
    );
}