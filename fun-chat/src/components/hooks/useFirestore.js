import { useEffect, useState } from 'react';
import {
    collection as firestoreCollection, // Tạo tham chiếu đến collection
    query,  // Hàm tạo query Firestore
    where,  // Hàm tạo điều kiện lọc
    orderBy, // Hàm sắp xếp
    onSnapshot // Hàm đăng ký listener realtime
} from 'firebase/firestore';
import { db } from '../../firebase/config'; // Kết nối Firestore từ config của bạn

// Custom hook: lắng nghe realtime Firestore
const useFirestore = (collectionName, condition) => {
    // State lưu documents realtime
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        // B1: Tạo reference đến collection
        const collectionRef = firestoreCollection(db, collectionName);

        // B2: Khai báo query ban đầu = chỉ collectionRef (chưa có điều kiện)
        let q = collectionRef;

        if (condition) {
            // 👉 Nếu có điều kiện lọc thì lấy các tham số ra
            const { fieldName, operator, compareValue } = condition;

            // B3: Kiểm tra điều kiện có hợp lệ không
            const isCompareValueEmpty =
                compareValue == null ||
                (Array.isArray(compareValue) && compareValue.length === 0);

            if (!fieldName || !operator || isCompareValueEmpty) {
                // ❌ Nếu điều kiện không đủ, không lắng nghe Firestore
                setDocuments([]); // clear data
                return; // thoát useEffect
            }

            // ✅ Nếu hợp lệ: Tạo query với where
            q = query(collectionRef, where(fieldName, operator, compareValue));
            // ⚠️ KHÔNG orderBy nếu dùng where('in', ...) để tránh lỗi index không có
        } else {
            // ✅ Nếu không có điều kiện lọc → query toàn bộ, sắp xếp createdAt
            q = query(collectionRef, orderBy('createdAt'));
        }

        // B4: Đăng ký listener realtime với onSnapshot
        const unsubscribe = onSnapshot(q, (snapshot) => {
            // snapshot.docs = mảng document Firestore
            const docs = snapshot.docs.map((doc) => ({
                ...doc.data(), // Lấy tất cả field
                id: doc.id,    // Thêm id Firestore
            }));

            // B5: Cập nhật state
            setDocuments(docs);
        });

        // B6: Clean function: huỷ listener khi unmount hoặc deps thay đổi
        return () => unsubscribe();
    }, [collectionName, condition]); // 🚩 useEffect chạy lại khi collectionName hoặc condition đổi

    // ✅ Trả documents ra ngoài để component sử dụng
    return documents;
};

export default useFirestore;
