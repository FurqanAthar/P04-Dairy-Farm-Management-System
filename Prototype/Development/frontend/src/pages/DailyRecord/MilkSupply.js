import React, { useEffect, useReducer, useCallback, useState } from "react";
import { connect } from "react-redux";
import { getAnimals } from "../../actions/farmActions";
import { rates } from "../../constants/options";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import { customRoleControlStyles } from "../../constants/designs";
import SimpleReactValidator from "simple-react-validator";
import { getCustomers } from "../../actions/customerAction";
import TrashIcon from "../../assets/images/icons/trash.svg";
import BagIcon from "../../assets/images/icons/bag.svg";
import WalletIconGreen from "../../assets/images/icons/calculator-2-green.svg";
import WalletIcon from "../../assets/images/icons/calculator-2.svg";
import WalletIconRed from "../../assets/images/icons/calculator-2-red.svg";
import PersentIcon from "../../assets/images/icons/persent-icon.svg";
import NewRateModal from "../../components/layouts/NewRateModal";
import {
  Container,
  Button,
  Form,
  InputGroup,
  FormControl,
  Nav,
  Row,
  Col,
  Modal,
} from "react-bootstrap";
import moment from "moment";
import Select from "react-select";
import axios from "axios";
import {
  addMilkSupply,
  getMilkSupplyById,
  getRateList,
  updateMilkSupplyById,
} from "../../services/apiServices";

