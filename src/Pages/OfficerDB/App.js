// import React, { useState } from 'react';
// import popup from './components/popup';
// import logo from './logo.svg';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Row,ButtonToolbar,Col,Container,Table,Navbar,Form,InputGroup,FormControl,Nav} from 'react-bootstrap'
// //import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
// //import Row from 'react-bootstrap/Row'
// //import Container from 'react-bootstrap/Container'
// export default class extends Component {
//   constructor (props) {
//     super(props)
//     this.state = {
//       email: '',
//       password: '',
//       message: '',
//       AnimationCSS1: {},
//       AnimationCSS2: {}
//     }
//
//     this.handleChange = this.handleChange.bind(this)
//     this.handleSubmit = this.handleSubmit.bind(this)
//   }
//
// // let people = [
// //   {
// //   num: "1",
// //   firstName: "Surabhi",
// //   lastName: "Gupta",
// //   id: "@surabhig",
// //   fb: "surabhig",
// //   description: "....",
// //   major: "Software Engineering"
// // },
// // {
// // num: "2",
// // firstName: "Zach",
// // lastName: "Menes",
// // id: "@zachymemes",
// // fb: "zachMenes",
// // description: "....",
// // major: "Computer Engineering"
// // },
// //
// // {
// //   num: "3",
// //   firstName: "Thai",
// //   lastName: "Quach",
// //   id: "@thaiquach",
// //   fb: "thaiQ",
// //   description: "it doesnt matter",
// //   major: "Software Engineering"
// // }]
//
// function row({num, firstName, lastName, id, fb, description, major}){
//   return(
//     <tr>
//     <td>{num}</td>
//     <td>{firstName}</td>
//     <td>{lastName}</td>
//     <td>{id}</td>
//     <td>{fb}</td>
//     <td>{description}</td>
//     <td>{major}</td>
//   </tr>
// )
// }
//
// function App() {
//
//   return (
//     <div className="App">
//
//       <link
//         rel="stylesheet"
//         href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
//         integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
//         crossorigin="anonymous"
//       />
//
//
//
//       <>
//   <Navbar bg="dark" variant="dark">
//     <Navbar.Brand href="#home">Home</Navbar.Brand>
//     <Nav className="mr-auto">
//       <Nav.Link href="#home">Add Member</Nav.Link>
//     </Nav>
//     <Form inline>
//       <FormControl type="text" placeholder="Search" className="mr-sm-2" />
//       <Button variant="outline-info">Search</Button>
//     </Form>
//   </Navbar>
//
// </>
//
//
//
//
//       <header className="App-header">
//         <h1>
//         Officer Page
//         </h1>
//       </header>
//
//
//
//       <Table striped bordered hover variant="dark">
//   <thead>
//     <tr>
//       <th>#</th>
//       <th>First Name</th>
//       <th>Last Name</th>
//       <th>LinkedIn</th>
//       <th>Facebook</th>
//       <th>Description</th>
//       <th>Major</th>
//     </tr>
//   </thead>
//   <tbody>
//
//     {people.map((person) => {return row(person)})} {/*returning the html*/}
//
//
//
//   </tbody>
// </Table>
// <Modal />
//
//     </div>
//
//
//   );
// }
//
// export default App;
