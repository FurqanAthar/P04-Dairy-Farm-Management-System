import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Button, Col, Form, FormControl, Modal, Row } from "react-bootstrap";
import PlusIcon from "../../assets/images/icons/plusicon.svg";
import TrashIcon from "../../assets/images/icons/trash.svg";
import SimpleReactValidator from "simple-react-validator";
import { getRateList, updateRateList } from "../../services/apiServices";

function NewRateModal(props) {
  const [, forceUpdate] = useState();
  const [rateList, setRateList] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [validator] = useState(new SimpleReactValidator());
  const [showNewRateModal, setShowNewRateModal] = useState(false);

  useEffect(async () => {
    setShowNewRateModal(props.show);
    let result = await getRateList(props.login.loginInfo.token);
    if (result.data.success) {
      setRateList([...result.data.data]);
    }
  }, [props.show]);

  const addNewRateField = () => {
    setRateList([...rateList, ""]);
  };

  const handleChange = (index, e) => {
    let rateTemp = rateList;
    if (e.target.value == "") {
      rateTemp[index] = 0;
    } else {
      rateTemp[index] = parseFloat(e.target.value);
    }
    setRateList([...rateTemp]);
  };

  const deleteRate = (index) => {
    let rateTemp = rateList;
    rateTemp.splice(index, 1);
    setRateList([...rateTemp]);
  };

  const handleUpdateRate = async (e) => {
    setDisabled(true);
    e.preventDefault();
    if (!validator.allValid()) {
      validator.showMessages();
      forceUpdate(1);
    } else {
      let result = await updateRateList(
        { rateList },
        props.login.loginInfo.token
      );
      if (result.data && result.data.success) {
        toast.success(result.data.message);
      } else {
        toast.error(result.data.message);
      }
    }
    setDisabled(false);
  };

  return (
    <>
      {/* Modal To Display and add new Rates */}
      <Modal
        animation={false}
        className="rates account-settings-modal"
        size="sm"
        centered
        show={showNewRateModal}
        onHide={() => {
          setShowNewRateModal(false);
        }}
      >
        <Modal.Header
          closeButton
          onClick={() => {
            setShowNewRateModal(false);
          }}
        ></Modal.Header>
        <Modal.Body>
          <div className="rates-body details">
            <div className="title">Milk Rates</div>
          </div>
          <div className="rates-data">
            {rateList.map((r, idx) => {
              return (
                <>
                  <Row className="single-rate d-flex justify-content-between">
                    <Col lg={6} className="rate-field">
                      <Form.Group className="">
                        <FormControl
                          name={`rate-${idx}`}
                          value={r}
                          required
                          id={`rate-${idx}`}
                          placeholder="Rate"
                          label="rate"
                          autoComplete="rate"
                          onChange={(e) => {
                            handleChange(idx, e);
                          }}
                        />
                        {validator.message(
                          `rate-${idx}`,
                          rateList[idx],
                          "required|numeric",
                          {
                            className: "text-danger",
                          }
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={3} className="">
                      <Button
                        className="btn-icon"
                        variant="outline-light"
                        onClick={() => deleteRate(idx)}
                      >
                        <img
                          src={TrashIcon}
                          alt="Trash Icon"
                          className="icon-black"
                        />
                      </Button>
                    </Col>
                  </Row>
                </>
              );
            })}
            <Row>
              <Col lg={12}>
                <Button
                  className="btn-icon"
                  variant="outline-light"
                  onClick={() => addNewRateField()}
                >
                  <img src={PlusIcon} alt="Plus Icon" className="icon-black" />
                </Button>
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-light"
            onClick={() => {
              setShowNewRateModal(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateRate}
            disabled={disabled}
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
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

export default connect(mapStateToProps, mapDispatchToProps)(NewRateModal);
