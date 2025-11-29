# Portnet PCS Mock Screen

Màn hình mock "Danh sách hàng hoá dự kiến dỡ" được xây dựng bằng React 18, TypeScript và Ant Design 5.

## Cấu trúc & tính năng
- Bố cục sử dụng `Layout` của Ant Design với header mô tả luồng eMNF → VASSCM → PCS → KBC.
- Thông tin chuyến tàu hiển thị bằng `Descriptions`.
- Thẻ thống kê số lượng hàng hoá theo 4 mục đích vận chuyển: Nhập khẩu, Quá cảnh, Trung chuyển, ROB.
- Bảng dữ liệu mock cho phép:
  - Lọc nhanh theo từ khóa container/House B/L/mô tả hàng hóa.
  - Lọc theo mục đích vận chuyển.
  - Chỉnh sửa mục đích vận chuyển từng dòng qua `Select`.

## Chạy dự án
```bash
npm install
npm run dev
```

Trong trường hợp môi trường giới hạn mạng, việc cài đặt phụ thuộc có thể bị chặn; hãy cấu hình proxy/registry nội bộ nếu cần.
