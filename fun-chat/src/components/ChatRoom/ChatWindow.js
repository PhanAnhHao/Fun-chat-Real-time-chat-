import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, Tooltip, Avatar, Form, Input, Alert, message } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import Message from './Message';
import { AppContext } from '../../context/AppProvider';
import { serverTimestamp } from 'firebase/firestore';
import { addDocument } from '../../firebase/services';
import { AuthContext } from '../../context/AuthProvider';
import useFirestore from '../hooks/useFirestore';


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

// search: 'Tun'
/**
 * db: collection 'users'
 * {
 * displayName: "Tung Nguyen David" => ["Tung", "Nguyen", "David"] => [Tung, David, Nguyen] => [David, Nguyen, Tung],...
 * keywords = ["T", "Tu", "Tun", "Tung", "Tung N", ......, "N", "Ng" ,...... ]
 * ...
 * }
 * displayName: "ABC Tung"
 * ...
 * }
 */

export default function ChatWindow() {

  const { rooms,
    selectedRoomId,
    selectedRoom,
    members,
    setIsInviteMemberVisible } = useContext(AppContext);
  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext);


  const [inputValue, setInputValue] = useState('');
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const messageListRef = useRef(null);

  // let selectedRoom;

  // if (!selectedRoomId) {
  //   selectedRoom = rooms[0];
  // } else {
  //   selectedRoom = useMemo(() => rooms.find((room) => room.id === selectedRoomId), [rooms, selectedRoomId]);
  // }

  // console.log({ rooms, selectedRoomId });

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleOnSubmit = async () => {
    // 1) Thêm message mới
    await addDocument('messages', {
      text: inputValue,
      uid,
      photoURL,
      roomId: selectedRoom.id,
      displayName,
      createdAt: serverTimestamp(), // 🔑 thêm timestamp nếu cần
    });

    // 2) Reset chỉ trường 'message' của form
    form.resetFields(['message']);

    // 3) Focus lại input (nên bọc trong setTimeout 0 để đảm bảo render xong)
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 0);
    }
  };

  const condition = React.useMemo(
    () => ({
      fieldName: 'roomId',
      operator: '==',
      compareValue: selectedRoom.id,
    }),
    [selectedRoom.id]
  );

  const messages = useFirestore('messages', condition);

  useEffect(() => {
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);


  return (
    <WrapperStyled>
      {
        selectedRoom.id ? (
          <>
            <HeaderStyled>
              <div className='header__info'>
                <p className='header__title'>{selectedRoom?.name}</p>
                <span className='header__description'>{selectedRoom?.description}</span>
              </div>
              <div>
                <Button icon={<UserAddOutlined />} type='text' onClick={() => setIsInviteMemberVisible(true)}>Mời</Button>
                <Avatar.Group size='small' maxCount={2}>
                  {
                    members.map(member => <Tooltip title={member.displayName} key={member.id}>
                      <Avatar src={member.photoURL}>{member.photoURL ? '' : member.displayName?.charAt(0)?.toUpperCase()}</Avatar>
                    </Tooltip>)
                  }
                </Avatar.Group>
              </div>
            </HeaderStyled>
            <ContentStyled>
              <MessageListStyled>
                {messages
                  .sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds)
                  .map((mes) => (
                    <Message
                      key={mes.id}
                      text={mes.text}
                      photoURL={mes.photoURL}
                      displayName={mes.displayName}
                      createdAt={mes.createdAt}
                    />
                  ))}
              </MessageListStyled>
              <FormStyled form={form}>
                <Form.Item name="message">
                  <Input onChange={handleInputChange} onPressEnter={handleOnSubmit} placeholder='Nhập tin nhắn' bordered={false} autoComplete='off' />
                </Form.Item>
                <Button type='primary' onClick={handleOnSubmit}>Gửi</Button>
              </FormStyled>
            </ContentStyled>
          </>
        )
          : (
            <Alert message="Hãy chọn phòng" type='info' showIcon style={{ margin: 4 }} closable></Alert>
          )
      }

    </WrapperStyled>
  );
};
