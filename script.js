const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const drawBtn = document.getElementById('drawBtn');
const writeBtn = document.getElementById('writeBtn');
const eraseBtn = document.getElementById('eraseBtn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const eraseCursorCircle = document.getElementById('eraseCursorCircle');
const textInput = document.getElementById('textInput');

let drawing = false;
let erasing = false;
let writing = false;
let currentColor = colorPicker.value;
let currentSize = brushSize.value;
let isTyping = false;
let typingPosition = { x: 0, y: 0 };

function resizeCanvas() {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.8;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function startDrawing(e) {
  if (writing) return;
  drawing = true;
  draw(e);
}

function stopDrawing() {
  drawing = false;
  ctx.beginPath();
}

function draw(e) {
  if (!drawing) return;

  const pos = getMousePos(e);

  ctx.lineWidth = currentSize;
  ctx.lineCap = 'round';
  ctx.strokeStyle = erasing ? '#0a0a1a' : currentColor;

  ctx.shadowColor = erasing ? 'transparent' : currentColor;
  ctx.shadowBlur = erasing ? 0 : 20;

  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function updateEraseCursor(e) {
  eraseCursorCircle.style.left = e.clientX + 'px';
  eraseCursorCircle.style.top = e.clientY + 'px';
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
canvas.addEventListener('mousemove', e => {
  draw(e);
  if (erasing) {
    eraseCursorCircle.style.display = 'block';
    updateEraseCursor(e);
    canvas.style.cursor = 'none';
  } else {
    eraseCursorCircle.style.display = 'none';
    canvas.style.cursor = writing ? 'text' : 'crosshair';
  }
});

// الكتابة
canvas.addEventListener('click', e => {
  if (!writing) return;
  if (isTyping) return;

  typingPosition = { x: e.clientX, y: e.clientY };

  textInput.style.left = typingPosition.x + 'px';
  textInput.style.top = typingPosition.y + 'px';
  textInput.style.display = 'block';
  textInput.value = '';
  textInput.focus();
  isTyping = true;
});

function finishTyping() {
  if (!isTyping) return;
  const text = textInput.value.trim();
  if (text !== '') {
    ctx.font = `${currentSize * 4}px Poppins, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#b388ff';
    ctx.shadowBlur = 10;

    const rect = canvas.getBoundingClientRect();
    const x = typingPosition.x - rect.left;
    const y = typingPosition.y - rect.top;

    ctx.fillText(text, x, y);
  }
  textInput.style.display = 'none';
  isTyping = false;
}

textInput.addEventListener('blur', finishTyping);
textInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    finishTyping();
  }
});

// تحديث اللون والحجم
colorPicker.addEventListener('change', e => {
  currentColor = e.target.value;
  erasing = false;
  writing = false;
  drawing = false;
  canvas.style.cursor = 'crosshair';
  eraseCursorCircle.style.display = 'none';
  textInput.style.display = 'none';
});

brushSize.addEventListener('input', e => {
  currentSize = e.target.value;
});

drawBtn.addEventListener('click', () => {
  drawing = false;
  erasing = false;
  writing = false;
  canvas.style.cursor = 'crosshair';
  eraseCursorCircle.style.display = 'none';
  textInput.style.display = 'none';
});

eraseBtn.addEventListener('click', () => {
  drawing = false;
  erasing = true;
  writing = false;
  canvas.style.cursor = 'none';
  eraseCursorCircle.style.display = 'block';
  textInput.style.display = 'none';
});

writeBtn.addEventListener('click', () => {
  drawing = false;
  erasing = false;
  writing = true;
  canvas.style.cursor = 'text';
  eraseCursorCircle.style.display = 'none';
  textInput.style.display = 'none';
});

clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  textInput.style.display = 'none';
});

saveBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'neon-drawing.png';
  link.href = canvas.toDataURL();
  link.click();
});
