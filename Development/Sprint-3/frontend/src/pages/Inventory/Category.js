import React, { useEffect, useState, useReducer } from "react";
import {
  Container,
  Col,
  Row,
  Modal,
  Button,
  Form,
  FormControl,
} from "react-bootstrap";
import ItemCard from "./ItemCard";
import Select from "react-select";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import SimpleReactValidator from "simple-react-validator";
import PlusIcon from "../../assets/images/icons/plusicon.svg";
import { addInventoryItem } from "../../services/apiServices";
import { customRoleControlStyles } from "../../constants/designs";
import chevLeft from "../../assets/images/icons/cheveron-left.svg";
import { inventoryMetrics, metricUnits } from "../../constants/options";
import { getInventoryCategories } from "../../actions/inventoryActions";
import AccountModalImage from "../../assets/images/inventoryBottles.jpg";

function Category(props) {
  let { id } = useParams();
  const [, forceUpdate] = useState();
  const [disabled, setDisabled] = useState(false);
  const [categoryData, setCategoryData] = useState({});
  const [validator] = useState(new SimpleReactValidator());
  const [showNewItemModal, setShowNewItemModal] = useState(false);

  //   category form to add new categries
  const [itemForm, setItemForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      name: "",
      quantity: 0,
      unit: "",
      metric: "",
    }
  );

  // for calling inventory items to load in state
  useEffect(() => {
    getCategoriesData();
  }, []);

  // for selecting the specific category using id
  useEffect(() => {
    if (props.inventory.inventory) {
      if (props.inventory.inventory.length > 0) {
        props.inventory.inventory.forEach((cat) => {
          if (cat._id == id) {
            setCategoryData(cat);
            setItemForm({ ["metric"]: cat.metric });
          }
        });
      }
    }
  }, [props.inventory]);

  async function getCategoriesData() {
    await props.getInventoryCategories();
  }

  //   handling functions for category form fields
  const handleNewItemInputs = (evt) => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setItemForm({ [name]: newValue });
  };
  const handleNewItemUnit = (e) => {
    setItemForm({ ["unit"]: e.value });
  };

  //   API Call to add new category in inventory
  const submitNewItem = async () => {
    setDisabled(true);
    if (!validator.allValid()) {
      validator.showMessages();
      forceUpdate(1);
    } else {
      let result = await addInventoryItem(
        { ...itemForm, categoryId: id },
        props.login.loginInfo.token
      );
      //   closing the modal and setting form fields empty
      if (result.data.success) {
        getCategoriesData();
        setShowNewItemModal(false);
        setItemForm({ ["name"]: "", ["quantity"]: 0 });
        toast.success("Item Added Into Your Inventory!");
      } else {
        toast.error(result.data.message);
      }
    }
    setDisabled(false);
  };

  return (
    <div className="account-security-page">
      <div className="grey-box">
        <Container>
          <Row className="justify-content-md-center">
            <Col lg={10}>
              <h2 className="title">
                <Link to="/inventory">
                  <img src={chevLeft} alt="icon" />
                </Link>
                Inventory
              </h2>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row className="justify-content-md-center">
            <Col lg={10}>
              <div className="category-subheader">
                <div class="personal-info">
                  <Col lg={12}>
                    <div className="d-flex justify-content-md-between">
                      <h3>{categoryData ? categoryData.name : ""}</h3>
                      <Button
                        variant="primary"
                        onClick={() => setShowNewItemModal(true)}
                      >
                        Add Item
                      </Button>
                    </div>
                  </Col>
                  <Col lg={12}>
                    {categoryData ? (
                      <p
                        className={
                          categoryData.metric === inventoryMetrics[1].value
                            ? "badge badge-info mr-2"
                            : categoryData.metric === inventoryMetrics[0].value
                            ? "badge badge-light mr-2"
                            : "badge badge-success mr-2"
                        }
                      >
                        <strong>Metric: </strong>
                        {categoryData.metric}
                      </p>
                    ) : (
                      ""
                    )}
                    {/* <br /> */}
                    {categoryData && categoryData.items ? (
                      <p
                        className={
                          categoryData.items.length <= 0
                            ? "badge badge-danger mr-2"
                            : "badge badge-info mr-2"
                        }
                      >
                        <strong>Total Items: </strong>
                        {categoryData.items.length}
                      </p>
                    ) : (
                      0
                    )}
                  </Col>
                  {/* Modal to add new item */}
                  <Modal
                    animation={false}
                    className="account-settings-modal"
                    size="sm"
                    centered
                    show={showNewItemModal}
                    onHide={() => {
                      setShowNewItemModal(false);
                    }}
                  >
                    <Modal.Header
                      closeButton
                      onClick={() => {
                        setShowNewItemModal(false);
                      }}
                    ></Modal.Header>
                    <Modal.Body>
                      <div className="details">
                        <div className="icon">
                          <img src={AccountModalImage} alt="Icon Image" />
                        </div>

                        <div className="title">Add Item</div>
                        <Form.Group>
                          <Form.Label>Item Name</Form.Label>
                          <FormControl
                            id="name"
                            name="name"
                            value={itemForm.name}
                            onChange={handleNewItemInputs}
                          />
                          {validator.message(
                            "name",
                            itemForm.name,
                            "required",
                            {
                              className: "text-danger",
                            }
                          )}
                        </Form.Group>
                        <Row>
                          <Col lg={6}>
                            <Form.Group>
                              <Form.Label>Quantity</Form.Label>
                              <FormControl
                                id="quantity"
                                name="quantity"
                                value={itemForm.quantity}
                                onChange={handleNewItemInputs}
                              />
                              {validator.message(
                                "quantity",
                                itemForm.quantity,
                                "required|numeric|min:0,num",
                                {
                                  className: "text-danger",
                                }
                              )}
                            </Form.Group>
                          </Col>
                          <Col lg={6}>
                            <Form.Label>Unit</Form.Label>
                            <Select
                              className="select-menu"
                              options={metricUnits[categoryData.metric]}
                              styles={customRoleControlStyles}
                              value={{
                                label: itemForm.unit,
                                value: itemForm.unit,
                              }}
                              name="unit"
                              onChange={(e) => {
                                handleNewItemUnit(e);
                              }}
                            />
                            {validator.message(
                              "unit",
                              itemForm.unit,
                              "required",
                              {
                                className: "text-danger",
                              }
                            )}
                          </Col>
                        </Row>
                        <Form.Group>
                          <Form.Label>Metric</Form.Label>
                          <FormControl
                            id="metric"
                            name="metric"
                            disabled
                            value={categoryData.metric}
                          />
                        </Form.Group>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="outline-light"
                        onClick={() => {
                          setShowNewItemModal(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={submitNewItem}
                        disabled={disabled}
                      >
                        Add
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
                <div>
                  {categoryData ? <ItemCard data={categoryData.items} /> : null}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
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
    inventory: state.farm.inventory,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Category);
