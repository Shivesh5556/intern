const startButton = document.getElementById('startCamera');
const stopButton = document.getElementById('stopCamera');
const videoElement = document.getElementById('webcamFeed');

let currentStream = null;

startButton.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        currentStream = stream;
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
    }
});
