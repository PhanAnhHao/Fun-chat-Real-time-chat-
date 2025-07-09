import React from 'react'
import { Row, Col, Button, Typography } from 'antd';

import { auth } from '../../firebase/config';
import { FacebookAuthProvider, signInWithPopup } from 'firebase/auth';

import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const fbProvider = new FacebookAuthProvider();

export default function Login() {

    const handleFbLogin = () => {
        signInWithPopup(auth, fbProvider)
            .then((result) => {
                // console.log('Đăng nhập thành công:', result.user);
                console.log('Đăng nhập thành công');
            })
            .catch((error) => {
                console.error('Lỗi đăng nhập:', error);
            });
    }


    return (
        <div>
            <Row justify='center' style={{ height: 800 }}>
                <Col span={8}>
                    <Title style={{ textAlign: 'center' }} level={3}>
                        Fun chat
                    </Title>
                    <Button style={{ width: '100%', marginBottom: 5 }}>
                        Đăng nhập bằng GG
                    </Button>
                    <Button style={{ width: '100%', marginBottom: 5 }} onClick={handleFbLogin}>
                        Đăng nhập bằng FB
                    </Button>
                </Col>
            </Row>
        </div>
    )
}
