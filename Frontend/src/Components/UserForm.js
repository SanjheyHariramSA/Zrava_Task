import React, { useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";

function UserForm() {
  const [formData, setFormData] = useState({
    userName: "",
    district: "",
    state: "",
    country: "",
  });

  // Function for HandleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const datas = await axios.post("https://zrava-interview-api.onrender.com/create", formData);
    if (datas.data.success) {
      alert(datas.data.message);
    }
    setFormData({
      userName: "",
      district: "",
      state: "",
      country: "",
    });
  };

  // Function for Handle Change
  function handleChange(e){
    const {value,name}=e.target;
    setFormData((pre)=>{
      return{
        ...pre,[name]:value
      }
    })
  }
  return (
    <div>
      <h1 className="text-success">Add User</h1>
      <section className="form mt-3">
        <Form onSubmit={handleSubmit}>
          <Container>
            <Row>
              <Col md={3}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Name"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    placeholder="Sanjhey Hariram SA"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                  />
                </FloatingLabel>
              </Col>
              <Col md={3}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="District"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    placeholder="Karur"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                  />
                </FloatingLabel>
              </Col>
              <Col md={3}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="State"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    placeholder="Tamil Nadu"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </FloatingLabel>
              </Col>
              <Col md={3}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Country"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    placeholder="India"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-center">
                <Button variant="outline-success" type="submit">Add</Button>
              </Col>
            </Row>
          </Container>
        </Form>
      </section>
    </div>
  );
}

export default UserForm;
