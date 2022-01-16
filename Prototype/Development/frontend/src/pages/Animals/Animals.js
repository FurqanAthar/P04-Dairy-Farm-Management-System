import React, { useEffect, useReducer, useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { getAnimals } from '../../actions/farmActions'
import {
  Container,
  Button,
  Form,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import moment from "moment";
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { useHistory } from 'react-router-dom'
import DataTable from "react-data-table-component";
import TrashIcon from "../../assets/images/icons/trash.svg";
import SearchIcon from "../../assets/images/icons/search.svg";
import { filterTableStyles } from '../../assets/styledComponents/tableStyles';
import { filterTableSelectStyles } from "../../assets/styledComponents/selectStyles";
import { deleteAnimal } from '../../services/apiServices';
import { toast } from 'react-toastify';

function Animals(props) {

  let history = useHistory();
  const [data, setData] = useState([])
  const handleAnimalComponent = useCallback((state) => handleRowClick(state));
  const [filters, setFilters] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      
    }
    );
    
  const handleRowClick = (row) => {
    history.push({
      pathname: `/animals/${row._id}`,
      state: {
        data: row,
      },
    });
  };

    useEffect(() => {
        async function getAnimalsData() {
            await props.getAnimals()
        }
        getAnimalsData()
    }, [])
    useEffect(() => {
      if (props.animals.animals) {
        setData(props.animals.animals.animalsData)
      }
    }, [props.animals])

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
      {
        name: "Type:",
        selector: "type",
        sortable: true,
        cell: (row) => <div>{row.type}</div>,
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
                row.status === "Non-Milking" ||
                row.status === "Sent to approval"
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
    }

    const FilterComponent = ({ }) => (
      <div className="d-flex align-items-center justify-content-between tableHead">
        <div className="table-filters">
          <Form.Group className="mb-0">
            <Select
              styles={filterTableSelectStyles}
              // options={statuses}
              placeholder="Status"
              isClearable={true}
              // onChange={(e) => handleFilter("status", e)}
              // value={statuses.find((s) => {
              //   return s.value === filters.status;
              // })}
            />
          </Form.Group>
          <Form.Group className="mb-0">
            <Select
              styles={filterTableSelectStyles}
              // options={teamData}
              placeholder="Team"
              isClearable={true}
              // onChange={(e) => handleFilter("team", e)}
              // value={teamData.find((t) => {
              //   return t.value === filters.team;
              // })}
            />
          </Form.Group>
          <Form.Group className="mb-0">
            <Select
              styles={filterTableSelectStyles}
              // options={members}
              placeholder="Member"
              isClearable={true}
              // onChange={(e) => handleFilter("member", e)}
              // value={members.find((m) => {
              //   return m.value === filters.member;
              // })}
            />
          </Form.Group>
          <Form.Group className="mb-0">
            <Select
              styles={filterTableSelectStyles}
              // options={revenues}
              placeholder="Revenue"
              isClearable={true}
              // onChange={(e) => handleFilter("revenue", e)}
              // value={revenues.find((r) => {
              //   return r.value === filters.revenue;
              // })}
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
                selected={filters.date}
                isClearable={true}
                // minDate={new Date()}
                className="datepicker-form-control"
                // onChange={(date, e) => handleFilter("date", date, e)}
                onFocus={handleDatepickerFocus}
                onBlur={handleDatepickerBlur}
              />
            </InputGroup>
          </Form.Group>
        </div>
        <div className="table-filters justify-content-end">
          <InputGroup>
            <Form.Control
              type="text"
              autoFocus={true}
              id="employee_only"
              name="employee_only"
              placeholder="Search"
              // value={filters.search}
              onFocus={(e) => e.target.parentNode.classList.add("active")}
              onBlur={(e) => {
                e.target.parentNode.classList.remove("active");
              }}
              // onChange={(e) =>
              //   setFilters({ ...filters, search: e.target.value })
              // }
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
      return (
        <FilterComponent
          // onFilter={(e) => setFilterText(e.target.value)}
          // filterText={filterText}
        />
      );
    }, [props.animals.animalsData]);


    return (
      <div className="animals-page mt-4 mb-4">
        <Container>
          <DataTable
            customStyles={filterTableStyles}
            responsive
            fixedHeader={true}
            columns={columns}
            data={data}
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

export default connect(mapStateToProps, mapDispatchToProps)(Animals);