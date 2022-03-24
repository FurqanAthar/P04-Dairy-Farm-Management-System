import React, { useEffect, useReducer, useCallback, useState } from "react";
import { connect } from "react-redux";
import { getAnimals } from "../../actions/farmActions";
import { rates } from "../../constants/options";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { customRoleControlStyles } from "../../constants/designs";
import SimpleReactValidator from "simple-react-validator";
import { getCustomers } from "../../actions/customerAction";
import TrashIcon from "../../assets/images/icons/trash.svg";
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
import { addMilkSupply, getRateList } from "../../services/apiServices";

function MilkSupply(props) {
  const [, forceUpdate] = useState();
  const [rateList, setRateList] = useState([]);
  const [customers, setCustomers] = useState([]);
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

  useEffect(async () => {
    async function getCustomersData() {
      await props.getCustomers();
    }
    getCustomersData();

    let result = await getRateList(props.login.loginInfo.token);
    if (result.data.success) {
      let button = (
        <div
          onClick={() => {
            return <NewRateModal />;
          }}
        >
          Add New Rate
        </div>
      );
      let keyValueRates = result.data.data.map((r) => {
        return {
          label: r,
          value: r,
        };
      });
      let newRates = [...keyValueRates, button];
      setRateList([...newRates]);
    }
  }, []);

  useEffect(() => {
    if (props.customers.customers) {
      setCustomers(props.customers.customers.customersData);
    }
  }, [props.customers]);

  useEffect(() => {
    let supplyDataTemp = [];
    supplyDataTemp = customers.map((c) => {
      return {
        _id: c._id,
        image: c.image,
        name: c.name,
        status: c.status,
        milkSupplyQuantity: 2,
        milkSupplyRate: 100,
        type: "Milkman",
      };
    });
    setSupplyDataForm([...supplyDataTemp]);
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

  useEffect(() => {
    console.log("suppplyInfo", supplyInfo);
  }, [supplyInfo]);

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
      supplyDataTemp[index].milkSupplyRate = e.value;
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
      let result = await addMilkSupply(
        {
          customersData: supplyDataForm,
          info: {
            ...supplyInfo,
            totalWasted: parseFloat(supplyInfo.totalWasted),
            date: moment(supplyInfo.date).format("YYYY-MM-DD[T00:00:00.000Z]"),
          },
        },
        props.login.loginInfo.token
      );
      if (result.data && result.data.success) {
        // setStep("details");
      } else {
        toast.error(result.data.message);
      }
    }
    setDisabled(false);
  };

  return (
    <>
      <Button
        onClick={() => {
          setShowNewRateModal(!showNewRateModal);
          // setShowNewRateModal(false);
        }}
      >
        Add New Rate
      </Button>
      <div className="milk-supply">
        <Row className="supply-info justify-content-md-center">
          <Col lg={8}>
            <span className="supply-card">
              Total Revenue: {supplyInfo.totalRevenue}
            </span>
            <span className="supply-card">
              Total Revenue: {supplyInfo.totalRevenue}
            </span>
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
                  <p className="badge badge-danger">Wasted Milk</p>
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
                      value={supplyInfo.reason}
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
                                c.type === "milkman"
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
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={disabled}
                  >
                    Add Record
                  </Button>
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
