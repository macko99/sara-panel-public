import React from 'react';
import {Col, Container, Row, Spinner} from "react-bootstrap";

const MySpinner = () => {
    return (
        <Container>
            <Row className='spinner'>
                <Col className="spinner">
                    <Spinner animation="grow" role="status" align='center'>
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Col>
            </Row>
        </Container>
    );
};

export default MySpinner;
