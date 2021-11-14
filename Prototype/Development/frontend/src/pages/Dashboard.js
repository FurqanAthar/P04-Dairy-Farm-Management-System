import React, { useEffect,useState } from 'react'
import { connect } from 'react-redux'
import { getAnimals } from '../actions/farmActions';
import {Bar} from 'react-chartjs-2'
import { useSelector} from "react-redux";
import { getMilkProductionRecords } from '../services/apiServices';
import moment from "moment";
// const data1=[
//     {
//         date: '12/11/2021',
//         record: {
//             '1291juasuq77q': {
//                 'morning': 11,
//                 'evening': 13,
//                 'name': 'Raani',
//                 'tag': '001',
//             }
//         }
//     },
//     {
//         date: '13/11/2021',
//         record: {
//             '8921829hsa77q': {
//                 'morning': 31,
//                 'evening': 23,
//                 'name': 'Maharaani',
//                 'tag': '002',
//             }
//         }
//     }
// ]
function LineChart(milkrecord){
    
    console.log("inside",milkrecord.data)
    let l_dates=[]
    let total_morning=[]
    let total_evening=[]
    const print=milkrecord.data? milkrecord.data.milkRecords.forEach(element => {
        console.log("printing ",element);
       
        l_dates.push( moment(element.date).format("MM/DD/YYYY"))
        let m=0
        let e=0
        let milkp=Object.keys(element.record).forEach((key) => {
            m=m + element.record[key].morning
            e=e + element.record[key].evening 
            
            })
        
        console.log(m)
        total_morning.push(m)
        total_evening.push(e)
        milkp=0
    }):""
    console.log(total_morning)



    const data={

        labels:l_dates.sort(),
        datasets:[

            {
                label: "Morning prod",
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                borderWidth: 1,
                //stack: 1,
                hoverBackgroundColor: "rgba(255,99,132,1)",
                hoverBorderColor: "rgba(255,0,132,4)",
                data: total_morning
              },
    
              {
                label: "Evening prod",
                backgroundColor: "rgba(155,231,91,0.2)",
                borderColor: "rgba(255,99,132,1)",
                borderWidth: 1,
                //stack: 1,
                hoverBackgroundColor: "rgba(255,0,132,1)",
                hoverBorderColor: "rgba(255,0,132,4)",
                data: total_evening
              }
        ]

    }
    return <Bar data={data }/>

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
    const isInitialized = useSelector((state) => state.farm.animals.animals? state.farm.animals.animals.animalsData[0]:"none");
    return (
        <div style={{width:"720px"}}>
           
            {/* {console.log(data1)} */}
            {record? <LineChart {...record} />: <p> Waiting for Records </p>}
            
        </div>
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

