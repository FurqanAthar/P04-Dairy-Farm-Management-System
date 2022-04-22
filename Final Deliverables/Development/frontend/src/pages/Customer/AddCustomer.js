import React, { useState, useEffect, useReducer } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import Select from "react-select";
import moment from "moment";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import SearchIcon from "../../assets/images/icons/search.svg";
import DatePicker from "react-datepicker";
import { filterTableStyles } from "../../assets/styledComponents/tableStyles";
import { addCustomer, updateCustomer } from "../../actions/customerAction";
import DataTable from "react-data-table-component";
import { useParams } from "react-router";
import SimpleReactValidator from "simple-react-validator";
import chevLeft from "../../assets/images/icons/cheveron-left.svg";
import axios from "axios";
import { getCustomerData, getRateList } from "../../services/apiServices";
import NewRateModal from "../../components/layouts/NewRateModal";

// need to fix the milk production
// testing for new issue branch and managing conflicts
const customRoleControlStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 50,
    background: state.isFocused ? "#fff" : "#fff",
    borderWidth: 1,
    borderRadius: "8px",
    borderColor: state.isFocused ? "#28a745" : "#E5E8F5",
    boxShadow: state.isFocused ? null : null,
    fontSize: "12px",
    "&:hover": {
      borderColor: state.isFocused ? "#28a745" : null,
    },
  }),
  dropdownIndicator: (base) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
    marginRight: "5px",
  }),
  menu: (base) => ({
    ...base,
    fontSize: "13px",
    border: "1px solid #f1f3f6",
    boxShadow: "none",
  }),
  option: (base, state) => ({
    ...base,
    background: state.isSelected ? "#f1f3f6" : "#fff",
    color: "#151B26",
    "&:hover": {
      background: "#f1f3f6",
      color: "#151B26",
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: "#A8B9CD",
  }),
  clearIndicator: (base) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
  }),
  indicatorSeparator: (base) => ({
    ...base,
    display: "none",
  }),
};

