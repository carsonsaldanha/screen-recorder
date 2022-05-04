// Establishes global variables
let popUp = document.getElementById("popUp");
let title = document.getElementById("title");
let selectScreenButton = document.getElementById("selectScreenButton");
let preview = document.getElementById("preview");
let startButton = document.getElementById("startButton");
let count = document.getElementById("countdown");
let stopButton = document.getElementById("stopButton");
let recording = document.getElementById("recording");
let newRecordingButton = document.getElementById("newRecordingButton");
let downloadButtonLink = document.getElementById("downloadButtonLink");
let downloadButton = document.getElementById("downloadButton");
let startTime;
let duration;

// Starts the input stream on select screen button click
// Handles the media and downloading
selectScreenButton.addEventListener("click", function startStream() {
    // Hides and displays relevant elements
    title.style.display = "none";
    selectScreenButton.style.display = "none";
    startButton.style.display = "flex";
    preview.style.display = "block";
    // Requests a new MediaStream of the user's screen with video (display) and audio (if enabled) tracks
    navigator.mediaDevices.getDisplayMedia({
        video: {
            cursor: "always"
        },
        audio: true
    // When the Promise returned by getDisplayMedia() is resolved, do the following
    })
    // Displays alert message if user is on mobile or doesn't have the recording API
    .catch(function(error) {
        console.log(error);
        alert("Oh no! Screen recording from this web app only works on desktop browsers right now due to an API limitation. Please visit this site on a computer!");
        popUp.style.display = "block";
    })
    .then(stream => {
        // Sets preview video box to the stream
        preview.srcObject = stream;
        // Sets download button's link to the stream
        downloadButtonLink.href = stream;
        // Firefox compatibility
        preview.captureStream = preview.captureStream || preview.mozCaptureStream;
        // Creates and returns a new Promise which is resolved when the preview video starts to play
        return new Promise(resolve => preview.onplaying = resolve);
    // Calls startRecording() with the preview stream and receives recordedChunks (data) when finished recording    
    }).then(() => startRecording(preview.captureStream())).then(recordedChunks => {
        // Merges the chunks into a single Blob under MP4 format
        let recordedBlob = new Blob(recordedChunks, {
            type: "video/mp4"
        });
        // Fixes the recorded blob so that it is seekable (Chrome and Firefox bug)
        ysFixWebmDuration(recordedBlob, duration, {logger: false}).then(function(fixedBlob) {
            // Creates a URL that references the Blob and sets it to the recoding video box
            recording.src = URL.createObjectURL(fixedBlob);
            // Sets the download button's link to the recording
            downloadButtonLink.href = recording.src;
            // Sets the name of the downloaded file
            downloadButtonLink.download = getDownloadName() + ".mp4";
        });
    });
}, false);

// Handles starting the recording process
async function startRecording(stream) {
    // Creates the MediaRecorder that will handle recording the input stream
    let recorder = new MediaRecorder(stream);
    // Holds the Blobs of media data
    let data = [];
    // The event handler simply pushes the Blob onto the data array
    recorder.ondataavailable = event => data.push(event.data);
    // Waits for start button to be clicked
    await buttonClick(startButton);
    // Hides start button and displays count and stop button
    startButton.style.display = "none";
    count.style.display = "block";
    stopButton.style.display = "flex";
    // Delays the recording start by 3 seconds
    countdown();
    await wait();
    count.style.display = "none";
    recorder.start();
    startTime = Date.now();
    // Creates a new Promise which is resolved when the MediaRecorder's onstop event handler is called
    // Rejects if its onerror event handler is called
    let stopped = new Promise((resolve, reject) => {
        recorder.onstop = resolve;
        recorder.onerror = event => reject(event.name);
    });
    // Creates a new Promise and stops the MediaRecorder if it's recording
    let recorded = () => recorder.state == "recording" && recorder.stop();
    // Creates a new Promise which is fulfilled when both of the two Promises (stopped and recorded) have resolved
    await Promise.all([stopped, recorded]);
    stopStream(stream);
    return data;
}

// Returns a new Promise which resolves once the passed button is clicked
function buttonClick(button) {
    return new Promise(resolve => button.onclick = resolve);
}

// Counts down 3 seconds
function countdown() {
    const millisecond = 1000;
    let timeLeft = 3;
    let countdownTimer = setInterval(function() {
        timeLeft--;
        count.textContent = timeLeft;
        // Stops when 0 is reached
        if (timeLeft <= 0) {
            clearInterval(countdownTimer);
        }
    }, millisecond);
}

// Returns a new Promise which resolves once 3000 milliseconds have elapsed
function wait() {
    const delayInMS = 3000;
    return new Promise(resolve => setTimeout(resolve, delayInMS));
}

// Adds a click event handler to the stop button
stopButton.addEventListener("click", function() {
    // Calls stopStream() when clicked
    stopStream(preview.srcObject);
}, false);

// Stops the input stream
function stopStream(stream) {
    duration = Date.now() - startTime;
    // Calls MediaStreamTrack.stop() on each track in the stream
    stream.getTracks().forEach(track => track.stop());
    // Hides and displays the relevant elements
    preview.style.display = "none";
    stopButton.style.display = "none";
    recording.style.display = "block";
    newRecordingButton.style.display = "flex";
    downloadButton.style.display = "flex";
}

// Gets the name for the download in time format 
function getDownloadName() {
    let date = new Date();
    let year = date.getFullYear();
    let month = pad(date.getMonth() + 1);
    let day = pad(date.getDate());
    let hour = date.getHours();
    let amPm = "AM";
    if (hour >= 12) {
        amPm = "PM";
    }
    // Converts hour to 12-hour format
    hour = (hour + 24) % 12 || 12;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    return "Recording " + year + "-" + month + "-" + day + " at " + hour + "." + minute + "." + second + " " + amPm;
}

// Returns the passed number with a leading 0 if less than 10
function pad(n) {
    if (n < 10) {
        return "0" + n;
    } else {
        return n;
    }
}
