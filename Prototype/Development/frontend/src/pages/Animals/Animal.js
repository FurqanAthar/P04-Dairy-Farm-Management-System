import axios from 'axios'
import { connect } from 'react-redux'
import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { getAnimalData } from '../../services/apiServices'

function Animal(props) {
    const { id } = useParams()

    useEffect(() => {
        async function getData() {
            await getAnimalData(id, props.login.loginInfo.token)
        }
    }, [])

    return (
        <div>
            
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
  return {
  };
};
const mapStateToProps = (state) => {
  return {
    login: state.login,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Animal);
