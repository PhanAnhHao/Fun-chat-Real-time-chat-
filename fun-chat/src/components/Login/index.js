import React from 'react'
import { Row, Col, Button, Typography } from 'antd';

import { auth, db } from '../../firebase/config';
import { FacebookAuthProvider, signInWithPopup } from 'firebase/auth';

import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { addDocument } from '../../firebase/services';

const { Title } = Typography;

const fbProvider = new FacebookAuthProvider();

export default function Login() {

    const handleFbLogin = async () => {
        try {
            const result = await signInWithPopup(auth, fbProvider);
            // console.log('Đăng nhập thành công:', result.user);

            if (result._tokenResponse.isNewUser) {
                await addDocument('users', {
                    displayName: result.user.displayName,
                    email: result.user.email,
                    photoURL: result.user.photoURL,
                    uid: result.user.uid,
                    providerId: result.user.providerData[0].providerId,
                });
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
        }
    };


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
