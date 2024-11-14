# Chat bot website

### 1. Tải project xuống máy:
Clone dự án từ GitHub: <br>
- `git clone https://github.com/MT16204/Chat_bot_support.git`

### 2. Các thư viện và cài đặt cần thiết: 
1. Tải Node.js và npm
Truy cập trang web chính thức của Node.js để tải phiên bản cài đặt:

Link: https://nodejs.org/
Tải phiên bản LTS (phiên bản ổn định lâu dài) để đảm bảo độ ổn định.

2. Cài đặt Node.js
Sau khi tải, mở file cài đặt và làm theo hướng dẫn trên màn hình để cài đặt Node.js.
Trong quá trình cài đặt, đảm bảo chọn tùy chọn `"Add to PATH"` để có thể sử dụng Node.js từ bất kỳ thư mục nào trong Command Prompt. 
3. Xác minh cài đặt
Sau khi cài đặt xong, mở Command Prompt và chạy các lệnh sau để kiểm tra:
- `node -v`
- `npm -v`
<br>
Nếu các lệnh trên hiển thị phiên bản của Node.js và npm, điều đó có nghĩa là bạn đã cài đặt thành công.

4. Cài đặt các thư viện cần thiết bằng lệnh cd: <br>
- Điều hướng tới thư mục cần cài dặt: `cd <thư mục chứa project>\Chat_bot_support\backend` <br>
- Chạy lệnh:  <br>
    - `npm install`
    - `npm install express dotenv`
    

### 3. Chạy chương trình: 
- `cd <thư mục chứa project>\Chat_bot_support\backend`
- `node server.js`