import React, { useEffect, useReducer, useCallback, useState } from "react";
import { connect } from "react-redux";
import {
  Container,
  Button,
  Form,
  InputGroup,
  FormControl,
  Nav,
  Row,
  Col,
} from "react-bootstrap";
import { getMilkSupply } from "../../services/apiServices";
import { customRoleControlStyles } from "../../constants/designs";
import SimpleReactValidator from "simple-react-validator";
import moment from "moment";
import { Line } from "react-chartjs-2";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { NavLink, useHistory } from "react-router-dom";
import {
  redCombination,
  greenCombination,
  blueCombination,
  purpleCombination,
} from "../../constants/colorOptions";
import DataTable from "react-data-table-component";
import TrashIcon from "../../assets/images/icons/trash.svg";
import SearchIcon from "../../assets/images/icons/search.svg";
import PlusIcon from "../../assets/images/icons/plusicon.svg";
import { filterTableStyles } from "../../assets/styledComponents/tableStyles";
import { filterTableSelectStyles } from "../../assets/styledComponents/selectStyles";
import { monthOptions, months } from "../../constants/options";

function MilkSupplyList(props) {
  let history = useHistory();
  const [graphOptions, setGraphOptions] = useState({});
  const [graphDataFormat, setGraphFormatData] = useState({ labels: [] });
  const [data, setData] = useState([]);
  const [showList, setShowList] = useState(props.onlyGraph ? false : true);
  const [showGraph, setShowGraph] = useState(props.onlyGraph ? true : false);
  const [sortedData, setSortedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [validator] = useState(new SimpleReactValidator());
  const handleSupplyComponent = useCallback((state) => handleRowClick(state));
  const [filters, setFilters] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      date: "",
    }
  );
  const [graphData, setGraphData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      dates: [],
      revenues: [],
      wastes: [],
      quantitiesSupplied: [],
      quantitiesToRegulars: [],
      revenuesToRegulars: [],
      quantitiesToMilkmans: [],
      revenuesToMilkmans: [],
    }
  );
  const [graphDataMonths, setGraphDataMonths] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      months: [],
      revenues: [],
      wastes: [],
      quantitiesSupplied: [],
      quantitiesToRegulars: [],
      revenuesToRegulars: [],
      quantitiesToMilkmans: [],
      revenuesToMilkmans: [],
    }
  );

  const [graphFilters, setGraphFilters] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      monthBasis: false,
      month: "Combined",
      combinedRevenue: false,
      displayRevenue: true,
      fromDate: "",
      tillDate: "",
    }
  );

  const handleRowClick = (row) => {
    history.push({
      pathname: `/milk-supply/${row._id}`,
      state: {
        data: row,
      },
    });
  };

  useEffect(() => {
    async function getSuppliesData() {
      let result = await getMilkSupply(props.login.loginInfo.token);
      if (result.data.success) {
        setData([...result.data.data]);
      }
    }
    getSuppliesData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      let sortedDataTemp = data;
      sortedDataTemp.sort(function (a, b) {
        var dateA = new Date(a.date),
          dateB = new Date(b.date);
        return dateA - dateB;
      });
      sortedDataTemp.reverse();
      setSortedData([...sortedDataTemp]);
    }
  }, [data]);

  useEffect(() => {
    let ascData = sortedData.reverse();

    // calculating for month basis
    const collection = ascData.map((x) => ({
      ...x,
      date: moment(x.date).format("YYYY-MM-DD"),
    }));

    const mapDayToMonth = collection.map((x) => ({
      ...x,
      date: new Date(x.date).getMonth(),
    }));

    const revenuePerMonth = mapDayToMonth.reduce((acc, cur) => {
      acc[cur.date] = acc[cur.date] + cur.totalRevenue || cur.totalRevenue; // increment or initialize to cur.value
      return acc;
    }, {});

    // data of more than 1 month is present
    if (Object.keys(revenuePerMonth).length > 1) {
      const quantityPerMonth = mapDayToMonth.reduce((acc, cur) => {
        acc[cur.date] =
          acc[cur.date] + cur.totalQuantitySupplied ||
          cur.totalQuantitySupplied; // increment or initialize to cur.value
        return acc;
      }, {});

      const revenueRegularPerMonth = mapDayToMonth.reduce((acc, cur) => {
        acc[cur.date] =
          acc[cur.date] + cur.totalToCustomers.revenue ||
          cur.totalToCustomers.revenue; // increment or initialize to cur.value
        return acc;
      }, {});

      const quantityRegularPerMonth = mapDayToMonth.reduce((acc, cur) => {
        acc[cur.date] =
          acc[cur.date] + cur.totalToCustomers.quantity ||
          cur.totalToCustomers.quantity; // increment or initialize to cur.value
        return acc;
      }, {});

      const revenueMilkmanPerMonth = mapDayToMonth.reduce((acc, cur) => {
        acc[cur.date] =
          acc[cur.date] + cur.totalToMilkmans.revenue ||
          cur.totalToMilkmans.revenue; // increment or initialize to cur.value
        return acc;
      }, {});

      const quantityMilkmanPerMonth = mapDayToMonth.reduce((acc, cur) => {
        acc[cur.date] =
          acc[cur.date] + cur.totalToMilkmans.quantity ||
          cur.totalToMilkmans.quantity; // increment or initialize to cur.value
        return acc;
      }, {});

      setGraphDataMonths({
        wastes: [],
        months: Object.keys(revenuePerMonth).map((m) => months[m]),
        revenues: Object.values(revenuePerMonth),
        quantitiesSupplied: Object.values(quantityPerMonth),
        quantitiesToRegulars: Object.values(quantityRegularPerMonth),
        revenuesToRegulars: Object.values(revenueRegularPerMonth),
        quantitiesToMilkmans: Object.values(quantityMilkmanPerMonth),
        revenuesToMilkmans: Object.values(revenueMilkmanPerMonth),
      });

      setGraphFilters({ monthBasis: true });
    }
  }, [sortedData]);

  // formatting data for graphs
  useEffect(() => {
    // single month
    let ascData = sortedData.reverse();
    let dates = [],
      revenues = [],
      wastes = [],
      quantitiesSupplied = [],
      quantitiesToRegulars = [],
      revenuesToRegulars = [],
      quantitiesToMilkmans = [],
      revenuesToMilkmans = [];

    if (graphFilters.month != "Combined") {
      ascData = ascData.filter(function (value) {
        return (
          new Date(value.date).getMonth() === months.indexOf(graphFilters.month)
        );
      });
    }

    ascData.forEach((d) => {
      dates = [...dates, moment(d.date).format("MMM DD")];
      revenues = [...revenues, d.totalRevenue];
      wastes = [...wastes, d.waste.quantity];
      quantitiesSupplied = [...quantitiesSupplied, d.totalQuantitySupplied];
      quantitiesToRegulars = [
        ...quantitiesToRegulars,
        d.totalToCustomers.quantity,
      ];
      revenuesToRegulars = [...revenuesToRegulars, d.totalToCustomers.revenue];
      quantitiesToMilkmans = [
        ...quantitiesToMilkmans,
        d.totalToMilkmans.quantity,
      ];
      revenuesToMilkmans = [...revenuesToMilkmans, d.totalToMilkmans.revenue];
    });

    // setting state for graph data
    setGraphData({
      dates,
      revenues,
      wastes,
      quantitiesSupplied,
      quantitiesToRegulars,
      revenuesToRegulars,
      quantitiesToMilkmans,
      revenuesToMilkmans,
    });
  }, [
    sortedData,
    graphFilters.monthBasis,
    graphFilters.month,
    graphFilters.fromDate,
    graphFilters.tillDate,
  ]);

  useEffect(() => {
    let graphOptionsTemp = {
      title: {
        display: true,
        text: graphFilters.displayRevenue
          ? "Sales Trend"
          : "Quantity Supplied Trend",
        fontSize: 20,
      },
      scales: {
        y: {
          title: {
            display: true,
            text: graphFilters.displayRevenue
              ? "Sales (Rs.)"
              : "Quantity Supplied (Ltr.)",
          },
        },
        x: {
          title: { display: true, text: "Date" },
        },
        xAxes: [
          {
            type: "time",
            time: {
              displayFormats: {
                day: "MMM DD",
              },
            },
            ticks: {
              fontFamily: "Poppins",
            },
          },
        ],
      },
    };
    let datasets = graphFilters.combinedRevenue
      ? [
          {
            label: graphFilters.displayRevenue
              ? "Total Sales"
              : "Total Quantity Supplied",
            data: graphFilters.monthBasis
              ? graphFilters.displayRevenue
                ? graphDataMonths.revenues
                : graphDataMonths.quantitiesSupplied
              : graphFilters.displayRevenue
              ? graphData.revenues
              : graphData.quantitiesSupplied,
            fill: true,
            backgroundColor: greenCombination.lightRgb,
            borderColor: greenCombination.dark,
            tension: 0.1,
          },
        ]
      : [
          {
            label: graphFilters.displayRevenue
              ? "Sale to Regular Customers"
              : "Quantity supplied to Regular Customers",
            data: graphFilters.monthBasis
              ? graphFilters.displayRevenue
                ? graphDataMonths.revenuesToRegulars
                : graphDataMonths.quantitiesToRegulars
              : graphFilters.displayRevenue
              ? graphData.revenuesToRegulars
              : graphData.quantitiesToRegulars,
            fill: true,
            backgroundColor: greenCombination.lightRgb,
            borderColor: greenCombination.dark,
            tension: 0.1,
          },
          {
            label: graphFilters.displayRevenue
              ? "Sale to Milkmans"
              : "Quantity supplied to Milkmans",
            data: graphFilters.monthBasis
              ? graphFilters.displayRevenue
                ? graphDataMonths.revenuesToMilkmans
                : graphDataMonths.quantitiesToMilkmans
              : graphFilters.displayRevenue
              ? graphData.revenuesToMilkmans
              : graphData.quantitiesToMilkmans,
            fill: true,
            backgroundColor: purpleCombination.lightRgb,
            borderColor: purpleCombination.dark,
            tension: 0.1,
          },
        ];
    let graphDataFormatTemp = {
      labels: graphFilters.monthBasis
        ? graphDataMonths.months
        : graphData.dates,
      datasets: datasets,
    };
    setGraphOptions({ ...graphOptionsTemp });
    setGraphFormatData({ ...graphDataFormatTemp });
  }, [graphData, graphDataMonths, graphFilters]);

  useEffect(() => {
    let dataCopy = sortedData;
    let filteredDataCopy = [];

    // Filtering based on status
    if (filters.date) {
      dataCopy.forEach((c, idx) => {
        if (
          moment(c.date).format("MM/DD/YYYY") ==
          moment(filters.date).format("MM/DD/YYYY")
        ) {
          filteredDataCopy.push(c);
        }
      });
      dataCopy = [...filteredDataCopy];
      filteredDataCopy = [];
    }
    setFilteredData([...dataCopy]);
  }, [filters]);

  const columns = [
    {
      name: "Date",
      selector: "date",
      sortable: true,
      cell: (row) => (
        <div className="badge badge-info">
          {moment(row.date).format("MM/DD/YYYY")}
        </div>
      ),
    },
    {
      name: "Quantity Supplied:",
      selector: "totalQuantitySupplied",
      sortable: true,
    },
    {
      name: "Quantity Wasted:",
      selector: "waste.quantity",
      sortable: true,
      cell: (row) => row.waste.quantity,
    },
    {
      name: "Sales:",
      selector: "totalRevenue",
      sortable: true,
      cell: (row) => (
        <div className="badge badge-success">{row.totalRevenue}</div>
      ),
    },
    {
      name: "Customers:",
      selector: "customers",
      sortable: true,
      cell: (row) => (
        <div className="d-flex align-items-center">
          <div className="team-name-short mr-2">{row.customers.length}</div>
        </div>
      ),
    },

    {
      name: "",
      // selector: "status",
      cell: (row) => (
        <div className="d-flex align-items-center w-100 q-status-section justify-content-end">
          <Button
            className="btn-icon m-0"
            variant="outline-light"
            // onClick={() => deleteAnimalById(row._id)}
          >
            <img src={TrashIcon} alt="Trash Icon" className="icon-black" />
          </Button>
        </div>
      ),
    },
  ];

  // checking if any filter is set or not
  const filtersIsSet = () => {
    let set = false;
    Object.keys(filters).forEach((k, idx) => {
      if (filters[k]) {
        set = true;
      }
    });
    return set;
  };

  const handleFilter = (index, e, eTarget = null) => {
    let filtersCopy = filters;
    if (index === "date") {
      filtersCopy[index] = e;
      eTarget.target.closest(".input-group").classList.remove("active");
    }
    setFilters({ ...filtersCopy });
  };

  const handleDatepickerFocus = (e) => {
    e.target.parentNode.parentNode.parentNode.classList.add("active");
  };
  const handleDatepickerBlur = (e) => {
    e.target.parentNode.parentNode.parentNode.classList.remove("active");
  };

  const handleGraphFilter = (e, which) => {
    if (which == "salesFormat") {
      setGraphFilters({
        combinedRevenue: e.value == "Combined" ? true : false,
      });
    } else if (which === "trend-type") {
      setGraphFilters({
        displayRevenue: e.value == "Revenue" ? true : false,
      });
    } else if (which === "month") {
      if (e.value !== "Combined") {
        setGraphFilters({
          monthBasis: false,
          month: e.value,
        });
      }
    }
  };

  const FilterComponent = ({}) => (
    <div className="d-flex align-items-center justify-content-between tableHead">
      <div className="table-filters">
        <Form.Group className="datepicker mb-0">
          <InputGroup className={"input-group"}>
            <InputGroup.Prepend>
              <InputGroup.Text className="">
                <span className="icon"></span>
              </InputGroup.Text>
            </InputGroup.Prepend>
            <DatePicker
              selected={filters.date}
              isClearable={true}
              className="datepicker-form-control"
              onChange={(date, e) => handleFilter("date", date, e)}
              onFocus={handleDatepickerFocus}
              onBlur={handleDatepickerBlur}
            />
          </InputGroup>
        </Form.Group>
      </div>

      <Button onClick={() => history.push("/milk-supply/add")}>
        <img src={PlusIcon} alt="Icon Image" /> <span>Add Supply Record</span>
      </Button>
    </div>
  );

  const subHeaderComponentMemo = React.useMemo(() => {
    return <FilterComponent />;
  }, [data, filters]);

  const handleShowList = () => {
    setShowGraph(false);
    setShowList(true);
  };
  const handleShowGraph = () => {
    setShowList(false);
    setShowGraph(true);
  };

  return (
    <div className="animals-page mt-4 mb-4">
      <Container>
        {!props.onlyGraph ? (
          <Row className="d-flex justify-content-center">
            <Col lg={3}>
              <Button onClick={() => handleShowList()}>Show List</Button>{" "}
              <Button onClick={() => handleShowGraph()}>Show Graph</Button>
            </Col>
          </Row>
        ) : null}
        {showGraph ? (
          <Row className="d-flex justify-content-center mt-5">
            <Col lg={10} className="bg-white graph-container">
              <Row className="d-flex justify-content-center">
                <Col lg={3}>
                  <Form.Group className="mr-2">
                    <Form.Label>Month</Form.Label>
                    <Select
                      className="select-menu"
                      options={monthOptions}
                      styles={customRoleControlStyles}
                      value={{
                        label: graphFilters.month,
                        value: graphFilters.month,
                      }}
                      name={`month`}
                      onChange={(e) => {
                        handleGraphFilter(e, "month");
                      }}
                    />
                    {validator.message(
                      `month`,
                      graphFilters.month,
                      "required",
                      {
                        className: "text-danger",
                      }
                    )}
                  </Form.Group>
                </Col>
                <Col lg={3}>
                  <Form.Group className="mr-2">
                    <Form.Label>Trend Type</Form.Label>
                    <Select
                      className="select-menu"
                      options={[
                        { label: "Revenue", value: "Revenue" },
                        { label: "Quantity", value: "Quantity" },
                      ]}
                      styles={customRoleControlStyles}
                      value={{
                        label: graphFilters.displayRevenue
                          ? "Revenue"
                          : "Quantity",
                        value: graphFilters.displayRevenue
                          ? "Revenue"
                          : "Quantity",
                      }}
                      name={`trend-type`}
                      onChange={(e) => {
                        handleGraphFilter(e, "trend-type");
                      }}
                    />
                    {validator.message(
                      `trend-type`,
                      graphFilters.displayRevenue,
                      "required",
                      {
                        className: "text-danger",
                      }
                    )}
                  </Form.Group>
                </Col>
                <Col lg={3}>
                  <Form.Group className="mr-2">
                    <Form.Label>Sales Format</Form.Label>
                    <Select
                      className="select-menu"
                      options={[
                        { label: "Combined", value: "Combined" },
                        { label: "Separate", value: "Seperate" },
                      ]}
                      styles={customRoleControlStyles}
                      value={{
                        label: graphFilters.combinedRevenue
                          ? "Combined"
                          : "Separate",
                        value: graphFilters.combinedRevenue
                          ? "Combined"
                          : "Separate",
                      }}
                      name={`sales-format`}
                      onChange={(e) => {
                        handleGraphFilter(e, "salesFormat");
                      }}
                    />
                    {validator.message(
                      `sales-format`,
                      graphFilters.combinedRevenue,
                      "required",
                      {
                        className: "text-danger",
                      }
                    )}
                  </Form.Group>
                </Col>
              </Row>
              {graphDataFormat.labels.length > 0 ? (
                <>
                  <Line data={graphDataFormat} options={graphOptions} />
                </>
              ) : null}
            </Col>
          </Row>
        ) : (
          <div className="mt-5">
            <DataTable
              customStyles={filterTableStyles}
              responsive
              fixedHeader={true}
              columns={columns}
              data={filtersIsSet() ? filteredData : sortedData}
              onRowClicked={handleSupplyComponent}
              subHeader
              subHeaderComponent={subHeaderComponentMemo}
              pagination
              persistTableHead
            />
          </div>
        )}
      </Container>
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MilkSupplyList);
