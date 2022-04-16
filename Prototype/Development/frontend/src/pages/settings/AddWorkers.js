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
import { getTeamMembers, getWorkers } from "../../actions/farmActions";
import { addWorker, editWorker } from "../../services/apiServices";

function AddWorkers(props) {
    const [, forceUpdate] = useState();
    const [show, setShow] = useState(false);
	const [edit, setEdit] = useState(false);
    const [disabled, setDisabled] = useState(false);
	const [workerInstance, setWorkerInstance] = useState({});
    const [workers, setWorkers] = useState([]);
    const [validator] = useState(new SimpleReactValidator());
	const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }),
		{
			name: "",
			number: "",
			work: "",
			cnic: "",
			salary: 0,
			status: ""
		}
	);
    
    useEffect(() => {
        getWorkersData();
    }, [])

    useEffect(() => {
        if (!props.workers.loading) {
            if (props.workers.success) {
                setWorkers([ ...props.workers.workers ])
            }
        } 
    }, [props.workers])

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

	const status = [
		{ label: "Active", value: "active" },
		{ label: "Inactive", value: "inactive" },
	]

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
            name: "Contact Number:",
            selector: "number",
            sortable: true,
            cell: (row) => <div>{row.number}</div>,
        },
        {
            name: "CNIC",
            selector: "cnic",
            sortable: true,
        },
        {
            name: "Work Assigned",
            selector: "work",
            sortable: true,
        },
		{
            name: "Salary",
            selector: "salary",
            sortable: true,
        },
        {
            name: "Status:",
            selector: "status",
            cell: (row) => (
                    <div
                        className={
                        row.status === "active"
                            ? "badge badge-success mr-2"
                            : row.status === "inactive"
                            ? "badge badge-danger mr-2"
                            : "badge badge-info mr-2"
                        }
                    >
						{
							row.status === "active" ? "Active" : row.status === "inactive" ? "Inactive" : "Idle"
						}
                    </div>
            ),
        },
        {
            name: "",
            selector: "actions",
            cell: (row) => (
                    row.role != "admin" && props.login.loginInfo.role != "employee" ? (
                        <Button
                            className="btn-icon m-0"
                            variant="outline-light"
                            onClick={() => { setEdit(true); updateFormInput(row); setShow(true) } }
                        >
                            Edit
                        </Button>
                    ) : null
            )
        }
    ];

	async function getWorkersData() {
		await props.getWorkers();
	};

	const handleInput = (evt) => {
		const name = evt.target.name;
		const newValue = evt.target.value;
		setFormInput({ [name]: newValue });
	};

	const handleSelect = (e) => {
		setFormInput({ ["status"]: e.value });
	};

	async function updateWorkerInstance(worker) {
		await setWorkerInstance(workerInstance => ({
			...workerInstance,
			worker
		}));
	}

	const updateFormInput = (evt) => {
		setWorkerInstance(workerInstance => ({
			...workerInstance,
			...evt
		}));
		setFormInput({
			name: evt.name,
			number: evt.number,
			work: evt.work,
			cnic: evt.cnic,
			salary: evt.salary,
			status: evt.status
		});
	};
	
    const handleEditWorker = async () => {
		setDisabled(true);
		if (!validator.allValid()) {
			validator.showMessages();
			forceUpdate(1);
		} else {
			let worker = workerInstance;
			worker.name = formInput.name;
			worker.number = formInput.number;
			worker.work = formInput.work;
			worker.cnic = formInput.cnic;
			worker.salary = formInput.salary;
			worker.status = formInput.status;
			let result = await editWorker(worker, props.login.loginInfo.token);
			if (result.data.success) {
				setFormInput({
					name: "",
					number: "",
					work: "",
					cnic: "",
					salary: 0,
					status: ""
				});
				getWorkersData();
				setShow(false);
				toast.success(result.data.message);
			} else {
				toast.error(result.data.message);
			}
		}
		setDisabled(false);
    }

    const handleAddWorker = async () => {
        setDisabled(true);
        if (!validator.allValid()) {
			validator.showMessages();
			forceUpdate(1);
        } else {
			let result = await addWorker(formInput, props.login.loginInfo.token);
			if (result.data.success) {
				setFormInput({
					name: "",
					number: "",
					work: "",
					cnic: "",
					salary: 0,
					status: ""
				});
				setShow(false)
				getWorkersData();
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
				<div>
					<div className="d-flex mb-4 justify-content-center">
						<h2>
							WORKERS
						</h2>
					</div>
					<div className="d-flex mb-4 justify-content-end">
						<Button
							variant="primary"
							onClick={() => {
							setShow(true);
							}}
						>
							Add New Worker
						</Button>
					</div>
				</div>
                <DataTable
                    customStyles={filterTableStyles}
                    responsive
                    fixedHeader={true}
                    columns={columns}
                    data={workers}
                    pagination
                    persistTableHead
                />

                <Modal
                    animation={false}
                    className="account-settings-modal"
                    size="sm"
                    centered
                    show={show}
                    onHide={() => { setShow(false) }}
                >
                    <Modal.Header
                        closeButton
                        onClick={() => { 
							setEdit(false); 
							setShow(false); 
							setFormInput({
								name: "",
								number: "",
								work: "",
								cnic: "",
								salary: 0,
								status: ""
							});
							setWorkerInstance({});
						}}
                    ></Modal.Header>
                    <Modal.Body>
                        <div className="details">
                            <div className="icon">
                                <img src={AccountModalImage} alt="Icon Image" />
                            </div>

                            <div className="title">
								{
									edit === true ? "Edit Worker" : "Add Worker"
								}
							</div>
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
                                <Form.Label>Contact Number</Form.Label>
                                <FormControl
                                id="number"
                                name="number"
                                value={formInput.number}
                                onChange={handleInput}
                                />
                                {validator.message("number", formInput.number, "required", {
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
                            <Form.Group>
                                <Form.Label>Work Assigned</Form.Label>
                                <FormControl
                                id="work"
                                name="work"
                                value={formInput.work}
                                onChange={handleInput}
                                />
                                {validator.message("work", formInput.work, "required", {
                                className: "text-danger",
                                })}
                            </Form.Group>
							<Form.Group>
                                <Form.Label>Salary</Form.Label>
                                <FormControl
                                id="salary"
                                name="salary"
                                value={formInput.salary}
                                onChange={handleInput}
                                />
                                {validator.message("salary", formInput.salary, "required", {
                                className: "text-danger",
                                })}
                            </Form.Group>
							<Form.Label>Status</Form.Label>
							<Select
								className="select-menu"
								options={status}
								styles={customRoleControlStyles}
								value={{
								label: formInput.status,
								value: formInput.status,
								}}
								name="status"
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
							setEdit(false);
							setFormInput({
								name: "",
								number: "",
								work: "",
								cnic: "",
								salary: 0,
								status: ""
							});
							setWorkerInstance({});
                        }}
                        >
                        	Cancel
                        </Button>
                        <Button
                        variant="primary"
                        onClick={
							edit === true ? handleEditWorker : handleAddWorker
						}
                        disabled={disabled}
                        >
							{
								edit === true ? "Apply Changes" : "Add"
							}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
}

const mapDispatchToProps = (dispatch) => {
    return {
        getWorkers: (data) => dispatch(getWorkers(data)),
    };
};

const mapStateToProps = (state) => {
	console.log("YOHOOOO:", state.farm.workers);
    return {
        login: state.login,
        workers: state.farm.workers
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddWorkers);
