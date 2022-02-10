import React, { useEffect, useReducer, useCallback, useState } from "react";
import { connect } from "react-redux";
import { getAnimals } from "../../actions/farmActions";
import {
  Container,
  Button,
  Form,
  InputGroup,
  FormControl,
  Nav
} from "react-bootstrap";
import moment from "moment";
import Select from "react-select";
import DatePicker from "react-datepicker";
import {NavLink, useHistory } from "react-router-dom";
import DataTable from "react-data-table-component";
import TrashIcon from "../../assets/images/icons/trash.svg";
import SearchIcon from "../../assets/images/icons/search.svg";
import { filterTableStyles } from "../../assets/styledComponents/tableStyles";
import { filterTableSelectStyles } from "../../assets/styledComponents/selectStyles";
import { deleteAnimal } from "../../services/apiServices";
import { toast } from "react-toastify";
import { animalStatuses, animalTypes } from "../../constants/options";
import PlusIcon from "../../assets/images/icons/plusicon.svg";
import { getMilkProductionRecords } from '../../services/apiServices';



function MilkProduction(props) {
  let history = useHistory();
  let prod="none";
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const handleAnimalComponent = useCallback((state) => handleRowClick(state));
  const [filters, setFilters] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      status: "",
      type: "",
      dob: "",
      search: "",
    }
  );

  const handleRowClick = (row) => {
    history.push({
      pathname: `/milk-records/${row._id}`,
      state: {
        data: row,
      },
    });
  };

  const [record, setRecord] = useState("")
  useEffect(() => {
    async function getAnimalsData() {
      await props.getAnimals();
      console.log(props.getAnimals())
      let records= await getMilkProductionRecords(props.login.loginInfo.token) 
      setRecord(records)
      console.log(records)
    }
 

    getAnimalsData();
    
  }, []);
  useEffect(() => {
    if (props.animals.animals) {
      setData(props.animals.animals.animalsData);
    }
  }, [props.animals]);

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
      name: "Tag:",
      selector: "tag",
      sortable: true,
    },
    // {
    //   name: "Type:",
    //   selector: "type",
    //   sortable: true,
    //   cell: (row) => <div>{row.type}</div>,
    // },
    {
      name: "Morning Production in Litres",
      selector: "Morning",
      sortable: true,
      cell: (row) => (
      
          record.data? record.data.milkRecords.map((milk)=>{
          return(
              <div>
                  { prod=Object.keys(milk.record).map((key) => {
                      return (


                        row._id=== key?
                        moment(row.dob).format("MM/DD/YYYY")===moment(milk.date).format("MM/DD/YYYY")? milk.record[key].morning:""
        
                        :"")
                  }
                  
                  )
                  }
              </div>
              )
          

        }) :"no record"
      
      ),
    },
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
              row.status === "Sold" || row.status === "Sent to approval"
                ? "badge badge-info mr-2"
                : row.status === "Dead"
                ? "badge badge-danger mr-2"
                : "badge badge-success mr-2"
            }
          >
            {row.status}
          </div>
          <Button
            className="btn-icon m-0"
            variant="outline-light"
            onClick={() => deleteAnimalById(row._id)}
          >
            <img src={TrashIcon} alt="Trash Icon" className="icon-black" />
          </Button>
        </div>
      ),
    },
  ];

  const deleteAnimalById = async (id) => {
    let result = await deleteAnimal({ id }, props.login.loginInfo.token);
    if (result.data.success) {
      toast.success(result.data.message);
      props.getAnimals();
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
  }, [filters]);

  const FilterComponent = ({}) => (
    <div className="d-flex align-items-center justify-content-between tableHead">
      <div className="table-filters">
        <Form.Group className="mb-0">
          <Select
            styles={filterTableSelectStyles}
            options={animalStatuses}
            placeholder="Status"
            isClearable={true}
            onChange={(e) => handleFilter("status", e)}
            value={animalStatuses.find((s) => {
              return s.value === filters.status;
            })}
          />
        </Form.Group>
        <Form.Group className="mb-0">
          <Select
            styles={filterTableSelectStyles}
            options={animalTypes}
            placeholder="Type"
            isClearable={true}
            onChange={(e) => handleFilter("type", e)}
            value={animalTypes.find((t) => {
              return t.value === filters.type;
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
                  eventKey="5"
                  to="/milk-records/add"
                >
                  <div className="icon">
                    <img src={PlusIcon} alt="Icon Image" />
                    {"    "}
                    Add Milk Production
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
  }, [props.animals.animalsData, filters]);

  return (

    
    <div className="animals-page mt-4 mb-4">
      {console.log("theere is",prod)}
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
    getAnimals: (data) => dispatch(getAnimals(data)),
  };
};
const mapStateToProps = (state) => {
  return {
    login: state.login,
    animals: state.farm.animals,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MilkProduction);
