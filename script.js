// 1. Khởi tạo mảng 5 công việc mẫu
let tasks = [
    { id: 1, name: "Hoàn thiện bài tập Web", date: "2026-10-15", priority: "Cao", completed: false },
    { id: 2, name: "Ôn tập Toán Ứng Dụng", date: "2026-10-16", priority: "Cao", completed: false },
    { id: 3, name: "Mua tài liệu học", date: "2026-10-14", priority: "Trung bình", completed: true },
    { id: 4, name: "Dọn dẹp phòng", date: "2026-10-13", priority: "Thấp", completed: false },
    { id: 5, name: "Dạy kèm học sinh", date: "2026-10-17", priority: "Cao", completed: false }
];

// Lấy các element từ DOM
const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const errorMsg = document.getElementById('error-msg');
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');
const sortFilter = document.getElementById('sort-filter');
const taskNameInput = document.getElementById('task-name'); // Ô nhập tên công việc

// 2. Hàm hiển thị và xử lý dữ liệu ra màn hình
function renderTasks() {
    taskList.innerHTML = '';
    
    // Lấy giá trị lọc và tìm kiếm
    const searchText = searchInput.value.toLowerCase();
    const filterValue = statusFilter.value;
    const sortValue = sortFilter.value;

    // Lọc dữ liệu
    let filteredTasks = tasks.filter(task => {
        const matchSearch = task.name.toLowerCase().includes(searchText);
        const matchStatus = filterValue === 'all' 
            || (filterValue === 'completed' && task.completed) 
            || (filterValue === 'pending' && !task.completed);
        return matchSearch && matchStatus;
    });

    // Sắp xếp dữ liệu
    if (sortValue === 'date-asc') {
        filteredTasks.sort((a, b) => new Date(a.date || '9999-12-31') - new Date(b.date || '9999-12-31'));
    } else if (sortValue === 'date-desc') {
        filteredTasks.sort((a, b) => new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01'));
    }

    // Đổ dữ liệu ra HTML
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');

        // Xác định icon ưu tiên
        let priorityIcon = '🟢';
        if(task.priority === 'Cao') priorityIcon = '🔴';
        if(task.priority === 'Trung bình') priorityIcon = '🟡';

        li.innerHTML = `
            <div class="task-info">
                <strong class="task-name">${task.name}</strong>
                <span class="task-meta">📅 Hạn: ${task.date ? task.date.split('-').reverse().join('/') : 'Không có'} | ${priorityIcon} Ưu tiên: ${task.priority}</span>
            </div>
            <div class="task-actions">
                <button class="btn-complete" onclick="toggleTask(${task.id})">
                    ${task.completed ? '↩️ Hoàn tác' : '✔️ Đánh dấu hoàn thành'}
                </button>
                <button class="btn-delete" onclick="deleteTask(${task.id})">🗑️ Xóa</button>
            </div>
        `;
        taskList.appendChild(li);
    });

    updateStats();
}

// 3. Cập nhật thống kê
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    document.getElementById('total-count').innerText = total;
    document.getElementById('completed-count').innerText = completed;
    document.getElementById('pending-count').innerText = pending;
}

// 4. Thêm công việc (Có kiểm tra lỗi rỗng + báo lỗi màu đỏ)
taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nameInput = taskNameInput.value.trim();
    const dateInput = document.getElementById('task-date').value;
    const priorityInput = document.getElementById('task-priority').value;

    // KIỂM TRA TÊN KHÔNG RỖNG
    if (nameInput === '') {
        errorMsg.textContent = '❌ Vui lòng nhập tên công việc!';
        errorMsg.style.display = 'block';
        taskNameInput.classList.add('input-error'); // Thêm viền đỏ báo lỗi
        taskNameInput.focus(); // Đưa trỏ chuột quay lại ô nhập
        return;
    }

    // Nếu hợp lệ thì xóa các thông báo lỗi
    errorMsg.style.display = 'none';
    taskNameInput.classList.remove('input-error');

    const newTask = {
        id: Date.now(),
        name: nameInput,
        date: dateInput,
        priority: priorityInput,
        completed: false
    };

    tasks.unshift(newTask); // Đẩy công việc mới lên đầu danh sách
    taskForm.reset(); // Xóa nội dung form
    renderTasks();
});

// Ẩn thông báo lỗi ngay khi người dùng bắt đầu gõ chữ lại
taskNameInput.addEventListener('input', function() {
    this.classList.remove('input-error');
    errorMsg.style.display = 'none';
});

// 5. Chuyển trạng thái Hoàn thành / Chưa hoàn thành
function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    renderTasks();
}

// 6. Xóa công việc
function deleteTask(id) {
    if(confirm("Bạn có chắc chắn muốn xóa công việc này?")) {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    }
}

// 7. Bắt sự kiện Lọc, Tìm kiếm, Sắp xếp (Không tải lại trang)
searchInput.addEventListener('input', renderTasks);
statusFilter.addEventListener('change', renderTasks);
sortFilter.addEventListener('change', renderTasks);

// Chạy hàm hiển thị lần đầu tiên khi vừa mở trang
renderTasks();