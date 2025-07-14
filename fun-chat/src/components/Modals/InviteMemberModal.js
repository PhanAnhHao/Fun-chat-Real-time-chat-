import { Avatar, Form, Input, Modal, Select, Spin } from 'antd'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AppContext } from '../../context/AppProvider'
import { addDocument } from '../../firebase/services';
import { AuthContext } from '../../context/AuthProvider';
import {
    serverTimestamp,
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs
} from 'firebase/firestore';
import { debounce } from 'lodash';
import { db } from '../../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';

function DebounceSelect({
    fetchOptions,
    debounceTimeout = 300,
    curMembers,
    ...props
}) {
    // Search: abcddassdfasdf

    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);

    const debounceFetcher = React.useMemo(() => {
        const loadOptions = (value) => {
            setOptions([]);
            setFetching(true);

            fetchOptions(value, curMembers).then((newOptions) => {
                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout, fetchOptions, curMembers]);

    useEffect(() => {
        return () => {
            // clear when unmount
            setOptions([]);
        };
    }, []);

    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size='small' /> : null}
            {...props}
        >
            {options.map((opt) => (
                <Select.Option key={opt.value} value={opt.value} title={opt.label}>
                    <Avatar size='small' src={opt.photoURL}>
                        {opt.photoURL ? '' : opt.label?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    {` ${opt.label}`}
                </Select.Option>
            ))}
        </Select>
    );
}

export function fetchUsersList(search, curMembers) {
    if (!search) return Promise.resolve([]);

    const collectionRef = collection(db, 'users');

    const q = query(
        collectionRef,
        where('keywords', 'array-contains', search.toLowerCase()),
        orderBy('displayName'),
        limit(20)
    );

    return getDocs(q).then((snapshot) =>
        snapshot.docs
            .map((doc) => ({
                label: doc.data().displayName,
                value: doc.data().uid,
                photoURL: doc.data().photoURL,
            }))
            .filter((opt) => !curMembers.includes(opt.value))
    );
}

// console.log(fetchUsersList());

export default function InviteMemberModal() {

    const {
        isInviteMemberVisible,
        setIsInviteMemberVisible,
        selectedRoomId,
        selectedRoom,
    } = useContext(AppContext);
    const { user: { uid }, } = useContext(AuthContext);
    const [value, setValue] = useState();
    const [form] = Form.useForm();

    const handleOk = async () => {
        // 👉 1) Reset form
        form.resetFields();
        setValue([]);

        // 👉 2) Tạo ref tới document 'rooms/<id>'
        const roomRef = doc(db, 'rooms', selectedRoomId);

        // 👉 3) Update trường members
        await updateDoc(roomRef, {
            members: [
                ...selectedRoom.members,
                ...value.map((val) => val.value),
            ],
        });

        // 👉 4) Đóng modal
        setIsInviteMemberVisible(false);
    };

    const handleCancel = () => {
        // reset form value
        form.resetFields();
        setValue([]);

        setIsInviteMemberVisible(false);
    }

    // console.log({ value });

    return (
        <div>
            <Modal title='Mời thêm thành viên' open={isInviteMemberVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout='vertical'>
                    <DebounceSelect
                        mode='multiple'
                        name='search-user'
                        label='Tên các thành viên'
                        value={value}
                        placeholder='Nhập tên thành viên'
                        fetchOptions={fetchUsersList}
                        onChange={(newValue) => setValue(newValue)}
                        style={{ width: '100%' }}
                        curMembers={selectedRoom.members}
                    />
                </Form>
            </Modal>
        </div>
    )
}
