import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import SnakeGameBoard from '../../components/SnakeGameBoard';
import SnakeGameHighScores from '../../components/SnakeGameHighScores';
import axiosInstance from '../../utils/axiosInstance';
import styles from '../../styles/SnakeGame.module.css';

const SnakeGame = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const jwt_token = localStorage.getItem('access');
  const navigate = useNavigate();
  const [highScores, setHighScores] = useState([]);
  const [isScreenLarge, setIsScreenLarge] = useState(window.innerWidth >= 768);

  useEffect(() => {
    if (jwt_token === null && !user) {
      navigate("/login");
    }
  }, [jwt_token, user, navigate]);

  useEffect(() => {
    axiosInstance.get('/game1/high_scores/')
      .then(response => {
        const sortedScores = response.data.sort((a, b) => b.score - a.score);
        setHighScores(sortedScores.slice(0, 3));
      })
      .catch(error => console.error('Error fetching high scores:', error));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsScreenLarge(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDashboardClick = () => {
    navigate("/dashboard");
  };

  return (
    <Fragment>
      <NavBar />
      <div className={styles.mainContainer}>
        <Container className="content">
          <h1 className="text-black text-uppercase text-center my-4">Welcome To Snake Game</h1>
          {isScreenLarge ? (
            <>
              <div className={styles.highScoresContainer}>
                <SnakeGameHighScores highScores={highScores} />
              </div>
              <Button className={styles.dashboardButton} onClick={handleDashboardClick}>Dashboard</Button>
              <Row className="justify-content-center">
                <Col md={8} sm={10}>
                  <Card className={styles.gameCard}>
                    <SnakeGameBoard highScores={highScores} setHighScores={setHighScores} />
                  </Card>
                </Col>
              </Row>
            </>
          ) : (
            <div className={styles.smallScreenMessage}>
              <p>Your screen device is too small to run the game. We are currently working on a version of the Snake Game for small and medium screens. Please check back later!</p>
              <Button className={styles.dashboardButton} onClick={handleDashboardClick}>Dashboard</Button>
            </div>
          )}
        </Container>
      </div>
      <Footer />
    </Fragment>
  );
};

export default SnakeGame;