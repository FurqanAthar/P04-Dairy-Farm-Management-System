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
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import { Link, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import { addCustomer,updateCustomer} from "../../actions/customerAction";
import SimpleReactValidator from "simple-react-validator";
import chevLeft from "../../assets/images/icons/cheveron-left.svg";
import axios from "axios";
import { getCustomerData } from "../../services/apiServices";

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
  
  const {id}= useParams()
  const history = useHistory()
	const [image, setImage] = useState("")
	const [disabled, setDisabled] = useState(false);
	const [uploading, setUploading] = useState(false)
	const [validator] = useState(new SimpleReactValidator());
	const [formInput, setFormInput] = useReducer(
	  (state, newState) => ({ ...state, ...newState }),
	  {
		name: "",
		email: "",
    cnic:"",
		dob: "",
		status: "",
		image: ""
	  }
	);

	const statuses = [
	  { label: "active", value: "active" },
	  { label: "Inactive", value: "Inactive" },
	];


    const handleInput = (evt) => {
        const name = evt.target.name;
        const newValue = evt.target.value;
        setFormInput({ [name]: newValue });
      };
  
      const handleSelect = (e, which) => {
          if (which == 'type') {
              setFormInput({ ['type']: e.value })
          } else if (which == 'status') {
              setFormInput({ ['status']: e.value })
          } else if (which == 'date') {
              setFormInput({ ['dob']: e })
          }
      }
  
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
           console.log(data)
  
           setImage(data);
           setFormInput({ ['image']: data})
           setUploading(false);
         } catch (error) {
            toast.error('Image Upload Failed')
            setUploading(false);
         }
      }
  
      const handleDatepickerFocus = (e) => {
        e.target.parentNode.parentNode.parentNode.classList.add("active");
      };
      const handleDatepickerBlur = (e) => {
        e.target.parentNode.parentNode.parentNode.classList.remove("active");
      };
  
      const handleSubmit = async (e) => {
        console.log({ ...formInput })
          await props.addCustomer({ ...formInput })
      }; 

      const handleEdit = async (e) => {
        setDisabled(true);
        await props.updateCustomer({ ...formInput, id: id });
        setDisabled(false);
      };

      useEffect(async () => {
        if (id !== undefined && props.login.loginInfo) {
          console.log(id);
          async function getDetails() {
            console.log(props.login.loginInfo.token);
            console.log("herherh",getCustomerData(id, props.login.loginInfo.token))
            return await getCustomerData(id, props.login.loginInfo.token);
          }
          let result = await getDetails();
          if (result.data.success) {
            let d = result.data.details;
            setFormInput({
              name: d.name,
              email: d.email,
              dob: new Date(d.dob),
              cnic: d.cnic,
              status: d.status,
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
            console.log("it comes heere:",props.updateCustomerState.error)
            toast.error(props.updateCustomerState.error);
          }
        }
      }, [props.updateCustomerState]);
    



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
                      Add Customer
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
                            {validator.message(
                              "name",
                              formInput.name,
                              "required",
                              {
                                className: "text-danger",
                              }
                            )}
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
                              "emial",
                              formInput.name,
                              "required",
                              {
                                className: "text-danger",
                              }
                            )}
                          </Form.Group>
                        </Col>
                        <Col lg={3} className="">
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
                          {validator.message(
                            "cnic",
                            formInput.cnic,
                            "required",
                            {
                              className: "text-danger",
                            }
                            )}
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
                        </Col>
  
                        <Col lg={6}>
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
          </div>
        </>
      );
}
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
