import React, { useEffect, useState, useReducer } from "react";
import {
  Container,
  Col,
  Row,
  Modal,
  Button,
  Accordion,
  Form,
  FormControl,
} from "react-bootstrap";
import moment from "moment";
import Select from "react-select";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { BiChevronDown } from "react-icons/bi";
import SimpleReactValidator from "simple-react-validator";
import {
  addItemTransaction,
  deleteItemTransaction,
  getItemTransactions,
} from "../../services/apiServices";
import TrashIcon from "../../assets/images/icons/trash.svg";
import { customRoleControlStyles } from "../../constants/designs";
import { inventoryMetrics, metricUnits } from "../../constants/options";
import AccountModalImage from "../../assets/images/inventoryBottles.jpg";

function ItemCard(props) {
  const [, forceUpdate] = useState();
  const [items, setItems] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [itemHistory, setItemHistory] = useState({});
  const [selectedItem, setSelectedItem] = useState({});
  const [deleteUpdateData, setDeleteUpdateData] = useState();
  const [validator] = useState(new SimpleReactValidator());
  const [itemTransactions, setItemTransactions] = useState([]);
  const [showNewUpdateModal, setShowNewUpdateModal] = useState(false);
  //   update form to add new update
  const [updateForm, setUpdateForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      id: null,
      oldQuantity: null,
      newQuantity: null,
    }
  );

  // when global state changes
  useEffect(() => {
    if (Object.keys(props).length > 0) {
      if (props.data) {
        setItems(props.data);
      }
    }
  }, [props]);

  // when item history satisfied from backend
  useEffect(() => {
    if (Object.keys(itemHistory).length > 0) {
      if (itemHistory.transactions.length > 0) {
        let itemTransactionsCopy = [];
        let l = itemHistory.transactions.length;
        for (let i = l - 1; i >= 0; i--) {
          itemTransactionsCopy = [
            ...itemTransactionsCopy,
            itemHistory.transactions[i],
          ];
        }
        setItemTransactions([...itemTransactionsCopy]);
      }
    }
  }, [itemHistory]);

  // when selected item changes
  useEffect(async () => {
    if (Object.keys(selectedItem).length > 0) {
      //   send api call for getting transactions of item
      let result = await getItemTransactions(
        selectedItem._id,
        props.login.loginInfo.token
      );
      if (result) {
        if (result.data) {
          if (result.data.success) {
            setItemHistory({ ...result.data.data });
            setUpdateForm({
              ["id"]: result.data.data._id,
              ["newQuantity"]: result.data.data.quantity,
              ["oldQuantity"]: result.data.data.quantity,
            });
          } else {
            toast.error(result.data.message);
          }
        }
      }
    }
  }, [selectedItem]);

  const handleClickItem = (id) => {
    setItemHistory({});
    handleColor(id);
    let item;
    items.forEach((i) => {
      if (i._id === id) {
        item = i;
        setSelectedItem({ ...i });
      }
    });
  };

  // changing color of box of selected item
  const handleColor = (id) => {
    items.forEach((i) => {
      document.getElementById(i._id).classList.remove("selected");
    });
    document.getElementById(id).classList.add("selected");
  };

  const handleNewUpdate = (e) => {
    if (parseInt(e.target.value) >= 0) {
      setUpdateForm({ [e.target.name]: parseInt(e.target.value) });
    } else {
      setUpdateForm({ [e.target.name]: 0 });
    }
  };

  const submitNewUpdate = async () => {
    setDisabled(true);

    let result = await addItemTransaction(
      updateForm,
      props.login.loginInfo.token
    );

    if (result.data.success) {
      setSelectedItem({ ...result.data.item });
      setShowNewUpdateModal(false);
      toast.success("Item Updated!");
    } else {
      toast.error(result.data.message);
    }

    setDisabled(false);
  };

  const deleteTransaction = async () => {
    setDisabled(true);

    let result = await deleteItemTransaction(
      deleteUpdateData,
      props.login.loginInfo.token
    );
    if (result.data.success) {
      handleClickItem(deleteUpdateData.ofItem);
      setShowAlert(false);
      toast.success("Item History Updated!");
    } else {
      toast.error(result.data.message);
    }

    setDisabled(false);
  };

  return (
    <>
      {items.length > 0 ? (
        <Container className="p-4">
          <div className="d-flex justify-content-md-between">
            <Col lg={4}>
              {items.map((item) => {
                return (
                  <div
                    id={item._id}
                    className={`category-item-card`}
                    onClick={() => {
                      handleClickItem(item._id);
                    }}
                  >
                    <strong>{item.name}</strong>
                    <p>
                      Remaining: {item.quantity} {item.unit}
                    </p>
                  </div>
                );
              })}
            </Col>
            <Col lg={8}>
              {Object.keys(selectedItem).length > 0 ? (
                Object.keys(itemHistory).length > 0 ? (
                  <>
                    <div className="item-history">
                      <div className="item-body">
                        <div>
                          <Row>
                            <div className="d-flex justify-content-between">
                              <div>
                                <strong>{itemHistory.name}</strong>
                                <p>
                                  Remaining:{" "}
                                  <span
                                    className={
                                      itemHistory.quantity > 0
                                        ? "badge badge-success mr-2"
                                        : "badge badge-danger mr-2"
                                    }
                                  >
                                    {itemHistory.quantity} {itemHistory.unit}
                                  </span>
                                </p>
                              </div>
                              <div>
                                <p>Created By: </p>
                                <div className="d-flex align-items-center">
                                  {itemHistory.createdBy &&
                                  itemHistory.createdBy.image ? (
                                    <>
                                      <div className="generic-user-pic mr-2">
                                        <div className="user-pic">
                                          <img
                                            src={itemHistory.createdBy.image}
                                            alt="Image"
                                          />
                                        </div>
                                      </div>
                                      <div className="generic-team-name-role">
                                        {itemHistory.createdBy.name}{" "}
                                        <p>
                                          {itemHistory.createdBy.role.toLocaleUpperCase()}
                                        </p>
                                      </div>
                                    </>
                                  ) : itemHistory.createdBy &&
                                    itemHistory.createdBy.name ? (
                                    <>
                                      <div className="generic-team-name-short mr-2">
                                        {itemHistory.createdBy.name
                                          .replace(/[^a-zA-Z-0-9 ]/g, "")
                                          .match(/\b\w/g)}
                                      </div>
                                      <div className="generic-team-name-role">
                                        {itemHistory.createdBy.name}{" "}
                                        <p>
                                          {itemHistory.createdBy.role.toLocaleUpperCase()}
                                        </p>
                                      </div>
                                    </>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </Row>
                          <Row className="d-flex justify-content-end m-2">
                            <Button
                              variant="primary"
                              onClick={() => setShowNewUpdateModal(true)}
                            >
                              Add Update
                            </Button>
                          </Row>
                          {itemTransactions.length > 0
                            ? itemTransactions.map((i, index) => {
                                return (
                                  <div className="transaction-card">
                                    {index != itemTransactions.length - 1 ? (
                                      <div className="d-flex justify-content-end">
                                        <img
                                          src={TrashIcon}
                                          alt="Trash Icon"
                                          className="icon-black-small"
                                          onClick={() => {
                                            setShowAlert(true);
                                            setDeleteUpdateData(i);
                                          }}
                                        />
                                      </div>
                                    ) : null}
                                    <div className="d-flex justify-content-between">
                                      <Col className="no-padding" lg={8}>
                                        New:{" "}
                                        <span
                                          className={
                                            i.new < i.old
                                              ? "badge badge-danger mr-2"
                                              : "badge badge-success mr-2"
                                          }
                                        >
                                          {i.new} {itemHistory.unit}
                                        </span>
                                        Old:{" "}
                                        <span
                                          className={
                                            i.old < i.new
                                              ? "badge badge-danger mr-2"
                                              : "badge badge-success mr-2"
                                          }
                                        >
                                          {i.old} {itemHistory.unit}
                                        </span>
                                        <p>
                                          Done at:{" "}
                                          {moment(i.createdAt).format(
                                            "MM/DD/YYYY"
                                          )}
                                        </p>
                                      </Col>
                                      <Col lg={4} className="no-padding">
                                        <p>Done By: </p>
                                        <div className="d-flex align-items-center">
                                          {i.doneBy && i.doneBy.image ? (
                                            <>
                                              <div className="generic-user-pic mr-2">
                                                <div className="user-pic">
                                                  <img
                                                    src={i.doneBy.image}
                                                    alt="Image"
                                                  />
                                                </div>
                                              </div>{" "}
                                              <div className="generic-team-name-role">
                                                {i.doneBy.name}{" "}
                                                <p>
                                                  {i.doneBy.role.toLocaleUpperCase()}
                                                </p>
                                              </div>
                                            </>
                                          ) : i.doneBy && i.doneBy.name ? (
                                            <>
                                              <div className="generic-team-name-short mr-2">
                                                {i.doneBy.name
                                                  .replace(
                                                    /[^a-zA-Z-0-9 ]/g,
                                                    ""
                                                  )
                                                  .match(/\b\w/g)}
                                              </div>
                                              <div className="generic-team-name-role">
                                                {i.doneBy.name}{" "}
                                                <p>
                                                  {i.doneBy.role.toLocaleUpperCase()}
                                                </p>
                                              </div>
                                            </>
                                          ) : null}
                                        </div>
                                      </Col>
                                    </div>
                                  </div>
                                );
                              })
                            : "No History"}

                          {/* <p>Created At: {itemHistory.createdAt}</p> */}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  "Loading History"
                )
              ) : (
                "Select Item to see History"
              )}
            </Col>
            {/* Modal to show alert */}
            <Modal
              animation={false}
              className="account-settings-modal"
              size="sm"
              centered
              show={showAlert}
              onHide={() => {
                setShowAlert(false);
              }}
            >
              <Modal.Body>
                <p className="text-center">
                  All updates made after this update will get deleted to make
                  the history consistent. <br /> <br />
                  Do you wish to continue?
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="outline-light"
                  onClick={() => {
                    setShowAlert(false);
                  }}
                >
                  No
                </Button>
                <Button
                  variant="primary"
                  onClick={deleteTransaction}
                  disabled={disabled}
                >
                  Yes
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Modal to add new update */}
            <Modal
              animation={false}
              className="account-settings-modal"
              size="sm"
              centered
              show={showNewUpdateModal}
              onHide={() => {
                setShowNewUpdateModal(false);
              }}
            >
              <Modal.Header
                closeButton
                onClick={() => {
                  setShowNewUpdateModal(false);
                }}
              ></Modal.Header>
              <Modal.Body>
                <div className="details">
                  <div className="icon">
                    <img src={AccountModalImage} alt="Icon Image" />
                  </div>

                  <div className="title">Add Update</div>
                  <Form.Group>
                    <Form.Label>Item Name</Form.Label>
                    <FormControl
                      id="name"
                      name="name"
                      value={itemHistory.name}
                    />
                  </Form.Group>
                  <Row>
                    <Col lg={6}>
                      <Form.Group>
                        <Form.Label>Current</Form.Label>
                        <FormControl
                          id="quantity_current"
                          name="quantity_current"
                          value={itemHistory.quantity}
                        />
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group>
                        <Form.Label>New</Form.Label>
                        <FormControl
                          id="newQuantity"
                          name="newQuantity"
                          value={updateForm.newQuantity}
                          onChange={(e) => {
                            handleNewUpdate(e);
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Label>Unit</Form.Label>
                      <Select
                        disabled
                        className="select-menu"
                        options={metricUnits[itemHistory.metric]}
                        styles={customRoleControlStyles}
                        value={{
                          label: itemHistory.unit,
                          value: itemHistory.unit,
                        }}
                        name="unit"
                      />
                    </Col>
                    <Col lg={6}>
                      <Form.Group>
                        <Form.Label>Metric</Form.Label>
                        <FormControl
                          id="metric"
                          name="metric"
                          disabled
                          value={itemHistory.metric}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="outline-light"
                  onClick={() => {
                    setShowNewUpdateModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={submitNewUpdate}
                  disabled={disabled}
                >
                  Add
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </Container>
      ) : (
        <Container>"No Items to display"</Container>
      )}
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {};
};

const mapStateToProps = (state) => {
  return {
    login: state.login,
    inventory: state.farm.inventory,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ItemCard);
