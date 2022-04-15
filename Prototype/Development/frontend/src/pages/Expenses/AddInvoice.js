import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
    Col,
    Row,
    InputGroup,
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
import { addInventoryCategory } from "../../services/apiServices";
import { getInventoryCategories } from "../../actions/inventoryActions";
import AccountModalImage from "../../assets/images/accountsecuritymodal.jpg";
import { filterTableStyles } from "../../assets/styledComponents/tableStyles";
import { addInvoice } from "../../services/apiServices";

function AddInvoice(props) {
    // variables and states to handle fields
    let history = useHistory();
    const [, forceUpdate] = useState();
    const [validator] = useState(new SimpleReactValidator());
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [showItemModal, setShowItemModal] = useState(false);
    const handleCategoryComponent = useCallback((state) => handleRowClick(state));

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
    ];

    // Invoice form inputs
    const [invoiceForm, setInvoiceForm] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            number: 69,
            date: Date(),
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

    // Function for adding new invoice
    const handleAddNewInvoice = async () => {
        let result = await addInvoice(invoiceForm, props.login.loginInfo.token);
        console.log(result);
        if (result.data.success) {
            // getCategoriesData();
            setInvoiceForm({
                number: 69,
                date: Date(),
                items: [],
                amount: 0,
            });
            toast.success("Invoice Added Successfuly!");
        } else {
            toast.error(result.data.message);
        }
    };

    // filters field to filter data
    const [filters, setFilters] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
        metric: "",
        itemsCount: 0,
        search: "",
        }
    );

    useEffect(() => {
        getCategoriesData();
    }, []);

    useEffect(() => {
        if (!props.inventoryCategories.loading) {
        if (props.inventoryCategories.success) {
            console.log(props.inventoryCategories.inventory);
            setCategories(props.inventoryCategories.inventory);
        }
        }
    }, [props.inventoryCategories]);

    useEffect(() => {
        console.log(categories);
    }, [categories]);

    //   When filter changes, this function will be called
    useEffect(() => {
        let dataCopy = categories;
        let filteredDataCopy = [];

        // Filtering based on status
        if (filters.metric) {
        dataCopy.forEach((c, idx) => {
            if (c.metric == filters.metric) {
            filteredDataCopy.push(c);
            }
        });
        dataCopy = [...filteredDataCopy];
        filteredDataCopy = [];
        }

        // performing search based on category name and description
        if (filters.search) {
        let searchField = filters.search.toLowerCase();
        dataCopy.forEach((c, idx) => {
            let check = false;
            if (c.name) {
            if (c.name.toLowerCase().includes(searchField)) {
                check = true;
            }
            }
            if (c.description) {
            if (c.description.toLowerCase().includes(searchField)) {
                check = true;
            }
            }
            if (check) {
            filteredDataCopy.push(c);
            }
        });
        dataCopy = [...filteredDataCopy];
        filteredDataCopy = [];
        }
        setFilteredCategories([...dataCopy]);
    }, [filters]);

    // Default function to call action function to fetch categories
    async function getCategoriesData() {
        await props.getInventoryCategories();
    }

    // when any row will be clicked in the table
    const handleRowClick = (row) => {
        console.log(row);
        history.push(`/inventory/category/${row._id}`);
    };

    const handleNewCategoryMetric = (e) => {
        setInvoiceForm({ ["metric"]: e.value });
    };

    //   API Call to add new category in inventory
    const submitNewCategory = async () => {
        if (!validator.allValid()) {
        validator.showMessages();
        forceUpdate(1);
        } else {
        let result = await addInventoryCategory(
            invoiceForm,
            props.login.loginInfo.token
        );
        //   closing the modal and setting form fields empty
        if (result.data.success) {
            getCategoriesData();
            setInvoiceForm({ ["name"]: "", ["description"]: "", ["metric"]: "" });
            toast.success("Category Added Into Your Inventory!");
        } else {
            toast.error(result.data.message);
        }
        }
    };

    const handleDatepickerFocus = (e) => {
        e.target.parentNode.parentNode.parentNode.classList.add("active");
    };
    const handleDatepickerBlur = (e) => {
        e.target.parentNode.parentNode.parentNode.classList.remove("active");
    };

    const subHeaderComponentMemo = React.useMemo(() => {
        return(
            <div className="text-right m-2">
                <Button variant="primary" onClick={() => setShowItemModal(true)}>
                    Add Item
                </Button>
            </div>
        )
    }, [props.inventoryCategories, filters]);

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
                    <Form.Label>Date</Form.Label>
                    <FormControl
                        id="date"
                        name="date"
                        value={invoiceForm.date}
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
                                    onRowClicked={handleCategoryComponent}
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
                        onClick={handleAddNewInvoice}
                    >
                        Add
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

            </div>
        </Container>
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
    inventoryCategories: state.farm.inventory,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddInvoice);
