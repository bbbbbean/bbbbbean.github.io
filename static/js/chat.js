const ws = new WebSocket("ws://localhost:8080");

ws.onmessage = (event) => {
  const messages = document.getElementById("chatMessages");
  const msg = document.createElement("p");
  msg.textContent = event.data;
  msg.style.alignSelf = "flex-start";
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
};

function sendMessage() {
  const input = document.getElementById("chatInput");
  if (input.value.trim() !== "") {
    ws.send(input.value);
    const messages = document.getElementById("chatMessages");
    const msg = document.createElement("p");
    msg.textContent = input.value;
    msg.style.alignSelf = "flex-end";
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
    input.value = "";
  }
}

function handleEnter(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
}

function openFriendAddModal() {
  alert("친구 추가 창 열기");
}

function showFriendOptions(event, name) {
  event.stopPropagation();
  alert(`${name} 친구 옵션: 삭제 / 차단`);
}
