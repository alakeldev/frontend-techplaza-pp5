import React, { Fragment, useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import styles from '../../styles/ForgetPasswordForm.module.css';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';

const ForgetPasswordForm = () => {

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const jwt_token = localStorage.getItem('access');
    if (user && jwt_token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        const res = await axiosInstance.post("/auth/password-reset/", { "email": email });
        if (res.status === 200) {
          toast.success("Check your Email please, reset link was sent to it");
          setEmail("");
        }
      } catch {
        setError("Failed to send reset link. Please try again.");
      }
    } else {
      setError("Please enter your registered email.");
    }
  };

  return (
    <HelmetProvider>
      <Fragment>
        <Helmet>
          <title>Forget Password - TechPlaza Platform</title>
        </Helmet>
        <NavBar />
        <Container className={styles.FormContainer}>
          <Form onSubmit={handleSubmit} className={styles.TheForm}>
            <h2>Reset Your Password</h2>
            {error && <p className={styles.ErrorMessage}>{error}</p>}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className={styles.FormLabel}>Enter Your Registered Email:</Form.Label>
              <Form.Control
                className={styles.FormField}
                type="email"
                placeholder="Enter email"
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className={styles.FormButton}>
              Send
            </Button>
          </Form>
        </Container>
        <Footer />
      </Fragment>
    </HelmetProvider>
  );
};

export default ForgetPasswordForm;
