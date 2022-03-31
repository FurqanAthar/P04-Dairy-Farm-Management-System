import React, { useEffect, useReducer, useCallback, useState } from "react";
import { connect } from "react-redux";
import { getCustomers } from "../../actions/customerAction";
import {
  Container,
  Button,
  Form,
  InputGroup,
  FormControl,
  Nav,
} from "react-bootstrap";
import moment from "moment";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { NavLink,useHistory } from "react-router-dom";
import DataTable from "react-data-table-component";
import TrashIcon from "../../assets/images/icons/trash.svg";
import SearchIcon from "../../assets/images/icons/search.svg";
import { filterTableStyles } from "../../assets/styledComponents/tableStyles";
import { filterTableSelectStyles } from "../../assets/styledComponents/selectStyles";
import { deleteCustomer } from "../../services/apiServices";
import { toast } from "react-toastify";
import PlusIcon from "../../assets/images/icons/plusicon.svg";
import { customerStatuses } from "../../constants/customerOptions";


function Customers(props) {
  let history = useHistory();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const handleAnimalComponent = useCallback((state) => handleRowClick(state));
  const [filters, setFilters] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      status: "",
      dob: "",
      search: "",
    }
  );
  console.log("fired up")
  const handleRowClick = (row) => {
    history.push({
      pathname: `/customer/${row._id}`,
      state: {
        data: row,
      },
    });
  };

  useEffect(() => {
    async function getCustomersData() {
      await props.getCustomers();
    }
    getCustomersData();
    
  }, []);
  useEffect(() => {
    if (props.customers.customers) {
      setData(props.customers.customers.customersData);
    }
  }, [props.customers]);

  const handleDatepickerFocus = (e) => {
    e.target.parentNode.parentNode.parentNode.classList.add("active");
  };
  const handleDatepickerBlur = (e) => {
    e.target.parentNode.parentNode.parentNode.classList.remove("active");
  };

  // checking if any filter is set or not
  const filtersIsSet = () => {
    let set = false;
    Object.keys(filters).forEach((k, idx) => {
      if (filters[k]) {
        set = true;
      }
    });
    return set;
  };

  const columns = [
    {
      name: "Name:",
      selector: "name",
      sortable: true,
      cell: (row) => (
        <div className="d-flex align-items-center">
          {row && row.image ? (
            <>
              <div className="generic-user-pic">
                <div className="user-pic">
                  <img src={row.image} alt="Image" />
                </div>
              </div>
              {row.name}
            </>
          ) : row && row.name ? (
            <>
              <div className="team-name-short mr-2">
                {row.name.replace(/[^a-zA-Z-0-9 ]/g, "").match(/\b\w/g)}
              </div>
              {row.name} {row.name}
            </>
          ) : null}
        </div>
      ),
    },
    {
      name: "Date of Birth",
      selector: "dob",
      sortable: true,
      cell: (row) => moment(row.dob).format("MM/DD/YYYY"),
    },
    {
      name: "Status:",
      selector: "status",
      cell: (row) => (
        <div className="d-flex align-items-center w-100 q-status-section justify-content-end">
          <div
            className={
              row.status === "Active" || row.status === "Sent to approval"
                ? "badge badge-info mr-2"
                : row.status === "Inactive"
                ? "badge badge-danger mr-2"
                : "badge badge-success mr-2"
            }
          >
            {row.status}
          </div>
          <Button
            className="btn-icon m-0"
            variant="outline-light"
            onClick={() => deleteCustomerById(row._id)}
          >
            <img src={TrashIcon} alt="Trash Icon" className="icon-black" />
          </Button>
        </div>
      ),
    },
  ];

  const deleteCustomerById = async (id) => {
    let result = await deleteCustomer({ id }, props.login.loginInfo.token);
    if (result.data.success) {
      toast.success(result.data.message);
      props.getCustomers();
    } else {
      toast.error(result.data.message);
    }
  };

  const handleFilter = (index, e, eTarget = null) => {
    let filtersCopy = filters;
    if (index === "dob") {
      filtersCopy[index] = e;
      eTarget.target.closest(".input-group").classList.remove("active");
    } else if (index === "search") {
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

  useEffect(() => {
    console.log("filters", filters);
    let dataCopy = data;
    let filteredDataCopy = [];

    // Filtering based on status
    if (filters.status) {
      dataCopy.forEach((c, idx) => {
        if (c.status == filters.status) {
          filteredDataCopy.push(c);
        }
      });
      dataCopy = [...filteredDataCopy];
      filteredDataCopy = [];
    }

    if (filters.type) {
      dataCopy.forEach((c, idx) => {
        if (c.type == filters.type) {
          filteredDataCopy.push(c);
        }
      });
      dataCopy = [...filteredDataCopy];
      filteredDataCopy = [];
    }

    if (filters.dob) {
      dataCopy.forEach((c, idx) => {
        if (
          moment(c.dob).format("MM/DD/YYYY") ==
          moment(filters.dob).format("MM/DD/YYYY")
        ) {
          filteredDataCopy.push(c);
        }
      });
      dataCopy = [...filteredDataCopy];
      filteredDataCopy = [];
    }

    if (filters.search) {
      let searchField = filters.search.toLowerCase();
      dataCopy.forEach((c, idx) => {
        let check = false;
        if (c.name) {
          if (c.name.toLowerCase().includes(searchField)) {
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
    
    setFilteredData([...dataCopy]);
    {console.log("it comes here",...dataCopy)}
  }, [filters]);

  const FilterComponent = ({}) => (
    <div className="d-flex align-items-center justify-content-between tableHead">
      <div className="table-filters">
        <Form.Group className="mb-0">
          <Select
            styles={filterTableSelectStyles}
            options={customerStatuses}
            placeholder="Status"
            isClearable={true}
            onChange={(e) => handleFilter("status", e)}
            value={customerStatuses.find((s) => {
              return s.value === filters.status;
            })}
          />
        </Form.Group>
        <Form.Group className="datepicker mb-0">
          <InputGroup className={"input-group"}>
            <InputGroup.Prepend>
              <InputGroup.Text className="">
                <span className="icon"></span>
              </InputGroup.Text>
            </InputGroup.Prepend>
            <DatePicker
              selected={filters.dob}
              isClearable={true}
              // minDate={new Date()}
              className="datepicker-form-control"
              onChange={(date, e) => handleFilter("dob", date, e)}
              onFocus={handleDatepickerFocus}
              onBlur={handleDatepickerBlur}
            />
          </InputGroup>
        </Form.Group>
      </div>
      <Button>
      <Nav.Link
                  as={NavLink}
                  className="btn-primary"
                  eventKey="7"
                  to="/customer/add"
                >
                  <div className="icon">
                    <img src={PlusIcon} alt="Icon Image" />
                    {"    "}
                    Add Customer
                  </div>
                  
                  
      </Nav.Link>
      </Button>
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
  }, [props.customers.customersData, filters]);

  return (
    <div className="animals-page mt-4 mb-4">
      <Container>
        <DataTable
          customStyles={filterTableStyles}
          responsive
          fixedHeader={true}
          columns={columns}
          data={filtersIsSet() ? filteredData : data}
          onRowClicked={handleAnimalComponent}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          pagination
          persistTableHead
        />
     
      </Container>
    
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCustomers: (data) => dispatch(getCustomers(data)),
  };
};
const mapStateToProps = (state) => {
  return {
    login: state.login,
    customers: state.customer.customers,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Customers);