const AddCustomer = (props) => {
  const { id } = useParams();
  console.log(id, "id is :");
  const history = useHistory();
  const [image, setImage] = useState("");
  const [rateList, setRateList] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [supplyData, setSupplyData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [validator] = useState(new SimpleReactValidator());
  const [showNewRateModal, setShowNewRateModal] = useState(false);
  const [formInput, setFormInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      name: "",
      email: "",
      password: "",
      cnic: "",
      dob: "",
      status: "",
      type: "",
      sellingrate: 0,
      quantityperday: 0,
      address: "",
      image: "",
    }
  );

  const [filters, setFilters] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      date: "",
      search: "",
    }
  );

  const statuses = [
    { label: "active", value: "active" },
    { label: "Inactive", value: "Inactive" },
  ];
  const types = [
    { label: "Regular", value: "Regular" },
    { label: "Milkman", value: "Milkman" },
  ];

  const rates = [
    { label: "100", value: 100 },
    { label: "110", value: 110 },
    { label: "140", value: 140 },
  ];
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
      name: "Quantity Supplied Ltr(s):",
      selector: "milkSupplyQuantity",
      sortable: true,
    },
    {
      name: "Supply Rate (Per Ltr.):",
      selector: "milkSupplyRate",
      sortable: true,
    },
    {
      name: "Total (Rs.):",
      cell: (row) => (
        <div className="d-flex align-items-center w-100 q-status-section justify-content-end">
          <span className="badge badge-success">
            {parseFloat(row.milkSupplyQuantity) *
              parseFloat(row.milkSupplyRate)}
          </span>
        </div>
      ),
    },
  ];

  const handleInput = (evt) => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });
  };

  const handleSelect = (e, which) => {
    if (which == "type") {
      setFormInput({ ["type"]: e.value });
    } else if (which == "status") {
      setFormInput({ ["status"]: e.value });
    } else if (which == "date") {
      setFormInput({ ["dob"]: e });
    } else if (which == "sellingrate") {
      if (e.value == "add") {
        setShowNewRateModal(!showNewRateModal);
      } else {
        setFormInput({ ["sellingrate"]: e.value });
      }
    }
  };

  const handleAnimalImage = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post("/upload", formData, config);
      console.log(data);

      setImage(data);
      setFormInput({ ["image"]: data });
      setUploading(false);
    } catch (error) {
      toast.error("Image Upload Failed");
      setUploading(false);
    }
  };

  const handleDatepickerFocus = (e) => {
    e.target.parentNode.parentNode.parentNode.classList.add("active");
  };
  const handleDatepickerBlur = (e) => {
    e.target.parentNode.parentNode.parentNode.classList.remove("active");
  };

  const handleSubmit = async (e) => {
    console.log({ ...formInput });
    await props.addCustomer({ ...formInput });
    setDisabled(false);
  };

  const handleEdit = async (e) => {
    setDisabled(true);
    await props.updateCustomer({ ...formInput, id: id });
    setDisabled(false);
  };

  useEffect(async () => {
    let result = await getRateList(props.login.loginInfo.token);
    if (result.data.success) {
      let button = (
        <Button className="btn-light btn-block">
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-wid="0"
            viewBox="0 0 16 16"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M8 3.5a.5.5 0 01.5.5v4a.5.5 0-01-.5.5H4a.5.5 0 010-1h3.5V4a.5.5 0 01.5-.5z"
              clip-rule="evenodd"
            ></path>
            <path
              fill-rule="evenodd"
              d="M7.5 8a.5.5 0 01.5-.5h4a.5.5 0 010 1H8.5V12a.5.5 0 01-1 OV8z"
              clip-rule="evenodd"
            ></path>
          </svg>{" "}
        </Button>
      );
      let keyValueRates = result.data.data.map((r) => {
        return {
          label: r,
          value: r,
        };
      });
      let newRates = [
        ...keyValueRates,
        {
          label: button,
          value: "add",
        },
      ];
      setRateList([...newRates]);
    }
  }, []);

  useEffect(async () => {
    if (id !== undefined && props.login.loginInfo) {
      console.log(id);
      async function getDetails() {
        return await getCustomerData(id, props.login.loginInfo.token);
      }
      let result = await getDetails();
      if (result.data.success) {
        setSupplyData(result.data.supplyData);
        console.log(result.data.supplyData);
        let d = result.data.details;
        setFormInput({
          name: d.name,
          email: d.email,
          password: "can be updated by user",
          dob: new Date(d.dob),
          cnic: d.cnic,
          status: d.status,
          type: d.type,
          sellingrate: d.sellingrate,
          quantityperday: d.quantityperday,
          address: d.address,
          image: d.image,
        });
        setImage(d.image);
      } else {
        toast.error(result.data.message);
      }
    }
  }, [id, props.login]);
  useEffect(() => {
    if (!props.addCustomerState.loading) {
      if (props.addCustomerState.success) {
        toast.success("Customer Added Successfully!");
        history.push("/customer");
      } else {
        toast.error(props.addCustomerState.error);
      }
    }
  }, [props.addCustomerState]);

  useEffect(() => {
    if (!props.updateCustomerState.loading) {
      if (props.updateCustomerState.success) {
        toast.success("Customer updated Successfully!");
        history.push("/customer");
      } else {
        // console.log("it comes heere:",props.updateCustomerState.error)
        toast.error(props.updateCustomerState.error);
      }
    }
  }, [props.updateCustomerState]);

  useEffect(() => {
    let dataCopy = supplyData;
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

    if (filters.search) {
      let searchField = filters.search.toLowerCase();
      dataCopy.forEach((c, idx) => {
        let check = false;
        if (c.milkSupplyQuantity) {
          if (c.milkSupplyQuantity.toLowerCase().includes(searchField)) {
            check = true;
          }
        }
        if (c.milkSupplyRate) {
          if (c.milkSupplyRate.toLowerCase().includes(searchField)) {
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
  }, [supplyData, filters]);

  return (
    <>
      <div className="add-animal">
        <div className="grey-box">
          <Container>
            <Row className="justify-content-md-center">
              <Col lg={10}>
                <h2 className="title">
                  <Link to="/dashboard">
                    <img src={chevLeft} alt="icon" />
                  </Link>
                  {id != undefined ? "Edit Customer" : "Add Customer"}
                </h2>
              </Col>
            </Row>
          </Container>
        </div>
        <Container>
          <Row className="justify-content-md-center">
            <Col lg={10}>
              <div className="details">
                <div className="personal-info">
                  <label htmlFor="profile_image">
                    {image ? (
                      <div className="user-pic">
                        <img src={image} alt="Image" />
                      </div>
                    ) : (
                      <>
                        <div className="name-spell">AI</div>
                      </>
                    )}
                  </label>
                  <input
                    type="file"
                    id="profile_image"
                    style={{ display: "none" }}
                    disabled={uploading}
                    onChange={handleAnimalImage}
                  />
                  <div className="text-details">
                    <p>Status: {formInput.status}</p>
                  </div>
                </div>
                <div>
                  <Row className="p-3">
                    <Col lg={6}>
                      <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <FormControl
                          name="name"
                          value={formInput.name}
                          required
                          id="name"
                          placeholder="Raani"
                          label="name"
                          autoComplete="name"
                          onChange={handleInput}
                        />
                        {validator.message("name", formInput.name, "required", {
                          className: "text-danger",
                        })}
                      </Form.Group>

                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <FormControl
                          name="email"
                          value={formInput.email}
                          required
                          id="email"
                          placeholder="customer@email.com"
                          label="email"
                          autoComplete="email"
                          onChange={handleInput}
                        />
                        {validator.message(
                          "email",
                          formInput.name,
                          "required",
                          {
                            className: "text-danger",
                          }
                        )}

                        <Form.Label>
                          Create Password (cannot be updated only added the
                          first time)
                        </Form.Label>
                        <FormControl
                          required
                          value={formInput.password}
                          name="password"
                          label="Password"
                          type="password"
                          placeholder="Min. 8 Character"
                          id="password"
                          autoComplete="password"
                          onChange={handleInput}
                          disabled={id === undefined ? false : true}
                        />
                        {validator.message(
                          "password",
                          formInput.password,
                          "required",
                          {
                            className: "text-danger",
                          }
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group>
                        <Form.Label>address</Form.Label>
                        <FormControl
                          name="address"
                          value={formInput.address}
                          required
                          id="address"
                          placeholder="24-B, Gulberg"
                          label="address"
                          autoComplete="address"
                          onChange={handleInput}
                        />
                        {validator.message("name", formInput.name, "required", {
                          className: "text-danger",
                        })}
                      </Form.Group>
                    </Col>
                    <Col lg={6} className="">
                      <Form.Group>
                        <Form.Label>CNIC</Form.Label>
                        <FormControl
                          required
                          id="cnic"
                          label="CNIC"
                          name="cnic"
                          placeholder="3XXXX XXXXXXX X"
                          value={formInput.cnic}
                          autoComplete="cnic"
                          onChange={handleInput}
                        />
                        {validator.message("cnic", formInput.cnic, "required", {
                          className: "text-danger",
                        })}
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Quantity per day</Form.Label>
                        <FormControl
                          name="quantityperday"
                          value={formInput.quantityperday}
                          type="number"
                          required
                          id="quantityperday"
                          placeholder="2.5"
                          label="quantityperday"
                          autoComplete="quantityperday"
                          onChange={handleInput}
                        />
                      </Form.Group>

                      <Form.Group className="datepicker">
                        <Form.Label>Date of Birth:</Form.Label>
                        <InputGroup className={"input-group"}>
                          <DatePicker
                            selected={formInput.dob}
                            isClearable={true}
                            className="datepicker-form-control"
                            onChange={(date, e) => handleSelect(date, "date")}
                            onFocus={handleDatepickerFocus}
                            onBlur={handleDatepickerBlur}
                          />
                          {/* <InputGroup.Append> */}
                          <InputGroup.Text>
                            <span className="icon"></span>
                          </InputGroup.Text>
                          {/* </InputGroup.Append> */}
                        </InputGroup>
                      </Form.Group>
                      <Form.Label>Type</Form.Label>

                      <Select
                        className="type"
                        options={types}
                        styles={customRoleControlStyles}
                        value={{
                          label: formInput.type,
                          value: formInput.type,
                        }}
                        name="type"
                        onChange={(e) => {
                          handleSelect(e, "type");
                        }}
                      />
                    </Col>

                    <Col lg={6}>
                      <Form.Label>Current Selling rate</Form.Label>

                      <Select
                        className="sellingrate"
                        options={rateList}
                        styles={customRoleControlStyles}
                        value={{
                          label: formInput.sellingrate,
                          value: formInput.sellingrate,
                        }}
                        name="sellingrate"
                        onChange={(e) => {
                          handleSelect(e, "sellingrate");
                        }}
                      />

                      <Form.Label>Status</Form.Label>

                      <Select
                        className="status"
                        options={statuses}
                        styles={customRoleControlStyles}
                        value={{
                          label: formInput.status,
                          value: formInput.status,
                        }}
                        name="status"
                        onChange={(e) => {
                          handleSelect(e, "status");
                        }}
                      />
                    </Col>
                    <Col lg={12} className="mt-5">
                      <Button
                        variant="primary"
                        onClick={id != undefined ? handleEdit : handleSubmit}
                        disabled={disabled}
                      >
                        {id != undefined ? "Update" : "Save"}
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <div className="animals-page mt-4 mb-4">
          <Container>
            <Row className="justify-content-md-center">
              <Col lg={10}>
                <DataTable
                  customStyles={filterTableStyles}
                  responsive
                  fixedHeader={true}
                  columns={columns}
                  data={filtersIsSet() ? filteredData : supplyData}
                  // onRowClicked={handleSupplyComponent}
                  subHeader
                  subHeaderComponent={subHeaderComponentMemo}
                  pagination
                  persistTableHead
                />
              </Col>
              {showNewRateModal ? (
                <NewRateModal show={showNewRateModal} />
              ) : (
                <></>
              )}
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
};
const mapDispatchToProps = (dispatch) => {
  return {
    addCustomer: (data) => dispatch(addCustomer(data)),
    updateCustomer: (data) => dispatch(updateCustomer(data)),
  };
};
const mapStateToProps = (state) => {
  return {
    login: state.login,
    addCustomerState: state.customer.addCustomerReducer,
    updateCustomerState: state.customer.updateCustomerReducer,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddCustomer);
