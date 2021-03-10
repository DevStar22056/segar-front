import React, {useEffect, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import {
    CustomPaging,
    FilteringState,
    IntegratedFiltering,
    IntegratedPaging,
    IntegratedSorting,
    PagingState,
    SearchState,
    SelectionState,
    SortingState,
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
    TableSelection,
} from '@devexpress/dx-react-grid-material-ui';
import pulse from "../../pulse";
import FullScreenDialog from "./dialog";
import EditForm from "./editForm";
// import TableRowOptions from "./TableRowOptions";


const toLowerCase = value => String(value).toLowerCase();
const cityPredicate = (value, filter) => toLowerCase(value).startsWith(toLowerCase(filter.value));

export default function Sellers() {

    const [columns] = useState([
        {name: 'id', title: 'ID'},
        {name: 'title', title: 'Nazwa'},
        {name: 'nip', title: 'NIP'},
        {name: 'company_name', title: 'Nazwa firmy'},
        {name: 'city', title: 'Miasto'},
        {name: 'regon', title: 'REGON'},
        {name: 'currency', title: 'Waluta'}
    ]);

    const [leftColumns] = useState([]);

    const [rightColumns] = useState([]);

    const [rows, setRows] = useState([]);

    const [tableColumnExtensions] = useState([
        {columnName: 'title', wordWrapEnabled: true},
        {columnName: 'company_name', wordWrapEnabled: true},
    ]);

    const [integratedFilteringColumnExtensions] = useState([
        {columnName: 'name', predicate: cityPredicate},
        {columnName: 'id', filteringEnabled: false}
    ]);

    const [selection, setSelection] = useState([]);
    const [columnOrder, setColumnOrder] = useState(JSON.parse(window.localStorage.getItem('sellers_table')) || ['id', 'title', 'nip', 'company_name', 'city', 'description', 'regon', 'currency']);

    /**
     * row selection
     *  */
    const changeSelection = selectedItem => {
        const lastSelected = selectedItem.find(selectedItem => selection.indexOf(selectedItem) === -1);
        if (lastSelected !== undefined) setSelection([lastSelected])
    };

    const setColumnOrderFn = nextOrder => {
        localStorage.setItem("sellers_table", JSON.stringify(nextOrder));
        setColumnOrder(nextOrder)
    };

    /**
     * pagination
     **/
    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);

    async function getSellers() {
        await pulse.sellers.getSellers({
            page: currentPage + 1
        })
            .then(res => res)
            .then(res => {
                // console.log(res)
                setRows(res.data);
                setTotalCount(res.total);
                setPageSize(res.per_page);
                // setLoading(false);
            });
    }

    useEffect(() => {
        getSellers();
    }, [currentPage]);

    // React.useEffect(() => {
    //     getSellers();
    // }, []);

    return (
        <>

            <Paper>
                <FullScreenDialog/>
                {/*<TableRowOptions el={rows[selection]}/>*/}
                <Grid
                    rows={rows}
                    columns={columns}>
                    <DragDropProvider/>
                    {/*<CreatorNameProvider*/}
                    {/*    for={textRow}*/}
                    {/*/>*/}
                    {/*<CreatorSurnameProvider*/}
                    {/*    for={textRow2}*/}
                    {/*/>*/}
                    {/*<BooleanTypeProvider*/}
                    {/*    for={booleanColumns}*/}
                    {/*/>*/}
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
                    {/*<DateTypeProvider*/}
                    {/*    for={dateColumns}*/}
                    {/*/>*/}
                    {/*<LinkGeneratorProvider*/}
                    {/*    for={numberLink}*/}
                    {/*/>*/}
                    <FilteringState/>
                    {/*<IntegratedPaging/>*/}
                    <IntegratedSorting/>
                    <IntegratedFiltering columnExtensions={integratedFilteringColumnExtensions}/>
                    {/* TABLE */}
                    <SelectionState
                        selection={selection}
                        onSelectionChange={selectedItem => changeSelection(selectedItem, rows)}
                    />
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
                {selection.length > 0 && <EditForm seller_id={rows[selection].id}/>}
            </Paper>
        </>
    );
};