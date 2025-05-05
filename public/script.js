    const dwellTime = 1000; // The amount of time it takes to trigger a click in ms
    let gazeTarget = null;
    let gazeTimer = null;

    function onPoint(point, calibration) {
        if (!calibration) return; // Only process points after calibration is complete

        const x = point[0]; // x-coordinate
        const y = point[1]; // y-coordinate

        
        const elements = document.elementsFromPoint(x, y);
        const target = elements.find(el => el.classList.contains("clickable"));

        // Handle gaze target changes
        if (target !== gazeTarget) {
            if (gazeTarget) {
                gazeTarget.classList.remove("hovered");
            }
            gazeTarget = target;
            if (gazeTarget) {
                gazeTarget.classList.add("hovered");
                startDwellTimer(gazeTarget);
            } else {
                clearDwellTimer();
            }
        }
    }

    // Start the dwell timer for a gaze target to trigger clicks after 1ms
    function startDwellTimer(element) {
        clearDwellTimer();
        gazeTimer = setTimeout(() => {
            element.click(); // Trigger a click on the element
            console.log("Clicked:", element.id);
        }, dwellTime);
    }

    // Clear the dwell timer
    function clearDwellTimer() {
        if (gazeTimer) {
            clearTimeout(gazeTimer);
            gazeTimer = null;
        }
    }

    // Add click event listeners to clickable elements
    document.querySelectorAll(".clickable").forEach(el => {
        el.addEventListener("click", () => alert("You selected: " + el.id));
    });

    document.addEventListener('DOMContentLoaded', () => {
        const gestures = new EyeGestures('video', onPoint);
        gestures.start();
    });




    function initView(view) {
        if (view === 'home') {
            setupDwellClicks();
        }
        if (view === 'calibration') {
            startCalibration();
        }
    }
    
    function setupDwellClicks() {
        document.querySelectorAll(".clickable").forEach(el => {
            el.addEventListener("click", () => alert("You selected: " + el.id));
        });
    }
    