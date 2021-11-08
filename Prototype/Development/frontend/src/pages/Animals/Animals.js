import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getAnimals } from '../../actions/farmActions'

function Animals(props) {
    useEffect(() => {
        async function getAnimalsData() {
            await props.getAnimals()
        }
        getAnimalsData()
    }, [])
    return (
        <div>
            
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

export default connect(mapStateToProps, mapDispatchToProps)(Animals);