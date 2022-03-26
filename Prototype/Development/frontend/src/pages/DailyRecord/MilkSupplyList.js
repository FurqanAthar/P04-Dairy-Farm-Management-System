import React, { useEffect, useReducer, useCallback, useState } from "react";
import { connect } from "react-redux";
import {
  Container,
  Button,
  Form,
  InputGroup,
  FormControl,
  Nav,
} from "react-bootstrap";
import { getMilkSupply } from "../../services/apiServices";
import moment from "moment";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { NavLink, useHistory } from "react-router-dom";
import DataTable from "react-data-table-component";
import TrashIcon from "../../assets/images/icons/trash.svg";
import SearchIcon from "../../assets/images/icons/search.svg";
import PlusIcon from "../../assets/images/icons/plusicon.svg";
import { filterTableStyles } from "../../assets/styledComponents/tableStyles";
import { filterTableSelectStyles } from "../../assets/styledComponents/selectStyles";

function MilkSupplyList(props) {
  let history = useHistory();
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const handleSupplyComponent = useCallback((state) => handleRowClick(state));
  const [filters, setFilters] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      date: "",
    }
  );

  const handleRowClick = (row) => {
    history.push({
      pathname: `/milk-supply/${row._id}`,
      state: {
        data: row,
      },
    });
  };

  useEffect(() => {
    async function getSuppliesData() {
      let result = await getMilkSupply(props.login.loginInfo.token);
      if (result.data.success) {
        setData([...result.data.data]);
      }
    }
    getSuppliesData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      let sortedDataTemp = data;
      sortedDataTemp.sort(function (a, b) {
        var dateA = new Date(a.date),
          dateB = new Date(b.date);
        return dateA - dateB;
      });
      sortedDataTemp.reverse();
      setSortedData([...sortedDataTemp]);
    }
  }, [data]);

  useEffect(() => {
    let dataCopy = sortedData;
    let filteredDataCopy = [];

    // Filtering based on status
    if (filters.date) {
      dataCopy.forEach((c, idx) => {
        if (
          moment(c.date).format("MM/DD/YYYY") ==
          moment(filters.date).format("MM/DD/YYYY")
        ) {
          filteredDataCopy.push(c);
        }
      });
      dataCopy = [...filteredDataCopy];
      filteredDataCopy = [];
    }
    setFilteredData([...dataCopy]);
  }, [filters]);

  const columns = [
    {
      name: "Date",
      selector: "date",
      sortable: true,
      cell: (row) => (
        <div className="badge badge-info">
          {moment(row.date).format("MM/DD/YYYY")}
        </div>
      ),
    },
    {
      name: "Quantity Supplied:",
      selector: "totalQuantitySupplied",
      sortable: true,
    },
    {
      name: "Quantity Wasted:",
      selector: "waste.quantity",
      sortable: true,
      cell: (row) => row.waste.quantity,
    },
    {
      name: "Sales:",
      selector: "totalRevenue",
      sortable: true,
      cell: (row) => (
        <div className="badge badge-success">{row.totalRevenue}</div>
      ),
    },
    {
      name: "Customers:",
      selector: "customers",
      sortable: true,
      cell: (row) => (
        <div className="d-flex align-items-center">
          <div className="team-name-short mr-2">{row.customers.length}</div>
        </div>
      ),
    },

    {
      name: "",
      // selector: "status",
      cell: (row) => (
        <div className="d-flex align-items-center w-100 q-status-section justify-content-end">
          <Button
            className="btn-icon m-0"
            variant="outline-light"
            // onClick={() => deleteAnimalById(row._id)}
          >
            <img src={TrashIcon} alt="Trash Icon" className="icon-black" />
          </Button>
        </div>
      ),
    },
  ];

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

  const handleFilter = (index, e, eTarget = null) => {
    let filtersCopy = filters;
    if (index === "date") {
      filtersCopy[index] = e;
      eTarget.target.closest(".input-group").classList.remove("active");
    }
    setFilters({ ...filtersCopy });
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
        <Form.Group className="datepicker mb-0">
          <InputGroup className={"input-group"}>
            <InputGroup.Prepend>
              <InputGroup.Text className="">
                <span className="icon"></span>
              </InputGroup.Text>
            </InputGroup.Prepend>
            <DatePicker
              selected={filters.date}
              isClearable={true}
              className="datepicker-form-control"
              onChange={(date, e) => handleFilter("date", date, e)}
              onFocus={handleDatepickerFocus}
              onBlur={handleDatepickerBlur}
            />
          </InputGroup>
        </Form.Group>
      </div>

      <Button onClick={() => history.push("/milk-supply/add")}>
        <img src={PlusIcon} alt="Icon Image" /> <span>Add Supply Record</span>
      </Button>

      {/* <div className="table-filters justify-content-end">
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
      </div> */}
    </div>
  );

  const subHeaderComponentMemo = React.useMemo(() => {
    return <FilterComponent />;
  }, [data, filters]);

  return (
    <div className="animals-page mt-4 mb-4">
      <Container>
        <DataTable
          customStyles={filterTableStyles}
          responsive
          fixedHeader={true}
          columns={columns}
          data={filtersIsSet() ? filteredData : sortedData}
          onRowClicked={handleSupplyComponent}
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
  return {};
};
const mapStateToProps = (state) => {
  return {
    login: state.login,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MilkSupplyList);
