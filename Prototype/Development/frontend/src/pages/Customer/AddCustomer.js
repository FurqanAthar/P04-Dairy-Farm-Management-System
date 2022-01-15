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
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import { addAnimal } from "../../actions/farmActions";
import SimpleReactValidator from "simple-react-validator";
import chevLeft from "../../assets/images/icons/cheveron-left.svg";
import axios from "axios";



const AddCustomer = () => {

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
          await props.addAnimal({ ...formInput })
      }; 
  
      useEffect(() => {
          if (!props.addAnimalState.loading) {
              if (props.addAnimalState.success) {
                  toast.success('Animal Added Successfully!')
                  history.push('/animals')
              } else {
                  toast.error(props.addAnimalState.error)
              }
          }
      }, [props.addAnimalState])




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
                      Add Animal
                    </h2>
                  </Col>
                </Row>
              </Container>
            </div>
            <Container>
              <Row className="justify-content-md-center">
                <Col lg={10}>
                  <div className="details">
                    <div class="personal-info">
                      <label htmlFor="profile_image">
                        {image ? (
                          <div className="user-pic">
                            <img src={image} alt="Image" />
                          </div>
                        ) : (
                          <>
                            <div class="name-spell">AI</div>
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
                      <div class="text-details">
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
                        </Col>
                        <Col lg={6} className="">
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
                        <Col lg={12}>
                          <Button
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={disabled}
                          >
                            Save
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

export default AddCustomer
