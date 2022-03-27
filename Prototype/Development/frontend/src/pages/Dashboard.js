import React, { useEffect,useState } from 'react'
import { SunspotLoader } from "react-awesome-loaders";
import { connect } from 'react-redux'
import { getAnimals } from '../actions/farmActions';
import {Bar} from 'react-chartjs-2'
import { useSelector} from "react-redux";
// import Loader from "../components/layouts/SunspotLoaderComponent"
import { getMilkProductionRecords } from '../services/apiServices';
import moment from "moment";

function LineChart(milkrecord){

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
    
    console.log("inside",milkrecord.data)
    let l_dates=[]
    let total_morning=[]
    let total_evening=[]

    let sorted_morning=[]
    let sorted_evening=[]
    var dict_morning ={} ;
    var dict_evening ={} ;
    const print=milkrecord.data? milkrecord.data.milkRecords.forEach(element => {
        console.log("printing ",element);
       
        l_dates.push( moment(element.date).format("MM/DD/YYYY"))
        let m=0
        let e=0
        let milkp=Object.keys(element.record).forEach((key) => {
            m=m + element.record[key].morning
            e=e + element.record[key].evening 
            
            })
        dict_morning[ moment(element.date).format("MM/DD/YYYY")]=m
        dict_evening[ moment(element.date).format("MM/DD/YYYY")]=e
        
        console.log(moment(element.date).format("MM/DD/YYYY"),m)
        total_morning.push(m)
        total_evening.push(e)
        milkp=0
        
        
        
        

    }):""

    var keys = Object.keys(dict_morning); // or loop over the object to get the array
        // keys will be in any order
        console.log(keys,"check th eorder")
        keys=keys.sort(); // maybe use custom sort, to change direction use .reverse()
        // keys now will be in wanted order

        for (var i=0; i<keys.length; i++) { // now lets iterate in sort order
            var key = keys[i];
            var value_morning = dict_morning[key];
            var value_evenning =dict_evening[key]
            /* do something with key & value here */
            sorted_morning.push(value_morning);
            sorted_evening.push(value_evenning);
          } 
          console.log(sorted_morning,"this is the correct order")
    console.log(total_morning,"here")



    const data={

        labels:keys,
        datasets:[

            {
                label: "Morning prod",
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                borderWidth: 1,
                //stack: 1,
                hoverBackgroundColor: "rgba(255,99,132,1)",
                hoverBorderColor: "rgba(255,0,132,4)",
                data: sorted_morning
              },
    
              {
                label: "Evening prod",
                backgroundColor: "rgba(155,231,91,0.2)",
                borderColor: "rgba(255,99,132,1)",
                borderWidth: 1,
                //stack: 1,
                hoverBackgroundColor: "rgba(255,0,132,1)",
                hoverBorderColor: "rgba(255,0,132,4)",
                data:sorted_evening
              }
        ]

    }
    return <Bar options={options.options} data={data} />;

}

function Dashboard(props) {
    const [record, setRecord] = useState("")
    useEffect(() => {
      async function getAnimalsData() {
        await props.getAnimals();
        console.log(props.getAnimals())
        let records= await getMilkProductionRecords(props.login.loginInfo.token) 
        setRecord(records)
        // console.log(records)
      }
   

      getAnimalsData();
      
    }, []);

    // useEffect(() => {
    //   console.log(props.animals)
    //   if (Object.keys(props.animals).length > 0) {
    //     const isInitialized = props.animals.animals.animalsData[0]
    //   }
    // }, [props.animals])
    return (
        <>
           
            {/* {console.log(data1)} */}
            {record?<div style={{width:"720px"}}> <LineChart {...record} /></div>: 
            <div class="container" style={{ display: "flex",width:"100%",justifyContent:"center",
            paddingTop:"10%"
                
            }}>
            <SunspotLoader
  
        gradientColors={["#28A745", "#E0E7FF"]}
        shadowColor={"#3730A3"}
        desktopSize={"128px"}
        mobileSize={"100px"}
      />
      </div> }
            
        </>
    )
}

const mapDispatchToProps = (dispatch) => {
    
  return {
    getAnimals: (data) => dispatch(getAnimals(data)),
    
  };
 

};

const mapStateToProps = (state) => {
    return {
        login: state.login,
        animals: state.farm.animals,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

