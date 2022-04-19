import React, { useEffect, useState } from "react";
import { SunspotLoader } from "react-awesome-loaders";
import { connect } from "react-redux";
import { getAnimals } from "../actions/farmActions";
import { Container, Col, Row } from "react-bootstrap";
import { getCustomers } from "../actions/customerAction";
import { Bar } from "react-chartjs-2";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { filterTableStyles } from "../assets/styledComponents/tableStyles";
import { filterTableSelectStyles } from "../assets/styledComponents/selectStyles";
// import Loader from "../components/layouts/SunspotLoaderComponent"
import { getMilkProductionRecords } from "../services/apiServices";
import moment from "moment";
import MilkSupplyList from "./DailyRecord/MilkSupplyList";

function LineChart(milkrecord) {
  const options = {
    options: {
      scales: {
        y: {
          Title: { text: "Litres" },
          title: {
            display: true,
            text: "litres milk",
          },
        },
        x: {
          Title: { text: "Litres" },
          title: {
            display: true,
            text: "Date (Month/Day/year))",
          },
        },
      },

      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Total Milk Production in litres against date",
        },
      },
    },
  };

  console.log("inside", milkrecord.data);
  let l_dates = [];
  let total_morning = [];
  let total_evening = [];

  let sorted_morning = [];
  let sorted_evening = [];
  var dict_morning = {};
  var dict_evening = {};
  const print = milkrecord.data
    ? milkrecord.data.milkRecords.forEach((element) => {
        console.log("printing ", element);

        l_dates.push(moment(element.date).format("MM/DD/YYYY"));
        let m = 0;
        let e = 0;
        let milkp = Object.keys(element.record).forEach((key) => {
          m = m + element.record[key].morning;
          e = e + element.record[key].evening;
        });
        dict_morning[moment(element.date).format("MM/DD/YYYY")] = m;
        dict_evening[moment(element.date).format("MM/DD/YYYY")] = e;

        console.log(moment(element.date).format("MM/DD/YYYY"), m);
        total_morning.push(m);
        total_evening.push(e);
        milkp = 0;
      })
    : "";

  var keys = Object.keys(dict_morning); // or loop over the object to get the array
  // keys will be in any order
  console.log(keys, "check th eorder");
  keys = keys.sort(); // maybe use custom sort, to change direction use .reverse()
  // keys now will be in wanted order

  for (var i = 0; i < keys.length; i++) {
    // now lets iterate in sort order
    var key = keys[i];
    var value_morning = dict_morning[key];
    var value_evenning = dict_evening[key];
    /* do something with key & value here */
    sorted_morning.push(value_morning);
    sorted_evening.push(value_evenning);
  }
  console.log(sorted_morning, "this is the correct order");
  console.log(total_morning, "here");

  const data = {
    labels: keys,
    datasets: [
      {
        label: "Morning prod",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        //stack: 1,
        hoverBackgroundColor: "rgba(255,99,132,1)",
        hoverBorderColor: "rgba(255,0,132,4)",
        data: sorted_morning,
      },

      {
        label: "Evening prod",
        backgroundColor: "rgba(155,231,91,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        //stack: 1,
        hoverBackgroundColor: "rgba(255,0,132,1)",
        hoverBorderColor: "rgba(255,0,132,4)",
        data: sorted_evening,
      },
    ],
  };
  return <Bar options={options.options} data={data} />;
}

