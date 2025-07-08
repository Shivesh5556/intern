const startButton = document.getElementById('startCamera');
const stopButton = document.getElementById('stopCamera');
const clearLinesButton = document.getElementById('clearLines');
const toggleTheme = document.getElementById('toggleTheme');
const videoElement = document.getElementById('webcamFeed');
const canvas = document.getElementById('overlayCanvas');
const container = document.querySelector('.video-container');

let currentStream = null;
let points = [];
let lines = [];

function resizeCanvas() {
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  redrawAllLines();
}

function clearCanvas() {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

startButton.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    currentStream = stream;
    resizeCanvas();
  } catch (error) {
    console.error('Error accessing webcam:', error);
    alert('Camera permission denied or no camera found.');
  }
});

stopButton.addEventListener('click', () => {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
    videoElement.srcObject = null;
    currentStream = null;
    clearCanvas();
    points = [];
    lines = [];
  }
});

clearLinesButton.addEventListener('click', () => {
  points = [];
  lines = [];
  clearCanvas();
});

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  points.push({ x, y });

  if (points.length >= 2) {
    const p1 = points[points.length - 2];
    const p2 = points[points.length - 1];
    lines.push({ p1, p2 });
    drawLine(p1, p2);
    drawDistanceLabel(p1, p2);
  }
});

function drawLine(p1, p2) {
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawDistanceLabel(p1, p2) {
  const ctx = canvas.getContext('2d');
  const midX = (p1.x + p2.x) / 2;
  const midY = (p1.y + p2.y) / 2;

  const pixelDistance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  const cmDistance = (pixelDistance / 37.795).toFixed(2);  // Approx 37.795 pixels/cm

  ctx.font = '18px Poppins';
  ctx.fillStyle = 'blue';
  ctx.fillText(`${cmDistance} cm`, midX + 10, midY - 10);
}

function redrawAllLines() {
  clearCanvas();
  lines.forEach(({ p1, p2 }) => {
    drawLine(p1, p2);
    drawDistanceLabel(p1, p2);
  });
}

toggleTheme.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

window.addEventListener('resize', resizeCanvas);
