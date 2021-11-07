import React, { useState, useEffect, useReducer } from "react";
import axios from 'axios'
import {
    Form,
    Button,
    Container,
    Row,
    Col,
    Card,
    FormControl,
    Alert,
    Image,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/userAction";
import loginpage from '../assets/images/loginimg.jpg'
import { toast } from "react-toastify";
import { useHistory } from "react-router";


export default function Login(props) {
<<<<<<< HEAD:Prototype/Development/frontend/src/pages/login.js

    const handleSubmit = (evt) => {
        evt.preventDefault()
        console.log(evt)
        console.log(evt.target.form[1]? evt.target.form[1] .value:"none" )
       
    
    }
=======
    const history = useHistory()
    const dispatch = useDispatch()
    
    const [formInput, setFormInput] = useReducer(
      (state, newState) => ({ ...state, ...newState }),
      {
        email: "",
        password: ""
      }
    );

    const handleInput = (evt) => {
        const name = evt.target.name;
        const newValue = evt.target.value;
        setFormInput({ [name]: newValue });
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(login(formInput.email, formInput.password))
    }

    const userLogin = useSelector((state) => state.login);
    const { loading, error, loginInfo } = userLogin;

    useEffect(() => {
        if (userLogin) {
            if (error) {
                toast.error('Invalid Login Details')
            } else if (loading == false) {
              history.push("/dashboard");
            }
        }
    }, [dispatch, userLogin])

>>>>>>> 8dda16d26a12f95818da2318bae08fef5f57fe37:Prototype/Development/frontend/src/pages/login.jsx
    return (
        <>
             <div className="d-flex flex-row"  style={{width:"100%",height:"100vh"}} >

                <div className="d-flex center" style={{width:"65%"}}>
                    <Image src={loginpage} align="center"  style={{maxWidth:"100%"}}/>
                
                </div>
                <div className="d-flex"   style={{width:"35%",alignItems:"center",justifyContent:"center"}}>
                    
                    <Card  style={{width:"80%",height:"65%",alignSelf:"center",boxShadow:"none" }} >
                        <Card.Img/>
                        <Card.Title style={{alignSelf:"center",margin:"10px" }} >Login</Card.Title>
                       <Card.Body style={{justifyContent:"start",fontSize:"12px" }}>
                            
                                <Form >
                                    <Form.Group style={{alignSelf:"start",justifyContent:"center"}}>
                                        <Form.Label > Email address</Form.Label>
<<<<<<< HEAD:Prototype/Development/frontend/src/pages/login.js
                                        <Form.Control name="email" id="email" type="email" placeholder="Example@email.com"
                                        style={{justifyContent:"start",fontSize:"10px" }} id="email" />
=======
                                        <Form.Control type="email"name="email" placeholder="Example@email.com" required onChange={handleInput}
                                        style={{justifyContent:"start",fontSize:"10px" }} />
>>>>>>> 8dda16d26a12f95818da2318bae08fef5f57fe37:Prototype/Development/frontend/src/pages/login.jsx

                                    </Form.Group >
                                    <Form.Group style={{alignSelf:"start",justifyContent:"center",marginTop:"10px"}}>
                                        <Form.Label > Password</Form.Label>
<<<<<<< HEAD:Prototype/Development/frontend/src/pages/login.js
                                        <Form.Control id="password" type="password" placeholder="Password"style={{justifyContent:"start",fontSize:"10px" }}/>

                                    </Form.Group >
                                   
                                <Button style={{width:"100%",marginTop:"20px",marginBottom:"20px",fontSize:"12px"}} 
                                 onClick={handleSubmit}
                            
                             variant="primary" type="submit">Login</Button>
=======
                                        <Form.Control type="password" name="password" placeholder="Password" required onChange={handleInput} style={{justifyContent:"start",fontSize:"10px" }} />

                                    </Form.Group >
                                   
                                <Button style={{width:"100%",marginTop:"20px",marginBottom:"20px",fontSize:"12px"}} variant="primary" type="submit" disabled={loading} onClick={handleSubmit}>Login</Button>
>>>>>>> 8dda16d26a12f95818da2318bae08fef5f57fe37:Prototype/Development/frontend/src/pages/login.jsx
                                    <Form.Text> Forgot your password?{" "}
                                     <a   href="https://tutorialdeep.com/bootstrap/bootstrap-button/" >Get help</a>
                                    </Form.Text>
                                 
                                </Form>
                        </Card.Body>
                        <Card.Footer style={{fontSize:"10px" }}>
                            <div className="d-flex"   style={{alignItems:"center",justifyContent:"center",width:"100%"}}> 
                                 Don't have an account? {"   "}
                                
                                <a  style={{marginLeft:"10px"}} href="https://tutorialdeep.com/bootstrap/bootstrap-button/" > Sign up</a>
                          
                            </div>
                        </Card.Footer>
                    </Card>
                </div>
            </div>  
        </>
    );
}