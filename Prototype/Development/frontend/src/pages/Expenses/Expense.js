import React, { useState, useEffect } from "react";
import {
    Container,
    Modal,
    Button,
    Form,
    FormControl,
} from "react-bootstrap";
import { connect } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { filterTableStyles } from "../../assets/styledComponents/tableStyles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getInvoiceData } from "../../actions/expenseActions";

function Expense(props) {
    // Variables and states to handle fields
	const [invoices, setInvoices] = useState([]);
	const [show, setShow] = useState(false);
	const [invoice, setInvoice] = useState({});
	const [filteredInvoices, setFilteredInvoices] = useState([]);
	const [date, setDate] = useState("");
	const [filter, setFilter] = useState(false);

    // Columns to display on data table
    const columns = [
        {
			name: "Invoice No",
			selector: "number",
			sortable: true,
			cell: (row) => <div>{row.number}</div>,
        },
        {
			name: "Date",
			selector: "date",
			cell: (row) => <div>{row.createdAt}</div>,
        },
        {
			name: "Total Items",
			selector: "items",
			sortable: true,
			cell: (row) => <div>{row.items.length}</div>,
        },
        {
			name: "Total Amount",
			selector: "amount",
			cell: (row) => <div> {row.amount} </div>,
		},
		{
            name: "",
            selector: "actions",
            cell: (row) => (
					<Button
						className="btn-icon m-0"
						variant="outline-primary"
						onClick={() => { setInvoice(row); setShow(true) } }
					>
						View Invoice
					</Button>
            )
        },
	];

	// Columns to display on data table in modal
    const modalColumns = [
        {
        name: "Name",
        selector: "name",
        sortable: true,
        cell: (row) => <div>{row.name}</div>,
        },
        {
        name: "Quantity",
        selector: "quantity",
        cell: (row) => <div>{row.quantity}</div>,
        },
        {
        name: "Rate",
        selector: "rate",
        sortable: true,
        cell: (row) => <div>{row.rate}</div>,
        },
        {
        name: "Amount",
        selector: "amount",
        cell: (row) => <div> {row.amount} </div>,
        },
    ];
	
	// Default function to call action function to fetch invoices
	async function getInvoices() {
		await props.getInvoiceData();
	};

	// Function for getting all invoices everytime the page is rendered
	useEffect(() => {
		getInvoices();
	}, []);
	
	// Helper function for getting invoices
	useEffect(() => {
		if (!props.expense.loading) {
			if (props.expense.success) {
				setInvoices(props.expense);
			}
		}
	}, [props.expense]);
	
	// Function to update filter date
	const handleUpdateFilterDate = (date) => {
		let day = date.getDate().toString();
		let month = (date.getMonth() + 1).toString();
		let year = date.getFullYear().toString();
		if (month.length == 1) {
			date = day + "/" + "0" + month + "/" + year;
		} else if (day.length == 1) {
			date = "0" + day + "/" + "0" +  month + "/" + year;
		} else {
			date = day + "/" + month + "/" + year;
		};
		setDate(date);
	};
	
	// Function to filter invoices
	const handleFilterInvoices = () => {
		let tempInvoices = [];
		for (let i=0; i<invoices.invoices.length; i++) {
			let createdDate = invoices.invoices[i].createdAt;
			createdDate = createdDate.toString();
			let day = createdDate.slice(8, 10);
			let month = createdDate.slice(5, 7);
			let year = createdDate.slice(0, 4);
			createdDate = day + "/" + month + "/" + year;
			if (createdDate == date) {
				tempInvoices.push(invoices.invoices[i]);
			};
		};
		setFilteredInvoices(tempInvoices);
		setFilter(true);
	};

	// Header component to show filter options in invoices table
    const subHeaderComponentMemo = React.useMemo(() => {
        return(
			<div className="d-flex align-items-center justify-content-between tableHead">
				<div className="table-filters">
					<Form.Group className="mb-0">
						<DatePicker
						placeholderText={date === "" ? "Select Date" : date}
						onChange={(date) => handleUpdateFilterDate(date)}
						/>
					</Form.Group>
				</div>
				< div className="table-filters justify-content-end">
					<Button variant="outline-primary" onClick={() => handleFilterInvoices()}>
						Apply Filter
					</Button>
				</div>
				< div className="table-filters justify-content-end">
					<Button 
					variant="outline-light" 
					onClick={() => { setFilter(false); setDate(""); setFilteredInvoices([]) }}
					>
						Remove Filter
					</Button>
				</div>
			</div>
		);
    });

    return (
        <div className="animals-page mt-4 mb-4">
        <Container>
            <div>
				<div className="d-flex mb-4 justify-content-center">
					Expenses
				</div>

				{/* Button to Modal for adding new category */}
				<div className="d-flex mb-4 justify-content-end">
					<Link to="/expense/addInvoice">
						<Button variant="primary">
							New Invoice
						</Button>
					</Link>
				</div>

				{/* Table to display all categories in inventory */}
				<Container>
					<DataTable
					customStyles={filterTableStyles}
					responsive
					fixedHeader={true}
					columns={columns}
					data={filter ? filteredInvoices : invoices.invoices}
					subHeader
					subHeaderComponent={subHeaderComponentMemo}
					pagination
					persistTableHead
					/>
				</Container>

				{/* Modal to view invoice */}
				<Container>
					<Modal
						animation={false}
						className="account-settings-modal"
						size="sm"
						centered
						show={show}
						onHide={() => {
						setShow(false);
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
							<div className="title">Invoice</div>
							<Form.Group>
							<Form.Label>Number</Form.Label>
							<FormControl
								id="number"
								name="number"
								value={invoice.number}
								readOnly
							/>
							</Form.Group>
							<Form.Group>
							<Form.Label>Created On</Form.Label>
							<FormControl
								id="date"
								name="date"
								value={invoice.createdAt}
								readOnly
							/>
							</Form.Group>
							<Form.Group>
							<Form.Label>Items</Form.Label>
							{/* Table to show items in the invoice */}
							{
								<div className="row">
									{
										<Container>
											<DataTable
											customStyles={filterTableStyles}
											responsive
											fixedHeader={true}
											columns={modalColumns}
											data={invoice.items}
											persistTableHead
											/>
										</Container>
									}
								</div>
							}
							</Form.Group>
							<Form.Group>
							<Form.Label>Total Amount</Form.Label>
							<FormControl
								id="amount"
								name="amount"
								value={invoice.amount}
								readOnly
							/>
							</Form.Group>
						</div>
						</Modal.Body>
						<Modal.Footer>
						<Button
							variant="primary"
							onClick={() => {
								setShow(false);
							}}
						>
							Close
						</Button>
						</Modal.Footer>
					</Modal>
				</Container>

            </div>
        </Container>
        </div>
    );
}

const mapDispatchToProps = (dispatch) => {
    return {
        getInvoiceData: (data) => dispatch(getInvoiceData(data)),
    };
};

const mapStateToProps = (state) => {
	return {
        login: state.login,
        expense: state.farm.expense,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Expense);
