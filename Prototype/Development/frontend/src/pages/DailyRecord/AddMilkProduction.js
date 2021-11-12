import React, { useEffect, useState, useReducer } from 'react'
import { connect } from 'react-redux'
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
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import SimpleReactValidator from "simple-react-validator";
import chevLeft from "../../assets/images/icons/cheveron-left.svg";

const AddMilkProduction = (props) => {
    const [, forceUpdate] = useState()
    const [animals, setAnimals] = useState([])
    const [disabled, setDisabled] = useState(false)
    const [validator] = useState(new SimpleReactValidator());
    const [formInput, setFormInput] = useReducer(
      (state, newState) => ({ ...state, ...newState }),
      {
        date: new Date(),
        record: {}
      }
    );

    useEffect(() => {
        if (props.animals.animals) {
            setAnimals(props.animals.animals.animalsData);
            let data = props.animals.animals.animalsData;
            let record = {}
            data.forEach(d => {
                record = { ...record, [d._id]: { 'morning': 0, 'evening': 0, 'name': d.name, 'tag': d.tag }}
            })
            setFormInput({ ['record']: { ...record }})
        }
    }, [props.animals])

    const handleRecord = (e, data, time) => {
        setFormInput({
            ["record"]: {
            ...formInput.record,
            [data._id]: { ...formInput.record[data._id], [time]: e.target.value},
            },
        });
    }

    const handleDateSelect = (date) => {
        setFormInput({ ['date']: date})
    }

    const handleSubmit = (e) => {
        if (!validator.allValid()) {
            validator.showMessages()
            forceUpdate(1)
        } else {
            console.log('calling save')
        }
    }

    const handleDatepickerFocus = (e) => {
        e.target.parentNode.parentNode.parentNode.classList.add("active");
    };
    const handleDatepickerBlur = (e) => {
        e.target.parentNode.parentNode.parentNode.classList.remove("active");
    };

    useEffect(() => {
        console.log('animals', props.animals)
    }, [props.animals])

    return (
      <>
        <div className="add-milk-production">
          <div className="grey-box">
            <Container>
              <Row className="justify-content-md-center">
                <Col
                  lg={10}
                  className="d-flex align-items-center justify-content-between"
                >
                  <h2 className="title">
                    <Link to="/dashboard">
                      <img src={chevLeft} alt="icon" />
                    </Link>
                    Add Milk Record
                  </h2>
                  <Form.Group className="datepicker">
                    <InputGroup className={"input-group"}>
                      <DatePicker
                        selected={formInput.date}
                        isClearable={false}
                        className="datepicker-form-control"
                        onChange={(date, e) => handleDateSelect(date)}
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
                </Col>
              </Row>
            </Container>
          </div>
          <Container>
            <Row className="justify-content-md-center">
              <Col lg={10}>
                <div className="details">
                  {animals && animals.length > 0 ? (
                    <>
                      {animals.map((a, idx) => {
                        return (
                          <div key={idx} class="personal-info">
                            <div class="personalDetails">
                              {a.image ? (
                                <div className="user-pic">
                                  <img src={a.image} alt="Image" />
                                </div>
                              ) : (
                                <>
                                  <div class="name-spell">{a.name[0]}</div>
                                </>
                              )}
                              <div class="text-details">
                                <strong>Tag ID: {a.tag}</strong>
                                <p>Status: {a.status}</p>
                              </div>
                            </div>
                            <div className="inputBox d-flex justify-content-end align-items-center">
                              <Form.Group>
                                <FormControl
                                  name={`morning-${idx}`}
                                  value={formInput.record[a._id]["morning"]}
                                  required
                                  id={`morning-${idx}`}
                                  placeholder="Morning"
                                  label="morning"
                                  autoComplete="morning"
                                  onChange={(e) => {
                                    handleRecord(e, a, "morning");
                                  }}
                                />
                                {validator.message(
                                  `morning-${idx}`,
                                  formInput.record[a._id]["morning"],
                                  "required|numeric",
                                  {
                                    className: "text-danger",
                                  }
                                )}
                              </Form.Group>
                              <Form.Group>
                                <FormControl
                                  name={`evening-${idx}`}
                                  value={formInput.record[a._id]["evening"]}
                                  required
                                  id={`evening-${idx}`}
                                  placeholder="Evening"
                                  label="evening"
                                  autoComplete="evening"
                                  onChange={(e) => {
                                    handleRecord(e, a, "evening");
                                  }}
                                />
                                {validator.message(
                                  `evening-${idx}`,
                                  formInput.record[a._id]["evening"],
                                  "required|numeric",
                                  {
                                    className: "text-danger",
                                  }
                                )}
                              </Form.Group>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <p>No Animal is in Milking State</p>
                  )}
                </div>
              </Col>
              <Col lg={10} className="pt-3">
                <Button
                  variant="primary"
                    onClick={handleSubmit}
                    disabled={disabled}
                >
                  Save
                </Button>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
}

const mapDispatchToProps = (dispatch) => {
  return {
  };
};
const mapStateToProps = (state) => {
  return {
    login: state.login,
    animals: state.farm.animals,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMilkProduction)
