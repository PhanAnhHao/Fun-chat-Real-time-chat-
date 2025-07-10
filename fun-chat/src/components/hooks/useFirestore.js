import { useEffect, useState } from 'react';
import {
    collection as firestoreCollection,
    query,
    where,
    orderBy,
    onSnapshot,
} from 'firebase/firestore';
import { db } from '../../firebase/config';

const useFirestore = (collectionName, condition) => {
    // Tạo state để lưu documents realtime từ Firestore
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        // Tạo reference tới collection cần nghe
        const collectionRef = firestoreCollection(db, collectionName);

        // Mặc định: query tất cả document, sắp xếp theo 'createdAt'
        let q = query(collectionRef, orderBy('createdAt'));

        if (condition) {
            // Lấy ra các trường từ condition (fieldName, operator, compareValue)
            const { fieldName, operator, compareValue } = condition;

            // Kiểm tra compareValue có rỗng không
            // - Nếu null/undefined thì ko cần query
            // - Nếu là array nhưng rỗng thì cũng không query
            const isCompareValueEmpty =
                compareValue == null ||
                (Array.isArray(compareValue) && compareValue.length === 0);

            if (!fieldName || !operator || isCompareValueEmpty) {
                // Nếu điều kiện thiếu hoặc compareValue không hợp lệ
                // 👉 Clear documents, không lắng nghe Firestore
                setDocuments([]);
                return;
            }

            // Nếu condition hợp lệ:
            // 👉 Tạo query với where + orderBy cùng lúc
            q = query(
                collectionRef,
                where(fieldName, operator, compareValue),
                orderBy('createdAt')
            );
        }

        // Đăng ký listener realtime với onSnapshot
        const unsubscribe = onSnapshot(q, (snapshot) => {
            // snapshot chứa tất cả documents hiện có
            const docs = snapshot.docs.map((doc) => ({
                ...doc.data(), // lấy data document
                id: doc.id,    // thêm id để dễ dùng
            }));

            // Cập nhật state documents
            setDocuments(docs);
        });

        // Clean function: hủy listener khi component unmount hoặc deps đổi
        return () => unsubscribe();
    }, [collectionName, condition]); // chạy lại khi collectionName hoặc condition đổi

    // Trả về danh sách documents realtime
    return documents;
};

export default useFirestore;