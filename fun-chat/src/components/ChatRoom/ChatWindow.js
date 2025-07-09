import React from 'react';
import styled from 'styled-components';
import { Button, Tooltip, Avatar, Form, Input, Alert } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import Message from './Message';

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);

  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__title {
      margin: 0;
      font-weight: bold;
    }

    &__description {
      font-size: 12px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const WrapperStyled = styled.div`
  height: 100vh;
`;

const ContentStyled = styled.div`
  height: calc(100% - 100px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

export default function ChatWindow() {
    return (
        <WrapperStyled>
            <HeaderStyled>
                <div className='header__info'>
                    <p className='header__title'>Room 1</p>
                    <span className='header__description'>Day la room 1</span>
                </div>
                <div>
                    <Button icon={<UserAddOutlined />} type='text'>Mời</Button>
                    <Avatar.Group size='small' maxCount={2}>
                        <Tooltip title="A">
                            <Avatar>A</Avatar>
                        </Tooltip>
                        <Tooltip title="B">
                            <Avatar>B</Avatar>
                        </Tooltip>
                        <Tooltip title="C">
                            <Avatar>C</Avatar>
                        </Tooltip>
                        <Tooltip title="D">
                            <Avatar>D</Avatar>
                        </Tooltip>
                    </Avatar.Group>
                </div>
            </HeaderStyled>
            <ContentStyled>
                <MessageListStyled>
                    <Message text='Test' photoUrl={null} displayName={'Hao`'} createdAt={122333123123123} />
                    <Message text='Test 1' photoUrl={null} displayName={'Hao`'} createdAt={122333123123123} />
                    <Message text='Test 12' photoUrl={null} displayName={'Hao`'} createdAt={122333123123123} />
                    <Message text='Test 123' photoUrl={null} displayName={'Hao`'} createdAt={122333123123123} />
                </MessageListStyled>
                <FormStyled>
                    <Form.Item>
                        <Input placeholder='Nhập tin nhắn' bordered={false} autoComplete='off' />
                    </Form.Item>
                    <Button type='primary'>Gửi</Button>
                </FormStyled>
            </ContentStyled>
        </WrapperStyled>
    );
};
