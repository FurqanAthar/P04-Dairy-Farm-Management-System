import React, { useState, useEffect, useReducer } from "react";
import {
  Col,
  Row,
  Container,
  Modal,
  Button,
  Form,
  FormControl,
} from "react-bootstrap";
import moment from "moment";
import Select from "react-select";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import { useHistory } from "react-router-dom";
import DataTable from "react-data-table-component";
import SimpleReactValidator from "simple-react-validator";
import { addTeamMember, deleteTeamMember } from '../../services/apiServices';
import TrashIcon from "../../assets/images/icons/trash.svg";
import SearchIcon from "../../assets/images/icons/search.svg";
import AccountModalImage from "../../assets/images/accountsecuritymodal.jpg";
import { filterTableStyles } from "../../assets/styledComponents/tableStyles";
import { filterTableSelectStyles } from "../../assets/styledComponents/selectStyles";
import { toast } from "react-toastify";
import { getTeamMembers } from "../../actions/farmActions";

function AddMembers(props) {
  const [, forceUpdate] = useState();
  const [show, setShow] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [validator] = useState(new SimpleReactValidator());
  
  useEffect(() => {
      async function getMembersData() {
        await props.getTeamMembers();
      }
      getMembersData();
  }, [])

  useEffect(() => {
      console.log('members', props.members)
      if (!props.members.loading) {
          if (props.members.success) {
              setTeamMembers([ ...props.members.members ])
          }
      } 
  }, [props.members])

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

  const roles = [
    { label: "Manager", value: "manager" },
    { label: "Employee", value: "employee" },
  ];

  const columns = [
    {
      name: "Name:",
      selector: "name",
      sortable: true,
      cell: (row) => (
        <div className="d-flex align-items-center">
          {row && row.image ? (
            <>
              <div className="generic-user-pic">
                <div className="user-pic">
                  <img src={row.image} alt="Image" />
                </div>
              </div>
              {row.name}
            </>
          ) : row && row.name ? (
            <>
              <div className="team-name-short mr-2">
                {row.name.replace(/[^a-zA-Z-0-9 ]/g, "").match(/\b\w/g)}
              </div>
              {row.name}
            </>
          ) : null}
        </div>
      ),
    },
    {
      name: "Email:",
      selector: "email",
      sortable: true,
      cell: (row) => <div>{row.email}</div>,
    },
    {
      name: "CNIC",
      selector: "cnic",
      sortable: true,
      //   cell: (row) => moment(row.dob).format("MM/DD/YYYY"),
    },
    {
      name: "Role:",
      selector: "role",
      cell: (row) => (
        <div className="d-flex align-items-center w-100 q-status-section justify-content-end">
          <div
            className={
              row.role === "admin"
                ? "badge badge-info mr-2"
                : row.role === "employee"
                ? "badge badge-danger mr-2"
                : "badge badge-success mr-2"
            }
          >
            {row.role}
          </div>
          {
              row.role != "admin" && props.login.loginInfo.role != "employee" ? (
                <Button
                    className="btn-icon m-0"
                    variant="outline-light"
                    onClick={() => deleteMember(row._id)}
                >
                    <img src={TrashIcon} alt="Trash Icon" className="icon-black" />
                </Button>
              ) : null
          }
        </div>
      ),
    },
  ];

  const deleteMember = async (id) => {
      let result = await deleteTeamMember({ id }, props.login.loginInfo.token)
      if (result.data.success) {
          async function getMembersData() {
            await props.getTeamMembers();
          }
          getMembersData();
          toast.success(result.data.message)
    } else {
          toast.error(result.data.message)
      }
  }

  const [formInput, setFormInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      name: "",
      email: "",
      password: "",
      cnic: "",
      role: "",
    }
  );

  const handleInput = (evt) => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });
  };

  const handleSelect = (e) => {
    setFormInput({ ["role"]: e.value });
  };

  const handleAddMember = async () => {
    setDisabled(true);

    if (!validator.allValid()) {
      validator.showMessages();
      forceUpdate(1);
    } else {
      let result = await addTeamMember(formInput, props.login.loginInfo.token);
      if (result.data.success) {
          setFormInput({
            name: "",
            email: "",
            password: "",
            cnic: "",
            role: "",
          });
          setShow(false)
          async function getMembersData() {
            await props.getTeamMembers();
          }
          getMembersData();
          toast.success(result.data.message)
        } else {
            toast.error(result.data.message)
        }
    }

    setDisabled(false);
  };

  return (
    <div className="animals-page mt-4 mb-4">
      <Container>
        <div className="d-flex justify-content-end">
          <Button
            variant="primary"
            onClick={() => {
              setShow(true);
            }}
          >
            Add New Member
          </Button>
        </div>
        <DataTable
          customStyles={filterTableStyles}
          responsive
          fixedHeader={true}
          columns={columns}
          data={teamMembers}
          // onRowClicked={handleAnimalComponent}
          subHeader
          // subHeaderComponent={subHeaderComponentMemo}
          pagination
          persistTableHead
        />

        <Modal
          animation={false}
          className="account-settings-modal"
          size="sm"
          centered
          show={show}
          onHide={() => {
              setShow(false)
          }}
        >
          <Modal.Header
            closeButton
            onClick={() => {
              setShow(false);
            }}
          ></Modal.Header>
          <Modal.Body>
            <div className="details">
              <div className="icon">
                <img src={AccountModalImage} alt="Icon Image" />
              </div>

              <div className="title">Add Member</div>
              <Form.Group>
                <Form.Label>Full Name</Form.Label>
                <FormControl
                  id="name"
                  name="name"
                  value={formInput.name}
                  onChange={handleInput}
                />
                {validator.message("name", formInput.name, "required", {
                  className: "text-danger",
                })}
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <FormControl
                  id="email"
                  name="email"
                  value={formInput.email}
                  onChange={handleInput}
                />
                {validator.message("email", formInput.email, "required|email", {
                  className: "text-danger",
                })}
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <FormControl
                  id="password"
                  name="password"
                  value={formInput.password}
                  onChange={handleInput}
                />
                {validator.message("password", formInput.password, "required", {
                  className: "text-danger",
                })}
              </Form.Group>
              <Form.Group>
                <Form.Label>CNIC</Form.Label>
                <FormControl
                  id="cnic"
                  name="cnic"
                  value={formInput.cnic}
                  onChange={handleInput}
                />
                {validator.message("cnic", formInput.cnic, "required", {
                  className: "text-danger",
                })}
              </Form.Group>
              <Form.Label>Type</Form.Label>
              <Select
                className="select-menu"
                options={roles}
                styles={customRoleControlStyles}
                value={{
                  label: formInput.role,
                  value: formInput.role,
                }}
                name="role"
                onChange={(e) => {
                  handleSelect(e);
                }}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-light"
              onClick={() => {
                setShow(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddMember}
              disabled={disabled}
            >
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
      getTeamMembers: (data) => dispatch(getTeamMembers(data)),
  };
};

const mapStateToProps = (state) => {
  return {
    login: state.login,
    members: state.farm.teamMembers
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMembers);

