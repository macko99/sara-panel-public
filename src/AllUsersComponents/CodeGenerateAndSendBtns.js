import React, {useState} from 'react';
import {Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import UserService from "../services/user.service";
import errorAlert from "../common/requestRelated/errorAlert";

const CodeGenerateAndSendBtns = (props) => {

    // ----- STATES -----
    const [code, setCode] = useState('------')
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);

    // ----- FUNCTIONS -----
    function handleCodeRequest() {
        setLoading(true);
        UserService.postUserCodeGenerate({user: props.userID})
            .then((response) => {
                    if(response.status >= 200 && response.status <= 299){
                        console.log(response.data);
                        setCode(response.data.invitaion_code);
                        setLoading(false);
                    }
                },
                (error) => {errorAlert(error, setLoading)}
            );
    }

    function handleCodeSend() {
        if(code !== '------'){
            setLoading2(true);
            const data={
                number_with_prefix: props.phone,
                login_code: code
            }
            UserService.postSMSinvite(data)
                .then((response) => {
                        if(response.status >= 200 && response.status <= 299){
                            console.log(response.data);
                            setCode('------');
                            setLoading2(false);
                        }
                    },
                    (error) => {errorAlert(error, setLoading2)}
                );
        }
    }

    return (
        [<td className="align-ctr" key={1}>
            <OverlayTrigger
                placement='bottom'
                overlay={<Tooltip>Kliknij, aby wygenerować kod
                </Tooltip>}
            >
                <Button
                    variant="outline-primary"
                    onClick={() => {handleCodeRequest()}}
                >
                    {loading ? 'Ładuję' : 'Generuj'}
                </Button>
            </OverlayTrigger>
        </td>,
        <td key={2} className="align-ctr">
            {code}
        </td>,
        <td hidden={!props.smsService} key={3} className="align-ctr">
            <OverlayTrigger
                placement='bottom'
                overlay={
                    <Tooltip>{code === "------" ? 'Wygeneruj najpierw kod' : 'Kliknij, aby wysłać kod SMSem'}
                        </Tooltip>}
            >
                <span>
                    <Button
                        disabled={code === "------"}
                        variant={code === "------" ? "secondary": "outline-primary"}
                        onClick={() => {handleCodeSend()}}
                    >
                    {loading2 ? 'Ładuję' : 'Wyślij'}
                    </Button>
                </span>
            </OverlayTrigger>
        </td>
        ]
        );
};

export default CodeGenerateAndSendBtns;