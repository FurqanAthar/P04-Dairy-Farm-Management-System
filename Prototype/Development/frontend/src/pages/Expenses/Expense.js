import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
    Col,
    Row,
    InputGroup,
    Container,
    Modal,
    Button,
    Form,
    FormControl,
} from "react-bootstrap";
import Select from "react-select";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { useHistory, Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { inventoryMetrics } from "../../constants/options";
import SearchIcon from "../../assets/images/icons/search.svg";
import { filterTableStyles } from "../../assets/styledComponents/tableStyles";
import { filterTableSelectStyles } from "../../assets/styledComponents/selectStyles";
import { getInvoiceData } from "../../actions/expenseActions";

function Expense(props) {
    // variables and states to handle fields
    let history = useHistory();
    const [, forceUpdate] = useState();
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const handleCategoryComponent = useCallback((state) => handleRowClick(state));

    // columns to display on data table
    const columns = [
        {
        name: "Invoice No",
        selector: "number",
        sortable: true,
        cell: (row) => <div>{row.name}</div>,
        },
        {
        name: "Date",
        selector: "date",
        cell: (row) => <div>{row.description}</div>,
        },
        {
        name: "Total Items",
        selector: "items",
        sortable: true,
        cell: (row) => <div>{row.items.length}</div>,
        },
        {
        name: "Total Amount",
        selector: "amount",
        cell: (row) => <div> {row.metric} </div>,
        },
    ];

    // filters field to filter data
    const [filters, setFilters] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
        metric: "",
        itemsCount: 0,
        search: "",
        }
    );

    useEffect(() => {
        getInvoices();
    }, []);

    useEffect(() => {
        if (!props.inventoryCategories.loading) {
        if (props.inventoryCategories.success) {
            console.log(props.inventoryCategories.inventory);
            setCategories(props.inventoryCategories.inventory);
        }
        }
    }, [props.inventoryCategories]);

    useEffect(() => {
        console.log(categories);
    }, [categories]);

    //   When filter changes, this function will be called
    useEffect(() => {
        let dataCopy = categories;
        let filteredDataCopy = [];

        // Filtering based on status
        if (filters.metric) {
        dataCopy.forEach((c, idx) => {
            if (c.metric == filters.metric) {
            filteredDataCopy.push(c);
            }
        });
        dataCopy = [...filteredDataCopy];
        filteredDataCopy = [];
        }

        // performing search based on category name and description
        if (filters.search) {
        let searchField = filters.search.toLowerCase();
        dataCopy.forEach((c, idx) => {
            let check = false;
            if (c.name) {
            if (c.name.toLowerCase().includes(searchField)) {
                check = true;
            }
            }
            if (c.description) {
            if (c.description.toLowerCase().includes(searchField)) {
                check = true;
            }
            }
            if (check) {
            filteredDataCopy.push(c);
            }
        });
        dataCopy = [...filteredDataCopy];
        filteredDataCopy = [];
        }
        setFilteredCategories([...dataCopy]);
    }, [filters]);

    // Default function to call action function to fetch categories
    async function getInvoices() {
        await props.getInvoiceData();
    }

    // when any row will be clicked in the table
    const handleRowClick = (row) => {
        console.log(row);
        history.push(`/inventory/category/${row._id}`);
    };

    // function to change filter fields
    const handleFilter = (index, e, eTarget = null) => {
        let filtersCopy = filters;
        if (index === "search") {
        filtersCopy[index] = e.target.value;
        } else {
        if (e) {
            filtersCopy[index] = e.value;
        } else {
            filtersCopy[index] = "";
        }
        }
        setFilters({ ...filtersCopy });
    };

    // checking if any filter fields are filled or all are empty
    // then displaying data on the basis of that
    const filtersIsSet = () => {
        let set = false;
        Object.keys(filters).forEach((k, idx) => {
        if (filters[k]) {
            set = true;
        }
        });
        return set;
    };

    const handleDatepickerFocus = (e) => {
        e.target.parentNode.parentNode.parentNode.classList.add("active");
    };
    const handleDatepickerBlur = (e) => {
        e.target.parentNode.parentNode.parentNode.classList.remove("active");
    };

    const FilterComponent = ({}) => (
        <div className="d-flex align-items-center justify-content-between tableHead">
        <div className="table-filters">
            <Form.Group className="mb-0">
            <Select
                styles={filterTableSelectStyles}
                options={inventoryMetrics}
                placeholder="Metrics"
                isClearable={true}
                onChange={(e) => handleFilter("metric", e)}
                value={inventoryMetrics.find((s) => {
                return s.value === filters.metric;
                })}
            />
            </Form.Group>
        </div>
        <div className="table-filters justify-content-end">
            <InputGroup>
            <Form.Control
                type="text"
                autoFocus={true}
                id="search_field"
                name="search_field"
                placeholder="Search"
                value={filters.search}
                onFocus={(e) => e.target.parentNode.classList.add("active")}
                onBlur={(e) => {
                e.target.parentNode.classList.remove("active");
                }}
                onChange={(e) => handleFilter("search", e)}
            />
            <InputGroup.Append>
                <InputGroup.Text>
                <img src={SearchIcon} />
                </InputGroup.Text>
            </InputGroup.Append>
            </InputGroup>
        </div>
        </div>
    );

    const subHeaderComponentMemo = React.useMemo(() => {
        return <FilterComponent />;
    }, [props.inventoryCategories, filters]);

    return (
        <div className="animals-page mt-4 mb-4">
        <Container>
            <div>
            <div className="d-flex mb-4 justify-content-center">
                Expenses
            </div>

            {/* Button to Modal for adding new category */}
            <div className="d-flex mb-4 justify-content-end">
                <Link to="/expense/addInvoice">
                    <Button variant="primary">
                        New Invoice
                    </Button>
                </Link>
            </div>

            {/* Table to display all categories in inventory */}
            <Container>
                <DataTable
                customStyles={filterTableStyles}
                responsive
                fixedHeader={true}
                columns={columns}
                data={filtersIsSet() ? filteredCategories : categories}
                onRowClicked={handleCategoryComponent}
                subHeader
                subHeaderComponent={subHeaderComponentMemo}
                pagination
                persistTableHead
                />
            </Container>

            </div>
        </Container>
        </div>
    );
}

const mapDispatchToProps = (dispatch) => {
    return {
        getInvoiceData: (data) => dispatch(getInvoiceData(data)),
    };
};

const mapStateToProps = (state) => {
    return {
        login: state.login,
        inventoryCategories: state.farm.inventory,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Expense);