function MilkSupply(props) {
  const { id } = useParams();
  const [, forceUpdate] = useState();
  const [rateList, setRateList] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [toCustomersType, setToCustomersType] = useState({
    regular: {},
    milkman: {},
  });
  const [disabled, setDisabled] = useState(false);
  const [validator] = useState(new SimpleReactValidator());
  const [supplyDataForm, setSupplyDataForm] = useState([]);
  const [showNewRateModal, setShowNewRateModal] = useState(false);
  const [supplyInfo, setSupplyInfo] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      totalRevenue: 0,
      totalQuantitySupplied: 0,
      totalWasted: 0,
      reasonWasted: "",
      totalCustomers: 0,
      date: new Date(),
    }
  );

  async function getDetails() {
    let result = await getMilkSupplyById(id, props.login.loginInfo.token);
    if (result.data.success) {
      let data = result.data.data;
      setSupplyDataForm([...data.customers]);
      setSupplyInfo({
        totalRevenue: data.totalRevenue,
        totalQuantitySupplied: data.totalQuantitySupplied,
        totalWasted: data.waste.quantity,
        reasonWasted: data.waste.reason,
        totalCustomers: data.customers.length,
        date: new Date(data.date),
      });
      setToCustomersType({
        regular: data.totalToCustomers,
        milkman: data.totalToMilkmans,
      });
    }
  }

  useEffect(async () => {
    if (id !== undefined) {
      await getDetails();
    }
  }, [id]);

  useEffect(async () => {
    async function getCustomersData() {
      await props.getCustomers();
    }
    getCustomersData();

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

  useEffect(() => {
    if (props.customers.customers) {
      setCustomers(props.customers.customers.customersData);
    }
  }, [props.customers]);

  useEffect(() => {
    if (id === undefined) {
      let supplyDataTemp = [];
      supplyDataTemp = customers.map((c) => {
        return {
          _id: c._id,
          image: c.image,
          name: c.name,
          status: c.status,
          milkSupplyQuantity: c.quantityperday,
          milkSupplyRate: c.sellingrate,
          type: c.type,
        };
      });
      setSupplyDataForm([...supplyDataTemp]);
    }
  }, [customers]);

  useEffect(() => {
    let totalRevenue = 0;
    let totalQuantitySupplied = 0;
    supplyDataForm.forEach((d) => {
      totalRevenue =
        totalRevenue +
        parseFloat(d.milkSupplyQuantity) * parseFloat(d.milkSupplyRate);
      totalQuantitySupplied =
        parseFloat(totalQuantitySupplied) + parseFloat(d.milkSupplyQuantity);
    });
    setSupplyInfo({
      totalCustomers: supplyDataForm.length,
      totalRevenue,
      totalQuantitySupplied,
    });
  }, [supplyDataForm]);

  const handleDatepickerFocus = (e) => {
    e.target.parentNode.parentNode.parentNode.classList.add("active");
  };
  const handleDatepickerBlur = (e) => {
    e.target.parentNode.parentNode.parentNode.classList.remove("active");
  };

  const handleChange = (index, e, which) => {
    let supplyDataTemp = supplyDataForm;
    if (which === "quantity") {
      if (e.target.value == "") {
        supplyDataTemp[index].milkSupplyQuantity = 0;
      } else {
        supplyDataTemp[index].milkSupplyQuantity = e.target.value;
      }
    } else if (which === "rate") {
      if (e.value == "add") {
        setShowNewRateModal(!showNewRateModal);
      } else {
        supplyDataTemp[index].milkSupplyRate = e.value;
      }
    } else if (which === "date") {
      setSupplyInfo({ date: new Date(e) });
    } else if (which === "wastedQuantity") {
      setSupplyInfo({ totalWasted: e.target.value });
    } else if (which === "wastedReason") {
      setSupplyInfo({ reasonWasted: e.target.value });
    }
    setSupplyDataForm([...supplyDataTemp]);
  };

  const deleteCustomerFromTodaySupply = (index) => {
    let supplyDataTemp = supplyDataForm;
    supplyDataTemp.splice(index, 1);
    setSupplyDataForm([...supplyDataTemp]);
  };

  const handleSubmit = async (e) => {
    setDisabled(true);
    e.preventDefault();
    if (!validator.allValid()) {
      validator.showMessages();
      forceUpdate(1);
    } else {
      if (id === undefined) {
        let result = await addMilkSupply(
          {
            customersData: supplyDataForm,
            info: {
              ...supplyInfo,
              totalWasted: parseFloat(supplyInfo.totalWasted),
              date: moment(supplyInfo.date).format(
                "YYYY-MM-DD[T00:00:00.000Z]"
              ),
            },
          },
          props.login.loginInfo.token
        );
        if (result.data && result.data.success) {
          toast.success(result.data.message);
        } else {
          toast.error(result.data.message);
        }
      } else {
        let result = await updateMilkSupplyById(
          {
            id: id,
            customersData: supplyDataForm,
            info: {
              ...supplyInfo,
              totalWasted: parseFloat(supplyInfo.totalWasted),
              date: moment(supplyInfo.date).format(
                "YYYY-MM-DD[T00:00:00.000Z]"
              ),
            },
          },
          props.login.loginInfo.token
        );
        if (result.data && result.data.success) {
          await getDetails();
          toast.success(result.data.message);
        } else {
          toast.error(result.data.message);
        }
      }
    }
    setDisabled(false);
  };

  return (
    <>
      <div className="milk-supply">
        <Row className="justify-content-md-center">
          <Col lg={8} className="supply-info main-details-section ">
            <div className="graph-box-holder d-flex flex-column h-100">
              <Row>
                <Col lg={3} md={6}>
                  <div className="graph-box d-flex align-items-center">
                    <div className="icon-image success-icon">
                      <img src={PersentIcon} alt="Icon" />
                    </div>
                    <div>
                      <span className="title">Sales</span>
                      <div className="g-value">
                        <span className="text-success mr-1">Rs.</span>{" "}
                        {supplyInfo.totalRevenue}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col lg={3} md={6}>
                  <div className="graph-box d-flex align-items-center">
                    <div className="icon-image purple-icon">
                      <img src={WalletIcon} alt="Icon" />
                    </div>
                    <div>
                      <span className="title">Supplied Qty.</span>
                      <div className="g-value">
                        <span className="text-purple mr-1">Ltr </span>{" "}
                        {supplyInfo.totalQuantitySupplied}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col lg={3} md={6}>
                  <div className="graph-box d-flex align-items-center">
                    <div className="icon-image danger-icon">
                      <img src={WalletIconRed} alt="Icon" />
                    </div>
                    <div>
                      <span className="title">Wasted Qty.</span>
                      <div className="g-value">
                        <span className="text-red mr-1">Ltr </span>{" "}
                        {supplyInfo.totalWasted}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col lg={3} md={6}>
                  <div className="graph-box d-flex align-items-center">
                    <div className="icon-image info-icon">
                      <img src={BagIcon} alt="Icon" />
                    </div>
                    <div>
                      <span className="title">Customers</span>
                      <div className="g-value">{supplyInfo.totalCustomers}</div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col lg={8}>
            <div className="details">
              <Row className="milk-supply-date d-flex justify-content-between">
                <Col lg={6} className="d-flex align-items-center">
                  <h2 className="title">Add Milk Supply</h2>
                </Col>
                <Col lg={4}>
                  <Form.Group className="datepicker mb-0">
                    <InputGroup className={"input-group"}>
                      <InputGroup.Prepend>
                        <InputGroup.Text className="">
                          <span className="icon"></span>
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <DatePicker
                        selected={supplyInfo.date}
                        isClearable={true}
                        // minDate={new Date()}
                        className="datepicker-form-control"
                        onChange={(date, e) => handleChange(e, date, "date")}
                        onFocus={handleDatepickerFocus}
                        onBlur={handleDatepickerBlur}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="milk-supply-date d-flex justify-content-between">
                {/* <Col lg={4}>Wasted</Col> */}
                <Col lg={12}>
                  <div className="d-flex justify-content-between">
                    <p className="badge badge-danger">Wasted Milk</p>
                    <p
                      className="badge badge-info cursor"
                      onClick={() =>
                        setCustomers([
                          ...props.customers.customers.customersData,
                        ])
                      }
                    >
                      Refresh List
                    </p>
                  </div>
                  <Form.Group className="mr-2">
                    <Form.Label>Quantity (ltr)</Form.Label>
                    <FormControl
                      name={`wasted-quantity`}
                      value={supplyInfo.totalWasted}
                      required
                      id={`wasted-quantity`}
                      placeholder="Quantity"
                      label="Quantity"
                      autoComplete="Quantity"
                      onChange={(e) => {
                        handleChange(-1, e, "wastedQuantity");
                      }}
                    />
                    {validator.message(
                      `wasted-quantity`,
                      supplyInfo.totalWasted,
                      "required|numeric",
                      {
                        className: "text-danger",
                      }
                    )}
                  </Form.Group>
                  <Form.Group className="mr-2">
                    <Form.Label>Reason</Form.Label>
                    <FormControl
                      name={`wasted-reason`}
                      value={supplyInfo.reasonWasted}
                      required
                      id={`wasted-reason`}
                      placeholder="Reason"
                      label="Reason"
                      autoComplete="Reason"
                      onChange={(e) => {
                        handleChange(-1, e, "wastedReason");
                      }}
                    />
                    {validator.message(
                      `wasted-reason`,
                      supplyInfo.reasonWasted,
                      "required",
                      {
                        className: "text-danger",
                      }
                    )}
                  </Form.Group>
                </Col>
              </Row>
              {supplyDataForm.map((c, idx) => {
                return (
                  <>
                    {c.status === "active" ? (
                      <div
                        key={idx}
                        class="personal-info d-flex justify-content-between"
                      >
                        <div class="personalDetails">
                          {c.image ? (
                            <div className="user-pic">
                              <img src={c.image} alt="Image" />
                            </div>
                          ) : (
                            <>
                              <div class="name-spell">{c.name[0]}</div>
                            </>
                          )}
                          <div class="text-details">
                            <p>{c.name}</p>
                            {/* Type:{" "} */}
                            <span
                              className={
                                c.type === "Milkman"
                                  ? "badge badge-info mt-1"
                                  : "badge badge-success mt-1"
                              }
                            >
                              {c.type}
                            </span>
                          </div>
                        </div>
                        <div className="d-flex justify-content-end align-items-center">
                          <Form.Group className="mr-2">
                            <Form.Label>Rate (Rs.)</Form.Label>
                            <Select
                              className="select-menu"
                              options={rateList}
                              styles={customRoleControlStyles}
                              value={{
                                label: c.milkSupplyRate,
                                value: c.milkSupplyRate,
                              }}
                              name={`rate-${idx}`}
                              onChange={(e) => {
                                handleChange(idx, e, "rate");
                              }}
                            />
                            {validator.message(
                              `rate-${idx}`,
                              supplyDataForm[idx].milkSupplyRate,
                              "required|numeric",
                              {
                                className: "text-danger",
                              }
                            )}
                          </Form.Group>
                          <Form.Group className="mr-2">
                            <Form.Label>Quantity (ltr)</Form.Label>
                            <FormControl
                              name={`quantity-${idx}`}
                              value={c.milkSupplyQuantity}
                              required
                              id={`quantity-${idx}`}
                              placeholder="Quantity"
                              label="Quantity"
                              autoComplete="Quantity"
                              onChange={(e) => {
                                handleChange(idx, e, "quantity");
                              }}
                            />
                            {validator.message(
                              `quantity-${idx}`,
                              supplyDataForm[idx].milkSupplyQuantity,
                              "required|numeric",
                              {
                                className: "text-danger",
                              }
                            )}
                          </Form.Group>
                        </div>
                        <div className="d-flex align-items-center">
                          <Button
                            className="btn-icon"
                            variant="outline-light"
                            onClick={() => deleteCustomerFromTodaySupply(idx)}
                          >
                            <img
                              src={TrashIcon}
                              alt="Trash Icon"
                              className="icon-black"
                            />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                );
              })}
              <Row className="save-button d-flex justify-content-end">
                <Col lg={4} className="d-flex justify-content-end">
                  {id === undefined ? (
                    <Button
                      variant="primary"
                      onClick={handleSubmit}
                      disabled={disabled}
                    >
                      Add Record
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={handleSubmit}
                      disabled={disabled}
                    >
                      Update Record
                    </Button>
                  )}
                </Col>
              </Row>
              {showNewRateModal ? (
                <NewRateModal show={showNewRateModal} />
              ) : (
                <></>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </>
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

export default connect(mapStateToProps, mapDispatchToProps)(MilkSupply);
