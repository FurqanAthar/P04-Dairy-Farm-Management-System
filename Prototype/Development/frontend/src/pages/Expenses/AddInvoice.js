import React, { useState, useReducer, useEffect } from "react";
import {
    Container,
    Modal,
    Button,
    Form,
    FormControl,
} from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { useHistory, Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import SimpleReactValidator from "simple-react-validator";
import AccountModalImage from "../../assets/images/accountsecuritymodal.jpg";
import TrashIcon from "../../assets/images/icons/trash.svg";
import { filterTableStyles } from "../../assets/styledComponents/tableStyles";
import { getInvoiceData } from "../../actions/expenseActions";
import { addInvoice } from "../../services/apiServices";

function AddInvoice(props) {
    // variables and states to handle fields
	const history = useHistory();
	const [, forceUpdate] = useState();
    const [validator] = useState(new SimpleReactValidator());
    const [items, setItems] = useState([]);
    const [showItemModal, setShowItemModal] = useState(false);
	const [showAlertModal, setShowAlertModal] = useState(false);

    // columns to display on data table
    const columns = [
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
		{
			name: "",
			selector: "remove",
			cell: (row) => <Button variant="outline-light" onClick={() => handleRemoveItem(row)}> <img src={TrashIcon} /> </Button>,
		},
    ];

    // Invoice form inputs
    const [invoiceForm, setInvoiceForm] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            number: 0,
            items: [],
            amount: 0,
        }
    );

    // Item form inputs
    const [itemForm, setItemForm] = useReducer(
        (state, newState) => ({ ...state, ...newState}),
        {
            name: "",
            quantity: 0,
            rate: 0,
            amount: 0,
        }
    );

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
				setInvoiceForm({
					number: props.expense.invoices.length + 1,
				});
			}
		}
	}, [props.expense]);

    // Function for item form inputs
    const handleNewItemInputs = (evt) => {
        const name = evt.target.name;
        const newValue = evt.target.value;
        setItemForm({ 
            [name]: newValue,
        });
        if (name == "quantity") {
            setItemForm({
                amount: newValue * itemForm.rate,
            });
        } else if (name == "rate") {
            setItemForm({
                amount: newValue * itemForm.quantity,
            });
        }
    };

    // Function for adding new item
    const handleAddNewItem = () => {
        setItems([...items, itemForm]);
        setInvoiceForm({
            amount: invoiceForm.amount + itemForm.amount,
        });
        setShowItemModal(false);
        setItemForm({
            name: "",
            quantity: 0,
            rate: 0,
            amount: 0,
        });
    };

	// Function to remove item
	const handleRemoveItem = (item) => {
		setItems(items.filter(i => i != item));
	};

    // Function for adding new invoice
    const handleAddNewInvoice = async () => {
		for (let i=0; i<items.length; i++) {
			setInvoiceForm({
				items: invoiceForm.items.push(items[i]),
			});
		};
		if (invoiceForm.items.length == 0) {
			toast.error("No items added!");
		} else {
			let result = await addInvoice(invoiceForm, props.login.loginInfo.token);
			if (result.data.success) {
				setItems([]);
				setInvoiceForm({
					number: 69,
					items: [],
					amount: 0,
				});
				toast.success("Invoice Added Successfuly!");
			} else {
				toast.error(result.data.message);
			}
			history.push("/expense");
		}
    };

    const subHeaderComponentMemo = React.useMemo(() => {
        return(
            <div className="text-right m-2">
                <Button variant="primary" onClick={() => setShowItemModal(true)}>
                    Add Item
                </Button>
            </div>
        )
    });

    return (
        <div className="animals-page mt-4 mb-4">
        <Container>
            <div>
            <div className="d-flex mb-4 justify-content-center">
                New Invoice
            </div>

            {/* Input form for new invoice */}
            <Container>
                <div className="details">
                    <Form.Group>
                    <Form.Label>Invoice Number</Form.Label>
                    <FormControl
                        id="number"
                        name="number"
                        value={invoiceForm.number}
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
                                    columns={columns}
                                    data={items}
                                    subHeader
                                    subHeaderComponent={subHeaderComponentMemo}
                                    pagination
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
                        id="totalAmount"
                        name="totalAmount"
                        value={invoiceForm.amount}
                        readOnly
                    />
                    </Form.Group>
                </div>
                <div className="pb-10">
                    <Link to="/expense">
                        <Button
                            className="float-right mb-4"
                            variant="outline-light"
                        >
                            Cancel
                        </Button>
                    </Link>	
					<Button
						variant="primary"
						onClick={() => setShowAlertModal(true)}
					>
						Add Invoice
					</Button>
                </div>
            </Container>

            {/* Modal to add new item in invoice */}
            <Modal
                animation={false}
                className="account-settings-modal"
                size="sm"
                centered
                show={showItemModal}
                onHide={() => {
                setShowItemModal(false);
                }}
            >
                <Modal.Header
                closeButton
                onClick={() => {
                    setShowItemModal(false);
                }}
                ></Modal.Header>
                <Modal.Body>
                <div className="details">
                    <div className="icon">
                    <img src={AccountModalImage} alt="Icon Image" />
                    </div>

                    <div className="title">Add Item</div>
                    <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <FormControl
                        id="name"
                        name="name"
                        value={itemForm.name}
                        onChange={handleNewItemInputs}
                    />
                    {validator.message("name", itemForm.name, "required", {
                        className: "text-danger",
                    })}
                    </Form.Group>
                    <Form.Group>
                    <Form.Label>Qty</Form.Label>
                    <FormControl
                        id="quantity"
                        name="quantity"
                        value={itemForm.quantity}
                        onChange={handleNewItemInputs}
                    />
                    {validator.message("quantity", itemForm.quantity, "required", {
                        className: "text-danger",
                        }
                    )}
                    </Form.Group>
                    <Form.Group>
                    <Form.Label>Rate</Form.Label>
                    <FormControl
                        id="rate"
                        name="rate"
                        value={itemForm.rate}
                        onChange={handleNewItemInputs}
                    />
                    {validator.message("rate", itemForm.rate, "required", {
                        className: "text-danger",
                        }
                    )}
                    </Form.Group>
                    <Form.Group>
                    <Form.Label>Amount</Form.Label>
                    <FormControl
                        id="amount"
                        name="amount"
                        value={itemForm.amount}
                        readOnly
                    />
                    {validator.message("amount", itemForm.amount, "required", {
                    className: "text-danger",
                    })}
                    </Form.Group>
                </div>
                </Modal.Body>
                <Modal.Footer>
                <Button
                    variant="outline-light"
                    onClick={() => {
                    setShowItemModal(false);
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleAddNewItem}
                >
                    Add
                </Button>
                </Modal.Footer>
            </Modal>

			<Modal
			size="sm"
			centered
			show={showAlertModal}
			>
				<Modal.Body>
					Once the invoice is added, it cannot be altered. Do you want to continue?
				</Modal.Body>
				<Modal.Footer>
					<Button
					variant="primary"
					onClick={handleAddNewInvoice}
					>
						Continue
					</Button>
					<Button
					variant="outline-light"
					onClick={() => setShowAlertModal(false)}
					>
						Cancel
					</Button>
				</Modal.Footer>

			</Modal>

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

export default connect(mapStateToProps, mapDispatchToProps)(AddInvoice);
