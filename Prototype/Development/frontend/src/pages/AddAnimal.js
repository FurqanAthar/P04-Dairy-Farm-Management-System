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
import Select from "react-select";
import { useHistory } from "react-router";
import Logo from '../assets/images/logo.jpg'
import LoginSlider from '../components/layouts/Slider'
import SimpleReactValidator from "simple-react-validator";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import loginpage from '../assets/images/loginimg.jpg'
import avatar from '../assets/images/download.png'

export default function AddAnimal(props) {
    return (
        <>
           <div className="d-flex"   style={{width:"100%",alignItems:"center",justifyContent:"center",fontSize:"12px"}}>
            
                <Card  style={{width:"80%",height:"100vh",alignSelf:"center",justifyContent:"center",boxShadow:"none",marginTop:"20px" }} >
                        <Card.Img  />
                        <Card.Title style={{alignSelf:"center",margin:"10px" }} >Animal details</Card.Title>
                       <Card.Body style={{justifyContent:"start",fontSize:"12px" }}>
                            
                                <Form style={{justifyContent:"center" }} >
                                    <Row >
                                        <Col className="mb-5">
                                    <Form.Group style={{alignSelf:"start",justifyContent:"center",marginBottom:"10px"}}>
                                        <Form.Label > Name-tag</Form.Label>
                                        <Form.Control name="name" id="name" placeholder="Cow-1234"
                                        style={{justifyContent:"start",fontSize:"12px" }} id="email" />
                                        
                                    </Form.Group >
                                    <Form.Group controlId="type`" style={{alignSelf:"start",justifyContent:"center",fontSize:"12px"}}>
                                        <Form.Label > Type of animal </Form.Label>
                                        <Form.Select aria-label="Default select example" style={{fontSize:"12px"}}>
                                            <option>Open this select menu</option>
                                            <option value="1">Cow</option>
                                            <option value="2">Heifer</option>
                                            <option value="3">goat</option>
                                        </Form.Select>
                                        

                


                                    </Form.Group >
                                    </Col>
                                    <Col>
                                    
                                        <Form.Group controlId="dob">
                                            <Form.Label>Select Date of Birth</Form.Label>
                                            <Form.Control type="date" name="dob" placeholder="Date of Birth"
                                            style={{justifyContent:"start",fontSize:"12px",marginBottom:"12px" }} />
                                        </Form.Group>
                                       
                                        <Form.Group controlId="staus" style={{justifyContent:"start",fontSize:"12px",marginTop:"12px" }}>
                                       
    
                                                <Form.Label>Select state of animal</Form.Label>
                                        <Row>   
                                        <Col>  
                                             <Form.Check 
                                                type="radio"
                                                id="radio"
                                                label="Alive-milking"
                                                name="radAnswer" 
                                            />
                                        </Col>
                                        
                                        <Col>
                                            <Form.Check 
                                                type="radio"
                                                id="radio"
                                                label="Alive-non milking"
                                                name="radAnswer" 
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Check 
                                                type="radio"
                                                id="radio"
                                                label="Inactive"
                                                name="radAnswer" 
                                            />
                                        </Col>
                                        </Row>
                                        </Form.Group>
                                    

                                    </Col>
                                   </Row>
                                <Button style={{width:"40%",marginTop:"20px",marginBottom:"20px",fontSize:"12px"}} 
                                
                            
                             variant="primary" type="submit">Save details</Button>
                                    
                                 
                                </Form>

                        </Card.Body>
                        
                    </Card>
      
          </div>
        
 





            
        </>
       
    );
}