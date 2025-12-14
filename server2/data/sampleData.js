// data/sampleData.js

const sampleData = {
    // ----------------------------------------------------
    // 1. USERS (Dùng refId là '1', '2', '3', '4' cho mapping)
    // ----------------------------------------------------
    users: [
        {
            "refId": 1, // Dùng refId để map với ObjectId
            "username": "nguyenhoangminhnhat",
            "email": "nhat@example.com",
            "password": "12345678", // Sẽ được hash trước khi lưu
            "role": "user",
            "firstName": "Minh",
            "lastName": "Nhật",
            "fullName": "Nhật Minh",
            "phone": "0987654321",
            "studentCode": "PT002",
            "birthday": "2000-01-15",
            "avatar": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
        },
        {
            "refId": 2, // Dùng refId để map với ObjectId
            "username": "admin",
            "email": "admin@naukri.edu",
            "password": "admin123", // Sẽ được hash trước khi lưu
            "role": "admin",
            "firstName": "Jery",
            "lastName": "Nhat",
            "fullName": "Nhat Jery",
            "phone": "0911222333",
            "studentCode": "AD001",
            "birthday": "1995-05-10",
            "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=Admin"
        },
        {
            "refId": 3,
            "username": "MinhNhat",
            "email": "nhmnhat161006.nvtroi2124@gmail.com",
            "password": "123456",
            "role": "user",
            "firstName": "Jery",
            "lastName": "Nhật ",
            "fullName": "Nhật Jery",
            "phone": "0798124026",
            "studentCode": "PT001",
            "birthday": "",
            "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=MinhNhat"
        },
        {
            "refId": 4,
            "username": "NhatQuynh",
            "email": "nhatquynh@gmail.com",
            "password": "123456",
            "role": "user",
            "firstName": "Quỳnh",
            "lastName": "Nhật",
            "fullName": "Nhật Quỳnh",
            "phone": "0987654321",
            "studentCode": "PT003",
            "birthday": "2006-12-23",
            "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=NhatQuynh"
        }
    ],

    // ----------------------------------------------------
    // 2. COURSES (Dùng refId là '1' đến '6' cho mapping)
    // ----------------------------------------------------
    courses: [
        {
            "refId": 1,
            "title": "Ngữ pháp cơ bản",
            "category": "Ngữ pháp",
            "level": "Cơ bản",
            "students": 120, // Trường này sẽ được cập nhật trong logic API
            "lessons": 12, // Trường này sẽ được cập nhật trong logic API
            "price": "Miễn phí",
            "featured": true,
            "description": "Học 12 thì tiếng Anh cơ bản",
            "thumbnail": "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=600&h=400&fit=crop"
        },
        {
            "refId": 2,
            "title": "Từ vựng cơ bản",
            "category": "Từ vựng",
            "level": "Cơ bản",
            "students": 98,
            "lessons": 38,
            "price": "Miễn phí",
            "featured": false,
            "description": "Học từ vựng tiếng Anh theo chủ đề",
            "thumbnail": "https://lh7-us.googleusercontent.com/docsz/AD_4nXdAEx228cxGFmRLM5QN21A1UAy79NPs9282x0KOph4_ZN2zvLOYz2HawmHC8RRTOu5UfS7TVDxvqF6tB8h9X4DpBzRbNJ7q0nb_2cVmdtzY0zD244GDUTJiLycJbok0tT92QlgchxOHbqdJNTIWyA?key=vL3GzXGo5ojNevm8M6LFnA"
        },
        {
            "refId": 3,
            "title": "Ngữ pháp trung cấp",
            "category": "Ngữ pháp",
            "level": "Trung cấp",
            "students": 98,
            "lessons": 38,
            "price": "Miễn phí",
            "featured": false,
            "description": "Nâng cao kỹ năng ngữ pháp tiếng Anh",
            "thumbnail": "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=600&h=400&fit=crop"
        },
        {
            "refId": 4,
            "title": "Phát âm cơ bản",
            "category": "Phát âm",
            "level": "Cơ bản",
            "students": 75,
            "lessons": 10,
            "price": "Miễn phí",
            "featured": false,
            "description": "Học cách phát âm tiếng Anh chuẩn từ cơ bản",
            "thumbnail": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop"
        },
        {
            "refId": 5,
            "title": "Giao tiếp hàng ngày",
            "category": "Giao tiếp",
            "level": "Cơ bản",
            "students": 150,
            "lessons": 15,
            "price": "Miễn phí",
            "featured": false,
            "description": "Học các câu giao tiếp tiếng Anh thông dụng trong cuộc sống",
            "thumbnail": "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop"
        },
        {
            "refId": 6,
            "title": "Nghe hiểu cơ bản",
            "category": "Kỹ năng nghe",
            "level": "Cơ bản",
            "students": 110,
            "lessons": 12,
            "price": "Miễn phí",
            "featured": false,
            "description": "Rèn luyện kỹ năng nghe hiểu tiếng Anh từ cơ bản",
            "thumbnail": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop"
        }
    ],

    // ----------------------------------------------------
    // 3. LESSONS (Dùng refId là '1' đến '28' cho mapping)
    // ----------------------------------------------------
    lessons: [
        { "refId": 1, "courseRef": 1, "order": 1, "title": "Thì Hiện Tại Đơn", "videoUrl": "https://www.youtube.com/embed/Ssbujp7m6cM" },
        { "refId": 2, "courseRef": 1, "order": 2, "title": "Thì Hiện Tại Tiếp Diễn", "videoUrl": "https://www.youtube.com/embed/9bZkp7q19f0" },
        { "refId": 3, "courseRef": 1, "order": 3, "title": "Thì Hiện Tại Hoàn Thành", "videoUrl": "https://www.youtube.com/embed/M7lc1UVf-VE" },
        { "refId": 4, "courseRef": 1, "order": 4, "title": "Thì Hiện Tại Hoàn Thành Tiếp Diễn", "videoUrl": "https://www.youtube.com/embed/kJQP7kiw5Fk" },
        { "refId": 5, "courseRef": 1, "order": 5, "title": "Thì Quá Khứ Đơn", "videoUrl": "https://www.youtube.com/embed/3tmd-ClpJxA" },
        { "refId": 6, "courseRef": 1, "order": 6, "title": "Thì Quá Khứ Tiếp Diễn", "videoUrl": "https://www.youtube.com/embed/L_jWHffIx5E" },
        { "refId": 7, "courseRef": 1, "order": 7, "title": "Thì Quá Khứ Hoàn Thành", "videoUrl": "https://www.youtube.com/embed/TzXXHVhGXTQ" },
        { "refId": 8, "courseRef": 1, "order": 8, "title": "Thì Quá Khứ Hoàn Thành Tiếp Diễn", "videoUrl": "https://www.youtube.com/embed/ALZHF5UqnU4" },
        { "refId": 9, "courseRef": 1, "order": 9, "title": "Thì Tương Lai Đơn", "videoUrl": "https://www.youtube.com/embed/uelHwf8o7_U" },
        { "refId": 10, "courseRef": 1, "order": 10, "title": "Thì Tương Lai Tiếp Diễn", "videoUrl": "https://www.youtube.com/embed/yPYZpwSpKmA" },
        { "refId": 11, "courseRef": 1, "order": 11, "title": "Thì Tương Lai Hoàn Thành", "videoUrl": "https://www.youtube.com/embed/ZXsQAXx_ao0" },
        { "refId": 12, "courseRef": 1, "order": 12, "title": "Thì Tương Lai Hoàn Thành Tiếp Diễn", "videoUrl": "https://www.youtube.com/embed/tgbNymZ7vqY" },
        { "refId": 13, "courseRef": 2, "order": 1, "title": "Từ vựng về gia đình", "videoUrl": "https://www.youtube.com/embed/Ssbujp7m6cM" },
        { "refId": 14, "courseRef": 2, "order": 2, "title": "Từ vựng về công việc", "videoUrl": "https://www.youtube.com/embed/9bZkp7q19f0" },
        { "refId": 15, "courseRef": 2, "order": 3, "title": "Từ vựng về du lịch", "videoUrl": "https://www.youtube.com/embed/M7lc1UVf-VE" },
        { "refId": 16, "courseRef": 2, "order": 4, "title": "Từ vựng về thực phẩm", "videoUrl": "https://www.youtube.com/embed/kJQP7kiw5Fk" },
        // Thiếu Lesson Course 2
        { "refId": 17, "courseRef": 3, "order": 1, "title": "Câu điều kiện loại 1", "videoUrl": "https://www.youtube.com/embed/Ssbujp7m6cM" },
        { "refId": 18, "courseRef": 3, "order": 2, "title": "Câu điều kiện loại 2", "videoUrl": "https://www.youtube.com/embed/9bZkp7q19f0" },
        { "refId": 19, "courseRef": 3, "order": 3, "title": "Câu bị động", "videoUrl": "https://www.youtube.com/embed/M7lc1UVf-VE" },
        // Thiếu Lesson Course 3
        { "refId": 20, "courseRef": 4, "order": 1, "title": "Bảng chữ cái và âm cơ bản", "videoUrl": "https://www.youtube.com/embed/Ssbujp7m6cM" },
        { "refId": 21, "courseRef": 4, "order": 2, "title": "Nguyên âm và phụ âm", "videoUrl": "https://www.youtube.com/embed/9bZkp7q19f0" },
        { "refId": 22, "courseRef": 4, "order": 3, "title": "Trọng âm từ", "videoUrl": "https://www.youtube.com/embed/M7lc1UVf-VE" },
        // Thiếu Lesson Course 4
        { "refId": 23, "courseRef": 5, "order": 1, "title": "Chào hỏi và giới thiệu", "videoUrl": "https://www.youtube.com/embed/Ssbujp7m6cM" },
        { "refId": 24, "courseRef": 5, "order": 2, "title": "Mua sắm và đặt hàng", "videoUrl": "https://www.youtube.com/embed/9bZkp7q19f0" },
        { "refId": 25, "courseRef": 5, "order": 3, "title": "Hỏi đường và chỉ đường", "videoUrl": "https://www.youtube.com/embed/M7lc1UVf-VE" },
        // Thiếu Lesson Course 5
        { "refId": 26, "courseRef": 6, "order": 1, "title": "Nghe số và thời gian", "videoUrl": "https://www.youtube.com/embed/Ssbujp7m6cM" },
        { "refId": 27, "courseRef": 6, "order": 2, "title": "Nghe hội thoại ngắn", "videoUrl": "https://www.youtube.com/embed/9bZkp7q19f0" },
        { "refId": 28, "courseRef": 6, "order": 3, "title": "Nghe tin tức đơn giản", "videoUrl": "https://www.youtube.com/embed/M7lc1UVf-VE" }
    ],

    // ----------------------------------------------------
    // 4. QUIZZES (Dùng refId là '1' đến '6' cho mapping)
    // ----------------------------------------------------
    quizzes: [
        {
            "refId": 1,
            "courseRef": 1,
            "title": "Quiz Ngữ pháp cơ bản",
            "questions": [
                { "id": 1, "question": "Thì hiện tại đơn dùng để diễn tả điều gì?", "options": ["Một hành động đang xảy ra", "Một thói quen, sự thật hiển nhiên", "Một hành động sẽ xảy ra trong tương lai", "Một hành động đã xảy ra trong quá khứ"], "correctIndex": 1 },
                { "id": 2, "question": "Chọn câu đúng:", "options": ["She go to school every day.", "She goes to school every day.", "She going to school every day.", "She is go to school every day."], "correctIndex": 1 },
                { "id": 3, "question": "Thì hiện tại tiếp diễn được dùng khi nào?", "options": ["Diễn tả hành động đang xảy ra tại thời điểm nói", "Diễn tả thói quen", "Diễn tả hành động đã xảy ra", "Diễn tả hành động sẽ xảy ra"], "correctIndex": 0 }
            ]
        },
        {
            "refId": 2,
            "courseRef": 2,
            "title": "Quiz Từ vựng cơ bản",
            "questions": [
                { "id": 4, "question": "Từ nào có nghĩa là 'gia đình'?", "options": ["Family", "Friend", "School", "House"], "correctIndex": 0 },
                { "id": 5, "question": "Từ nào có nghĩa là 'công việc'?", "options": ["Work", "Play", "Study", "Sleep"], "correctIndex": 0 },
                { "id": 6, "question": "Từ nào có nghĩa là 'du lịch'?", "options": ["Travel", "Stay", "Home", "Office"], "correctIndex": 0 }
            ]
        },
        {
            "refId": 3,
            "courseRef": 3,
            "title": "Quiz Ngữ pháp trung cấp",
            "questions": [
                { "id": 7, "question": "Câu điều kiện loại 1 dùng để diễn tả gì?", "options": ["Điều kiện có thể xảy ra trong tương lai", "Điều kiện không thể xảy ra", "Điều kiện đã xảy ra trong quá khứ", "Điều kiện chắc chắn xảy ra"], "correctIndex": 0 },
                { "id": 8, "question": "Chọn câu bị động đúng:", "options": ["The book is read by me.", "The book read by me.", "The book is reading by me.", "The book reads by me."], "correctIndex": 0 }
            ]
        },
        {
            "refId": 4,
            "courseRef": 4,
            "title": "Quiz Phát âm cơ bản",
            "questions": [
                { "id": 9, "question": "Có bao nhiêu nguyên âm trong tiếng Anh?", "options": ["5", "6", "7", "8"], "correctIndex": 0 },
                { "id": 10, "question": "Trọng âm thường rơi vào âm tiết nào?", "options": ["Âm tiết đầu tiên", "Âm tiết thứ hai", "Tùy thuộc vào từ", "Âm tiết cuối cùng"], "correctIndex": 2 }
            ]
        },
        {
            "refId": 5,
            "courseRef": 5,
            "title": "Quiz Giao tiếp hàng ngày",
            "questions": [
                { "id": 11, "question": "Cách chào hỏi lịch sự trong tiếng Anh?", "options": ["Hello, how are you?", "Hey, what's up?", "Hi, bye!", "Goodbye!"], "correctIndex": 0 },
                { "id": 12, "question": "Khi muốn hỏi giá, bạn nói gì?", "options": ["How much is this?", "What is this?", "Where is this?", "When is this?"], "correctIndex": 0 },
                { "id": 13, "question": "Cách cảm ơn lịch sự?", "options": ["Thank you very much", "No problem", "You're welcome", "See you"], "correctIndex": 0 }
            ]
        },
        {
            "refId": 6,
            "courseRef": 6,
            "title": "Quiz Nghe hiểu cơ bản",
            "questions": [
                { "id": 14, "question": "Kỹ năng nghe quan trọng nhất là gì?", "options": ["Tập trung và lắng nghe", "Nói nhanh", "Đọc nhanh", "Viết nhanh"], "correctIndex": 0 },
                { "id": 15, "question": "Khi nghe, bạn nên làm gì?", "options": ["Ghi chú những từ khóa quan trọng", "Nghe toàn bộ mà không ghi chú", "Chỉ nghe một phần", "Không cần nghe"], "correctIndex": 0 }
            ]
        }
    ],

    // ----------------------------------------------------
    // 5. ENROLLMENTS (Sử dụng userRef và courseRef)
    // ----------------------------------------------------
    enrollments: [
        { "userRef": 1, "courseRef": 1, "enrolledAt": "2025-12-02T11:21:10.061Z" },
        { "userRef": 1, "courseRef": 2, "enrolledAt": "2025-12-02T11:21:46.264Z" },
        { "userRef": 2, "courseRef": 1, "enrolledAt": "2025-12-04T02:14:46.656Z" },
        { "userRef": 2, "courseRef": 2, "enrolledAt": "2025-12-04T02:15:13.472Z" },
        { "userRef": 2, "courseRef": 3, "enrolledAt": "2025-12-04T02:18:26.234Z" },
        { "userRef": 2, "courseRef": 4, "enrolledAt": "2025-12-04T02:31:48.351Z" },
        { "userRef": 2, "courseRef": 5, "enrolledAt": "2025-12-04T02:31:52.767Z" },
        { "userRef": 2, "courseRef": 6, "enrolledAt": "2025-12-04T02:31:56.834Z" },
        { "userRef": 3, "courseRef": 2, "enrolledAt": "2025-12-04T02:51:56.201Z" },
        { "userRef": 3, "courseRef": 4, "enrolledAt": "2025-12-04T02:51:57.450Z" },
        { "userRef": 3, "courseRef": 5, "enrolledAt": "2025-12-04T02:51:58.783Z" },
        { "userRef": 3, "courseRef": 6, "enrolledAt": "2025-12-04T02:52:53.699Z" },
        { "userRef": 4, "courseRef": 1, "enrolledAt": "2025-12-04T02:58:18.401Z" },
        { "userRef": 2, "courseRef": 1, "enrolledAt": "2025-12-04T16:05:29.011Z" },
        { "userRef": 2, "courseRef": 2, "enrolledAt": "2025-12-04T16:10:08.416Z" },
        { "userRef": 4, "courseRef": 4, "enrolledAt": "2025-12-04T16:25:06.803Z" },
        { "userRef": 4, "courseRef": 3, "enrolledAt": "2025-12-04T16:25:25.237Z" },
        { "userRef": 4, "courseRef": 2, "enrolledAt": "2025-12-04T16:26:58.541Z" },
        { "userRef": 1, "courseRef": 6, "enrolledAt": "2025-12-04T16:33:51.833Z" },
        { "userRef": 4, "courseRef": 5, "enrolledAt": "2025-12-04T16:45:24.533Z" },
        { "userRef": 2, "courseRef": 5, "enrolledAt": "2025-12-04T17:08:35.717Z" },
        { "userRef": 2, "courseRef": 3, "enrolledAt": "2025-12-04T17:08:57.400Z" },
        { "userRef": 2, "courseRef": 6, "enrolledAt": "2025-12-04T17:11:23.270Z" },
        { "userRef": 2, "courseRef": 4, "enrolledAt": "2025-12-04T17:11:26.586Z" },
        { "userRef": 4, "courseRef": 6, "enrolledAt": "2025-12-04T17:13:40.273Z" },
        // Các mục có courseId null đã bị loại bỏ vì Course Schema có thể yêu cầu courseId.
    ],

    // ----------------------------------------------------
    // 6. PROGRESS (Sử dụng userRef, courseRef và lessonRef)
    // Lưu ý: Các sectionId trong dữ liệu gốc có vẻ là lessonId
    // ----------------------------------------------------
    progress: [
        // User 2 - Course 2
        { "userRef": 2, "courseRef": 2, "lessonRef": 13, "completedAt": "2025-12-04T16:22:01.799Z" }, // lessonRef 13: Từ vựng về gia đình
        { "userRef": 2, "courseRef": 2, "lessonRef": 14, "completedAt": "2025-12-04T16:22:05.249Z" }, // lessonRef 14: Từ vựng về công việc
        { "userRef": 2, "courseRef": 2, "lessonRef": 15, "completedAt": "2025-12-04T16:22:07.448Z" }, // lessonRef 15: Từ vựng về du lịch
        { "userRef": 2, "courseRef": 2, "lessonRef": 16, "completedAt": "2025-12-04T16:22:09.649Z" }, // lessonRef 16: Từ vựng về thực phẩm
        // User 4 - Course 4
        { "userRef": 4, "courseRef": 4, "lessonRef": 20, "completedAt": "2025-12-04T16:25:09.620Z" }, // lessonRef 20: Bảng chữ cái
        { "userRef": 4, "courseRef": 4, "lessonRef": 21, "completedAt": "2025-12-04T16:25:13.087Z" }, // lessonRef 21: Nguyên âm
        { "userRef": 4, "courseRef": 4, "lessonRef": 22, "completedAt": "2025-12-04T16:25:14.988Z" }, // lessonRef 22: Trọng âm
        // User 4 - Course 2
        { "userRef": 4, "courseRef": 2, "lessonRef": 13, "completedAt": "2025-12-04T16:27:00.790Z" },
        { "userRef": 4, "courseRef": 2, "lessonRef": 14, "completedAt": "2025-12-04T16:27:04.090Z" },
        { "userRef": 4, "courseRef": 2, "lessonRef": 15, "completedAt": "2025-12-04T16:27:05.941Z" },
        { "userRef": 4, "courseRef": 2, "lessonRef": 16, "completedAt": "2025-12-04T16:27:07.873Z" },
        // User 1 - Course 6
        { "userRef": 1, "courseRef": 6, "lessonRef": 26, "completedAt": "2025-12-04T16:33:55.366Z" },
        { "userRef": 1, "courseRef": 6, "lessonRef": 27, "completedAt": "2025-12-04T16:33:59.199Z" },
        { "userRef": 1, "courseRef": 6, "lessonRef": 28, "completedAt": "2025-12-04T16:34:01.716Z" },
        // User 4 - Course 5
        { "userRef": 4, "courseRef": 5, "lessonRef": 23, "completedAt": "2025-12-04T16:45:27.883Z" },
        { "userRef": 4, "courseRef": 5, "lessonRef": 24, "completedAt": "2025-12-04T16:45:31.249Z" },
        { "userRef": 4, "courseRef": 5, "lessonRef": 25, "completedAt": "2025-12-04T16:45:33.166Z" },
        // User 4 - Course 6
        { "userRef": 4, "courseRef": 6, "lessonRef": 26, "completedAt": "2025-12-04T17:19:00.030Z" },
        { "userRef": 4, "courseRef": 6, "lessonRef": 27, "completedAt": "2025-12-04T17:19:03.846Z" },
        { "userRef": 4, "courseRef": 6, "lessonRef": 28, "completedAt": "2025-12-04T17:19:06.063Z" }
    ],

    // ----------------------------------------------------
    // 7. RATINGS (Sử dụng userRef và courseRef)
    // ----------------------------------------------------
    ratings: [
        { "userRef": 2, "courseRef": 2, "rating": 5, "comment": "Quá hay!", "createdAt": "2025-12-04T02:26:10.933Z" },
        { "userRef": 2, "courseRef": 4, "rating": 4, "comment": "Tuyệt vời!", "createdAt": "2025-12-04T02:40:41.212Z" },
        { "userRef": 2, "courseRef": 5, "rating": 5, "comment": "Hay lắm ạ!", "createdAt": "2025-12-04T02:40:55.962Z" },
        { "userRef": 2, "courseRef": 6, "rating": 5, "comment": "Dễ hiểu quá!", "createdAt": "2025-12-04T02:41:11.196Z" },
        { "userRef": 3, "courseRef": 4, "rating": 5, "comment": "Hay lắm cô ạ!", "createdAt": "2025-12-04T02:52:10.683Z" },
        { "userRef": 3, "courseRef": 5, "rating": 5, "comment": "Em hiểu rồi ạ!", "createdAt": "2025-12-04T02:52:39.132Z" },
        { "userRef": 4, "courseRef": 1, "rating": 4, "comment": "Hay", "createdAt": "2025-12-04T02:58:25.084Z" },
        { "userRef": 1, "courseRef": 6, "rating": 5, "comment": "Rất dễ hiểu ạ!", "createdAt": "2025-12-04T16:34:14.267Z" },
        { "userRef": 4, "courseRef": 5, "rating": 4, "comment": "Quá tuyệt.", "createdAt": "2025-12-04T16:45:44.050Z" }
    ],
    
    // ----------------------------------------------------
    // 8. QUIZ RESULTS (Sử dụng userRef và quizRef)
    // ----------------------------------------------------
    quizResults: [
        { "userRef": 3, "quizRef": 3, "score": 0, "correct": 0, "total": 2, "submittedAt": "2025-12-04T02:53:11.367Z" },
        { "userRef": 3, "quizRef": 5, "score": 100, "correct": 3, "total": 3, "submittedAt": "2025-12-04T02:53:27.300Z" },
        { "userRef": 3, "quizRef": 6, "score": 100, "correct": 2, "total": 2, "submittedAt": "2025-12-04T02:53:36.183Z" },
        { "userRef": 3, "quizRef": 1, "score": 67, "correct": 2, "total": 3, "submittedAt": "2025-12-04T02:53:44.332Z" },
        { "userRef": 3, "quizRef": 4, "score": 0, "correct": 0, "total": 2, "submittedAt": "2025-12-04T02:53:54.748Z" },
        { "userRef": 3, "quizRef": 1, "score": 33, "correct": 1, "total": 3, "submittedAt": "2025-12-04T02:55:36.983Z" },
        { "userRef": 3, "quizRef": 6, "score": 100, "correct": 2, "total": 2, "submittedAt": "2025-12-04T02:55:46.133Z" },
        { "userRef": 3, "quizRef": 3, "score": 100, "correct": 2, "total": 2, "submittedAt": "2025-12-04T02:56:02.766Z" },
        { "userRef": 3, "quizRef": 4, "score": 50, "correct": 1, "total": 2, "submittedAt": "2025-12-04T02:56:19.083Z" },
        { "userRef": 3, "quizRef": 4, "score": 100, "correct": 2, "total": 2, "submittedAt": "2025-12-04T02:56:40.084Z" },
        { "userRef": 3, "quizRef": 4, "score": 50, "correct": 1, "total": 2, "submittedAt": "2025-12-04T02:56:53.783Z" },
        { "userRef": 4, "quizRef": 6, "score": 100, "correct": 2, "total": 2, "submittedAt": "2025-12-04T16:25:39.937Z" },
        { "userRef": 1, "quizRef": 5, "score": 67, "correct": 2, "total": 3, "submittedAt": "2025-12-04T16:35:46.302Z" }
    ]
};

module.exports = sampleData;