## What are `:where` and `:is`? How they work?

### 1. Khái niệm

Cả hai đều là các hàm pseudo-class trong CSS, được sử dụng để nhóm các bộ chọn (selectors) nhằm làm mã CSS ngắn gọn và dễ bảo trì hơn.

### 2. Sự khác biệt giữa `:where` và `:is`

| Đặc điểm                     | `:where()`                                                                                                                                     | `:is()`                                                                |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Chức năng**                | Nhóm các bộ chọn, áp dụng kiểu cho phần tử khớp bất kỳ bộ chọn nào                                                                             | Tương tự `:where()`, nhóm các bộ chọn                                  |
| **Độ ưu tiên (Specificity)** | Độ ưu tiên được xác định bởi bộ chọn cụ thể nhất trong danh sách, nhưng `:where()` có thể được dùng để giảm độ ưu tiên trong ngữ cảnh phức tạp | Độ ưu tiên dựa trên bộ chọn có độ ưu tiên **cao nhất** trong danh sách |
| **Ví dụ độ ưu tiên**         | `:where(.class, #id)` có độ ưu tiên dựa trên bộ chọn cụ thể nhất, thường thấp hơn                                                              | `:is(.class, #id)` có độ ưu tiên của `#id` (cao hơn)                   |
| **Trường hợp sử dụng**       | Thường dùng khi cần nhóm bộ chọn mà không muốn tăng độ ưu tiên, hoặc trong các quy tắc phức tạp                                                | Thường dùng để thay thế các bộ chọn dài, giữ độ ưu tiên cao nếu cần    |
| **Cú pháp**                  | `:where(selector1, selector2, ...)`                                                                                                            | `:is(selector1, selector2, ...)`                                       |

#### Ví dụ về độ ưu tiên

```css
/* Dùng :where */
:where(.app-header, #main-header) {
  color: blue;
}

/* Dùng :is */
:is(.app-header, #main-header) {
  color: red;
}
```

- HTML:
  ```html
  <div class="container">
    <header id="main-header" class="app-header">Tiêu đề</header>
  </div>
  ```
- **Kết quả**: Màu chữ sẽ là `red`, vì `:is(.app-header, #main-header)` có độ ưu tiên cao hơn (do `#main-header` là ID) so với `:where(.app-header, #main-header)`.

---

### 3. Cách `:where` và `:is` hoạt động trong thực tế

#### Hoạt động với bộ chọn phức tạp

Cả hai có thể được dùng với các bộ chọn phức tạp, như trạng thái, thuộc tính, hoặc tổ hợp. Ví dụ:

```css
.container :is(.app-header:hover, .suggestions.active) {
  background-color: yellow;
}
```

- **Giải thích**: Áp dụng nền vàng cho `.app-header` khi được hover hoặc `.suggestions` khi có lớp `.active`, miễn là chúng nằm trong `.container`.

#### Kết hợp với các bộ chọn khác

```css
.container :where(.app-header, .suggestions) > p {
  font-weight: bold;
}
```

- **Giải thích**: Làm đậm chữ cho thẻ `<p>` trực tiếp bên trong `.app-header` hoặc `.suggestions` trong `.container`.

#### Sử dụng lồng nhau

```css
.container :is(:where(.app-header, .suggestions), .prompt-wrapper) {
  border: 1px solid gray;
}
```

- **Giải thích**: Áp dụng viền cho `.app-header`, `.suggestions`, hoặc `.prompt-wrapper` trong `.container`.
