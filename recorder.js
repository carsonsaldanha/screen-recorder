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

// Checks if user is on mobile and displays alert message
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    alert("Oh no! Screen recording from this web app only works on desktop browsers right now due to an API limitation. Please visit this site on a computer!");
    popUp.style.display = "block";
// Checks if user is on IE (*facepalm*) and displays alert message
} else if (/MSIE|Trident.*rv\:11\./i.test(navigator.userAgent)) {
    alert("Dude! This web app uses modern APIs and won't work on Internet Explorer! Please use a web browser like Chrome, Edge, or Firefox.");
}

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
    }).then(stream => {
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
        // Creates a URL that references the Blob and sets it to the recoding video box
        recording.src = URL.createObjectURL(recordedBlob);
        // Sets the download button's link to the recording
        downloadButtonLink.href = recording.src;
        // Sets the name of the downloaded file
        downloadButtonLink.download = getDownloadName() + ".mp4";
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
