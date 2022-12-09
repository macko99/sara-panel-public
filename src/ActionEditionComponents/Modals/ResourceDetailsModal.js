import React, {useEffect, useState} from 'react';
import {Container, Image, Modal, Row} from "react-bootstrap";
import UserService from "../../services/user.service";
import errorAlert from "../../common/requestRelated/errorAlert";
import MySpinner from "../../common/MySpinner";
import {useIndexedDB} from "react-indexed-db";
import {useTranslation} from "react-i18next";

const ResourceDetailsModal = (props) => {

    const { t } = useTranslation();

    // access the IndexedDB
    const { add, getByIndex} = useIndexedDB('resources');

    const show = props.showResourceDetailsModal.show;
    const user = props.showResourceDetailsModal.user;
    const point = props.showResourceDetailsModal.point;
    const [loading, setLoading] = useState(true);

    const [loadedImage, setLoadedImage] = useState(null);

    // ----- HOOKS -----
    // GET download photo OR get it from sessionStorage
    useEffect(() => {
        setLoading(true);
        setLoadedImage(null);
        if(show && point){
            getByIndex('uuid', point.uuid).then(photoFromDB => {
                if(photoFromDB){
                    setLoadedImage(photoFromDB.photo);
                }
                else {
                    UserService.getBlob(point.uuid)
                        .then((response) => {
                                if(response.status >= 200 && response.status <= 299){
                                    setLoadedImage(response.data);
                                    if(response.data.length > 0){
                                        add({uuid: point.uuid, photo: response.data}).then(
                                            () => {/* console.log('photo added to DB', event);*/},
                                            () => {/* console.log(error); */}
                                        );
                                    }
                                }
                            },
                            (error) => {errorAlert(error)}
                        );
                }
            });
            }
            setLoading(false);
    }, [props])

    // ----- FUNCTIONS -----

    // ----- RENDER -----
    if(!user || !point)
        return null;

    return (
        <Modal show={show}  onHide={() => {
            props.setShowResourceDetailsModal({show: false, point: null, user: null})
        }}
        >
            <Modal.Header closeButton>
                <Modal.Title>{t("Resource")} {point.id} - {point.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <p><strong>{t("Description")}: </strong>{point.description ? point.description : '-'}</p>
                    </Row>
                    <Row>
                        <p><strong>{t("User")}: </strong>{user.first_name === '-'
                        ? user.username
                            : user.first_name + ' ' + user.last_name }</p>
                        <p>
                            <strong>{t("Phone")}: </strong>
                            <span className="phone-number">{user.phone.slice(3,6)} {user.phone.slice(6,9)} {user.phone.slice(9,12)}</span>
                        </p>
                    </Row>
                    <Row className="align-ctr">
                        {loading && <MySpinner />}
                        {!loading && (loadedImage
                            ? <Image src={"data:image/png;base64,"+loadedImage} alt="photo"/>
                            : <p>{t("No photo")}</p>)
                        }
                    </Row>
                </Container>

            </Modal.Body>
        </Modal>
    );
};

export default ResourceDetailsModal;