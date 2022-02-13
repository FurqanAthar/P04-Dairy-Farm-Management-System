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
import { useHistory } from "react-router-dom";
import DataTable from "react-data-table-component";
import SimpleReactValidator from "simple-react-validator";
import { inventoryMetrics } from "../../constants/options";
import TrashIcon from "../../assets/images/icons/trash.svg";
import SearchIcon from "../../assets/images/icons/search.svg";
import { customRoleControlStyles } from "../../constants/designs";
import { addInventoryCategory } from "../../services/apiServices";
import { getInventoryCategories } from "../../actions/inventoryActions";
import AccountModalImage from "../../assets/images/accountsecuritymodal.jpg";
import { filterTableStyles } from "../../assets/styledComponents/tableStyles";
import { filterTableSelectStyles } from "../../assets/styledComponents/selectStyles";

function Inventory(props) {
  // variables and states to handle fields
  let history = useHistory();
  const [, forceUpdate] = useState();
  const [validator] = useState(new SimpleReactValidator());

  const [disabled, setDisabled] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const handleCategoryComponent = useCallback((state) => handleRowClick(state));

  // columns to display on data table
  const columns = [
    {
      name: "Name",
      selector: "name",
      sortable: true,
      cell: (row) => <div>{row.name}</div>,
    },
    {
      name: "Description",
      selector: "description",
      cell: (row) => (
        <div>
          {row.description.slice(0, 35) +
            (row.description.length > 35 ? "..." : "")}
        </div>
      ),
    },
    {
      name: "Total items",
      selector: "items",
      sortable: true,
      cell: (row) => <div>{row.items.length}</div>,
    },
    {
      name: "Metric",
      selector: "metric",
      cell: (row) => (
        <div className="d-flex align-items-center w-100 q-status-section justify-content-end">
          <div
            className={
              row.metric === inventoryMetrics[1].value
                ? "badge badge-info mr-2"
                : row.metric === inventoryMetrics[0].value
                ? "badge badge-light mr-2"
                : "badge badge-success mr-2"
            }
          >
            {row.metric}
          </div>
        </div>
      ),
    },
  ];
  // category form to add new categries
  const [categoryForm, setCategoryForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      name: "",
      description: "",
      metric: "",
    }
  );
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
    getCategoriesData();
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
  async function getCategoriesData() {
    await props.getInventoryCategories();
  }

  // when any row will be clicked in the table
  const handleRowClick = (row) => {
    console.log(row);
    history.push(`/inventory/category/${row._id}`);
  };

  //   handling functions for category form fields
  const handleNewCategoryInputs = (evt) => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setCategoryForm({ [name]: newValue });
  };
  const handleNewCategoryMetric = (e) => {
    setCategoryForm({ ["metric"]: e.value });
  };

  //   API Call to add new category in inventory
  const submitNewCategory = async () => {
    setDisabled(true);
    if (!validator.allValid()) {
      validator.showMessages();
      forceUpdate(1);
    } else {
      let result = await addInventoryCategory(
        categoryForm,
        props.login.loginInfo.token
      );
      //   closing the modal and setting form fields empty
      if (result.data.success) {
        getCategoriesData();
        setShowCategoryModal(false);
        setCategoryForm({ ["name"]: "", ["description"]: "", ["metric"]: "" });
        toast.success("Category Added Into Your Inventory!");
      } else {
        toast.error(result.data.message);
      }
    }
    setDisabled(false);
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
            {/* <h2>INVENTORY</h2> */}
          </div>

          {/* Button to Modal for adding new category */}
          <div className="d-flex mb-4 justify-content-end">
            <Button
              variant="primary"
              onClick={() => {
                setShowCategoryModal(true);
              }}
            >
              Add New Category
            </Button>
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

          {/* Modal to add new category */}
          <Modal
            animation={false}
            className="account-settings-modal"
            size="sm"
            centered
            show={showCategoryModal}
            onHide={() => {
              setShowCategoryModal(false);
            }}
          >
            <Modal.Header
              closeButton
              onClick={() => {
                setShowCategoryModal(false);
              }}
            ></Modal.Header>
            <Modal.Body>
              <div className="details">
                <div className="icon">
                  <img src={AccountModalImage} alt="Icon Image" />
                </div>

                <div className="title">Add Category</div>
                <Form.Group>
                  <Form.Label>Category Name</Form.Label>
                  <FormControl
                    id="name"
                    name="name"
                    value={categoryForm.name}
                    onChange={handleNewCategoryInputs}
                  />
                  {validator.message("name", categoryForm.name, "required", {
                    className: "text-danger",
                  })}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <FormControl
                    id="description"
                    name="description"
                    value={categoryForm.description}
                    onChange={handleNewCategoryInputs}
                  />
                  {validator.message(
                    "description",
                    categoryForm.description,
                    "required",
                    {
                      className: "text-danger",
                    }
                  )}
                </Form.Group>
                <Form.Label>Metric</Form.Label>
                <Select
                  className="select-menu"
                  options={inventoryMetrics}
                  styles={customRoleControlStyles}
                  value={{
                    label: categoryForm.metric,
                    value: categoryForm.metric,
                  }}
                  name="metric"
                  onChange={(e) => {
                    handleNewCategoryMetric(e);
                  }}
                />
                {validator.message("metric", categoryForm.metric, "required", {
                  className: "text-danger",
                })}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline-light"
                onClick={() => {
                  setShowCategoryModal(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={submitNewCategory}
                disabled={disabled}
              >
                Add
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        ;
      </Container>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    getInventoryCategories: (data) => dispatch(getInventoryCategories(data)),
  };
};

const mapStateToProps = (state) => {
  return {
    login: state.login,
    inventoryCategories: state.farm.inventory,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Inventory);
