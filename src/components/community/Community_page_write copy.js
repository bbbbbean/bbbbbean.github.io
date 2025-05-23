import "../../css/CSS_community-page/community_page_write.css";

const Community_page_write = () => {
  return (
    <div className="container">
      <span className="now-page">게임 &gt; 글쓰기</span>
      <form action="" method="post">
        <div className="title-form">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="제목을 입력하세요"
          />
        </div>
        <hr />
        {/* 첨부파일 기능 */}
        <div className="attach-form">
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            multiple=""
            style={{ display: "none" }}
          />
          <a
            src="/static/image/로고.png"
            href="javascript:void(0)"
            className="button image-button"
            onclick="document.getElementById('image').click(); return false;"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            이미지 선택
          </a>
          <input
            type="file"
            id="video"
            name="video"
            accept="video/*"
            multiple=""
            style={{ display: "none" }}
          />
          <a
            href="javascript:void(0)"
            className="button video-button"
            onclick="document.getElementById('video').click(); return false;"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
              />
            </svg>
            동영상 선택
          </a>
          <input
            type="file"
            id="attach"
            name="attach"
            style={{ display: "none" }}
          />
          <a
            href="javascript:void(0)"
            className="button attach-button"
            onclick="document.getElementById('attach').click(); return false;"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
              />
            </svg>
            첨부파일 선택
          </a>
        </div>
        <hr />
        {/* 글꼴 */}
        <div className="font-setting">
          <div className="font-size">
            <select id="font-size" name="font-size">
              <option value="15px">15px</option>
              <option value="14px">14px</option>
              <option value="13px">13px</option>
            </select>
          </div>
          <div className="font-color">
            <label htmlFor="font-color">가</label>
            <input
              type="color"
              id="font-color"
              name="font-color"
              defaultValue="#000000"
              style={{
                width: 25,
                height: 25,
                border: "none",
                backgroundColor: "none",
                cursor: "pointer",
                padding: 0,
                margin: 0,
              }}
            />
          </div>
          <div className="font-bold">
            <a href="" style={{ fontWeight: "bold", textDecoration: "none" }}>
              가
            </a>
          </div>
          <div className="font-italic">
            <a href="" style={{ fontStyle: "italic", textDecoration: "none" }}>
              가
            </a>
          </div>
          <div className="font-underline">
            <a href="" style={{ textDecoration: "underline", color: "black" }}>
              가
            </a>
          </div>
          <div className="font-line-through">
            <a
              href=""
              style={{ textDecoration: "line-through", color: "black" }}
            >
              가
            </a>
          </div>
        </div>
        <hr />
        <div className="content-form">
          <textarea
            id="content"
            name="content"
            rows={10}
            placeholder="내용을 입력하세요"
            defaultValue={""}
          />
        </div>
        {/* 태그 부분 */}
        <div className="tag">
          <div className="tag-container">
            <input
              type="text"
              className="tag-input"
              name="tag-input"
              placeholder="#"
              oninput="this.style.width = ((this.value.length +4) * 10) + 'px'; this.value = this.value.startsWith('#') ? this.value : '#' + this.value;"
            />
            <a href="javascript::void(0)" className="delete-typedtag-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </a>
          </div>
          <div className="tag-list" />
        </div>
        <br />
        <button type="submit">글쓰기</button>
      </form>
    </div>
  );
};

// export default Community_page_write;