function Dashboard(props) {
  const history = useHistory();
  const [customersList, setCustomersList] = useState([]);
  const [animalsList, setAnimalsList] = useState([]);
  const [record, setRecord] = useState("");

  const animalColumns = [
    {
      name: "Name:",
      selector: "name",
      sortable: true,
      cell: (row) => (
        <div className="d-flex align-items-center mt-2">
          {row && row.image ? (
            <>
              <div className="generic-user-pic-lg mr-2">
                <div className="user-pic">
                  <img src={row.image} alt="Image" />
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div>{row.name}</div>
              </div>
            </>
          ) : row && row.name ? (
            <>
              <div className="generic-team-name-short mr-2">
                {row.name.replace(/[^a-zA-Z-0-9 ]/g, "").match(/\b\w/g)}
              </div>
            </>
          ) : null}
        </div>
      ),
    },
    {
      name: "Status:",
      selector: "status",
      cell: (row) => (
        <div className="d-flex align-items-center q-status-section justify-content-end">
          <div
            className={
              row.status === "Active" || row.status === "Sent to approval"
                ? "badge badge-info mr-2"
                : row.status === "Inactive"
                ? "badge badge-danger mr-2"
                : "badge badge-success mr-2"
            }
          >
            {row.status}
          </div>
        </div>
      ),
    },
  ];
  const customerColumns = [
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
              <div className="generic-team-name-short mr-2">
                {row.name.replace(/[^a-zA-Z-0-9 ]/g, "").match(/\b\w/g)}
              </div>
              {row.name}
            </>
          ) : null}
        </div>
      ),
    },
    {
      name: "Date of Birth",
      selector: "dob",
      sortable: true,
      cell: (row) => moment(row.dob).format("MM/DD/YYYY"),
    },
    {
      name: "Status:",
      selector: "status",
      cell: (row) => (
        <div className="d-flex align-items-center q-status-section justify-content-end">
          <div
            className={
              row.status === "Active" || row.status === "Sent to approval"
                ? "badge badge-info mr-2"
                : row.status === "Inactive"
                ? "badge badge-danger mr-2"
                : "badge badge-success mr-2"
            }
          >
            {row.status}
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    async function getCustomersData() {
      await props.getCustomers();
    }
    getCustomersData();
  }, []);

  useEffect(() => {
    if (props.customers.customers) {
      setCustomersList(props.customers.customers.customersData);
    }
  }, [props.customers]);

  useEffect(() => {
    async function getAnimalsData() {
      await props.getAnimals();
      console.log(props.getAnimals());
      let records = await getMilkProductionRecords(props.login.loginInfo.token);
      setRecord(records);
      // console.log(records)
    }

    getAnimalsData();
  }, []);

  useEffect(() => {
    if (Object.keys(props.login.loginInfo).length <= 0) {
      history.push("/register");
    }
  }, [props.login]);

  useEffect(() => {
    console.log("props.animals", props.animals);
    if (!props.animals.loading) {
      if (props.animals.success) {
        setAnimalsList([...props.animals.animals.animalsData]);
      }
    }
  }, [props.animals]);

  return (
    <>
      {/* {console.log(data1)} */}
      <div className="add-animal">
        <Container>
          <Row className="mt-5 justify-content-md-center">
            <Col lg={10}>
              <div className="details">
                <Row className="p-30">
                  <Col lg={12}>
                    <MilkSupplyList onlyGraph={true} />
                  </Col>
                  <Col lg={6}>
                    <h4>Animals</h4>
                    {animalsList.length > 0 ? (
                      <>
                        <DataTable
                          customStyles={filterTableStyles}
                          responsive
                          fixedHeader={true}
                          columns={animalColumns}
                          data={animalsList}
                          persistTableHead
                        />
                      </>
                    ) : (
                      "No Animals in Dairy Account"
                    )}
                  </Col>
                  <Col lg={6}>
                    <h4>Customers</h4>
                    {customersList.length > 0 ? (
                      <>
                        <DataTable
                          customStyles={filterTableStyles}
                          responsive
                          fixedHeader={true}
                          columns={customerColumns}
                          data={customersList}
                          persistTableHead
                        />
                      </>
                    ) : (
                      "No Customers in Dairy Account"
                    )}
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      {/* {record ? (
        <div style={{ width: "720px" }}>
          {" "}
          <LineChart {...record} />
        </div>
      ) : (
        <div
          class="container"
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            paddingTop: "10%",
          }}
        >
          <SunspotLoader
            gradientColors={["#28A745", "#E0E7FF"]}
            shadowColor={"#3730A3"}
            desktopSize={"128px"}
            mobileSize={"100px"}
          />
        </div>
      )} */}
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCustomers: (data) => dispatch(getCustomers(data)),
    getAnimals: (data) => dispatch(getAnimals(data)),
  };
};

const mapStateToProps = (state) => {
  return {
    login: state.login,
    animals: state.farm.animals,
    customers: state.customer.customers,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
