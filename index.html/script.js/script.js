/* =========================================================
   LIFEOS - COMPLETE DASHBOARD JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       DATA
       ===================================================== */

    const DEFAULT_PRODUCTIVITY = [67, 77, 56, 88, 45, 100];
    const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let activities = JSON.parse(
        localStorage.getItem("lifeos_activities") || "[]"
    );

    let goalsProgress = Number(
        localStorage.getItem("lifeos_goals") || 85
    );

    let darkMode = localStorage.getItem("lifeos_dark") === "true";


    /* =====================================================
       DATE
       ===================================================== */

    function updateDate() {

        const dateElement = document.getElementById("currentDate");

        if (!dateElement) return;

        const today = new Date();

        dateElement.textContent =
            today.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }).toUpperCase();
    }


    updateDate();


    /* =====================================================
       GRAPH
       ===================================================== */

    function setupGraph() {

        const bars = document.querySelectorAll(".bar");
        const percentages = document.querySelectorAll(".percentage");

        bars.forEach((bar, index) => {

            const value = DEFAULT_PRODUCTIVITY[index] || 0;

            bar.dataset.value = value;

            setTimeout(() => {
                bar.style.height = value + "%";
            }, index * 100);

            if (percentages[index]) {
                percentages[index].textContent = value + "%";
            }
        });
    }


    setupGraph();


    /* =====================================================
       FIND DASHBOARD STAT VALUES
       ===================================================== */

    function getStatCards() {

        return document.querySelectorAll(".stat-card");
    }


    function updateDashboardStats() {

        const cards = getStatCards();

        if (cards.length < 4) return;

        /*
         * Initial requested values:
         * Productivity = 99
         * Focus = 9hr
         * Activities = 88
         * Goals = 85%
         */

        const productivityValue =
            activities.length > 0
                ? calculateProductivity()
                : 99;

        const focusMinutes =
            activities.length > 0
                ? calculateFocusMinutes()
                : 540;

        const activityValue =
            activities.length > 0
                ? activities.length
                : 88;

        const goalValue = goalsProgress;


        /* PRODUCTIVITY */

        const productivityNumber =
            cards[0].querySelector(".stat-value");

        if (productivityNumber) {
            productivityNumber.textContent =
                productivityValue;
        }


        /* FOCUS */

        const focusNumber =
            cards[1].querySelector(".stat-value");

        if (focusNumber) {
            focusNumber.textContent =
                formatFocusTime(focusMinutes);
        }


        /* ACTIVITIES */

        const activityNumber =
            cards[2].querySelector(".stat-value");

        if (activityNumber) {
            activityNumber.textContent =
                activityValue;
        }


        /* GOALS */

        const goalNumber =
            cards[3].querySelector(".stat-value");

        if (goalNumber) {
            goalNumber.textContent =
                goalValue + "%";
        }
    }


    /* =====================================================
       PRODUCTIVITY CALCULATION
       ===================================================== */

    function calculateProductivity() {

        if (!activities.length) return 99;

        const total = activities.reduce(
            (sum, activity) =>
                sum + Number(activity.productivity || 0),
            0
        );

        return Math.min(
            100,
            Math.round(total / activities.length)
        );
    }


    /* =====================================================
       FOCUS TIME
       ===================================================== */

    function calculateFocusMinutes() {

        if (!activities.length) return 540;

        return activities.reduce(
            (sum, activity) =>
                sum + Number(activity.duration || 0),
            0
        );
    }


    function formatFocusTime(minutes) {

        minutes = Number(minutes) || 0;

        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours === 0) {
            return mins + "m";
        }

        if (mins === 0) {
            return hours + "hr";
        }

        return hours + "hr " + mins + "m";
    }


    /* =====================================================
       LOCAL STORAGE
       ===================================================== */

    function saveActivities() {

        localStorage.setItem(
            "lifeos_activities",
            JSON.stringify(activities)
        );
    }


    /* =====================================================
       ADD ACTIVITY BUTTON
       ===================================================== */

    const addButton = document.querySelector(".add-btn");

    if (addButton) {

        addButton.type = "button";

        addButton.addEventListener("click", (event) => {

            event.preventDefault();

            openActivityModal();

        });
    }


    /* =====================================================
       CREATE ACTIVITY MODAL
       ===================================================== */

    function createModal() {

        if (document.getElementById("lifeosActivityModal")) {
            return;
        }

        const modal = document.createElement("div");

        modal.id = "lifeosActivityModal";

        modal.innerHTML = `

            <div class="lifeos-modal-backdrop"></div>

            <div class="lifeos-modal">

                <div class="lifeos-modal-header">

                    <div>
                        <h2>Add Activity</h2>
                        <p>Track what you worked on today.</p>
                    </div>

                    <button
                        type="button"
                        class="lifeos-close"
                        id="lifeosCloseModal">
                        ×
                    </button>

                </div>


                <form id="lifeosActivityForm">

                    <div class="lifeos-field">

                        <label>Activity name</label>

                        <input
                            type="text"
                            id="activityName"
                            placeholder="e.g. Project development"
                            required>

                    </div>


                    <div class="lifeos-row">

                        <div class="lifeos-field">

                            <label>Category</label>

                            <select id="activityCategory">

                                <option value="Development">
                                    Development
                                </option>

                                <option value="Work">
                                    Work
                                </option>

                                <option value="Study">
                                    Study
                                </option>

                                <option value="Meeting">
                                    Meeting
                                </option>

                                <option value="Personal">
                                    Personal
                                </option>

                            </select>

                        </div>


                        <div class="lifeos-field">

                            <label>Duration (minutes)</label>

                            <input
                                type="number"
                                id="activityDuration"
                                min="1"
                                value="60"
                                required>

                        </div>

                    </div>


                    <div class="lifeos-field">

                        <label>Productivity score</label>

                        <input
                            type="range"
                            id="activityProductivity"
                            min="0"
                            max="100"
                            value="80">

                        <div class="lifeos-range-value">
                            <span id="productivityNumber">80</span>%
                        </div>

                    </div>


                    <div class="lifeos-modal-actions">

                        <button
                            type="button"
                            class="lifeos-cancel"
                            id="lifeosCancel">
                            Cancel
                        </button>

                        <button
                            type="submit"
                            class="lifeos-save">
                            Save Activity
                        </button>

                    </div>

                </form>

            </div>
        `;

        document.body.appendChild(modal);


        /* CLOSE */

        document
            .getElementById("lifeosCloseModal")
            .addEventListener("click", closeActivityModal);


        document
            .getElementById("lifeosCancel")
            .addEventListener("click", closeActivityModal);


        document
            .querySelector(".lifeos-modal-backdrop")
            .addEventListener("click", closeActivityModal);


        /* PRODUCTIVITY SLIDER */

        const slider =
            document.getElementById("activityProductivity");

        const sliderValue =
            document.getElementById("productivityNumber");

        slider.addEventListener("input", () => {

            sliderValue.textContent =
                slider.value;

        });


        /* FORM */

        document
            .getElementById("lifeosActivityForm")
            .addEventListener("submit", saveNewActivity);
    }


    createModal();


    /* =====================================================
       OPEN MODAL
       ===================================================== */

    function openActivityModal() {

        createModal();

        const modal =
            document.getElementById("lifeosActivityModal");

        modal.classList.add("show");

        document.body.style.overflow = "hidden";

        setTimeout(() => {

            const input =
                document.getElementById("activityName");

            if (input) input.focus();

        }, 100);
    }


    /* =====================================================
       CLOSE MODAL
       ===================================================== */

    function closeActivityModal() {

        const modal =
            document.getElementById("lifeosActivityModal");

        if (!modal) return;

        modal.classList.remove("show");

        document.body.style.overflow = "";

        const form =
            document.getElementById("lifeosActivityForm");

        if (form) {
            form.reset();

            document.getElementById(
                "activityProductivity"
            ).value = 80;

            document.getElementById(
                "productivityNumber"
            ).textContent = "80";
        }
    }


    /* =====================================================
       SAVE ACTIVITY
       ===================================================== */

    function saveNewActivity(event) {

        event.preventDefault();

        const name =
            document.getElementById("activityName").value.trim();

        const category =
            document.getElementById("activityCategory").value;

        const duration =
            Number(
                document.getElementById("activityDuration").value
            );

        const productivity =
            Number(
                document.getElementById(
                    "activityProductivity"
                ).value
            );


        if (!name) {

            alert("Please enter an activity name.");

            return;
        }


        if (!duration || duration <= 0) {

            alert("Please enter a valid duration.");

            return;
        }


        const activity = {

            id: Date.now(),

            name: name,

            category: category,

            duration: duration,

            productivity: productivity,

            completed: true,

            date: new Date().toISOString(),

            displayDate:
                new Date().toLocaleDateString(
                    "en-US",
                    {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                    }
                )
        };


        activities.unshift(activity);

        saveActivities();

        closeActivityModal();

        updateDashboardStats();

        renderRecentActivities();

        showSuccessMessage(
            "Activity added successfully!"
        );
    }


    /* =====================================================
       SUCCESS MESSAGE
       ===================================================== */

    function showSuccessMessage(message) {

        const old =
            document.querySelector(".lifeos-toast");

        if (old) old.remove();


        const toast =
            document.createElement("div");

        toast.className =
            "lifeos-toast";

        toast.textContent =
            "✓ " + message;

        document.body.appendChild(toast);


        setTimeout(() => {

            toast.classList.add("hide");

        }, 2200);


        setTimeout(() => {

            toast.remove();

        }, 2600);
    }


    /* =====================================================
       RECENT ACTIVITIES SECTION
       ===================================================== */

    function createRecentActivitiesSection() {

        let section =
            document.getElementById(
                "lifeosRecentActivities"
            );

        if (section) return section;


        section =
            document.createElement("section");

        section.id =
            "lifeosRecentActivities";

        section.className =
            "lifeos-recent";


        const dashboardGrid =
            document.querySelector(".dashboard-grid");


        if (dashboardGrid) {

            dashboardGrid.insertAdjacentElement(
                "afterend",
                section
            );

        } else {

            document
                .querySelector(".main")
                .appendChild(section);
        }


        return section;
    }


    /* =====================================================
       RENDER ACTIVITIES
       ===================================================== */

    function renderRecentActivities() {

        const section =
            createRecentActivitiesSection();


        if (!activities.length) {

            section.innerHTML = `

                <div class="lifeos-recent-header">

                    <div>
                        <h2>Recent Activities</h2>
                        <p>Your latest activity</p>
                    </div>

                </div>

                <div class="lifeos-empty">
                    No activities yet. Click
                    <strong>+ Add Activity</strong>
                    to get started.
                </div>
            `;

            return;
        }


        const visibleActivities =
            activities.slice(0, 8);


        section.innerHTML = `

            <div class="lifeos-recent-header">

                <div>
                    <h2>Recent Activities</h2>
                    <p>Your latest activity</p>
                </div>

                <span>
                    ${activities.length} activities
                </span>

            </div>

            <div class="lifeos-activity-list">

                ${visibleActivities.map(activity => `

                    <div
                        class="lifeos-activity"
                        data-id="${activity.id}">

                        <div class="lifeos-activity-icon">
                            ✓
                        </div>

                        <div class="lifeos-activity-info">

                            <strong>
                                ${escapeHTML(activity.name)}
                            </strong>

                            <span>
                                ${escapeHTML(activity.category)}
                                ·
                                ${formatFocusTime(activity.duration)}
                                ·
                                ${activity.displayDate}
                            </span>

                        </div>

                        <div class="lifeos-activity-score">
                            ${activity.productivity}%
                        </div>

                        <button
                            type="button"
                            class="lifeos-delete"
                            data-delete="${activity.id}">
                            ×
                        </button>

                    </div>

                `).join("")}

            </div>
        `;


        /* DELETE */

        section
            .querySelectorAll("[data-delete]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(
                                button.dataset.delete
                            );

                        deleteActivity(id);

                    }
                );

            });
    }


    /* =====================================================
       DELETE ACTIVITY
       ===================================================== */

    function deleteActivity(id) {

        const activity =
            activities.find(
                item => item.id === id
            );

        if (!activity) return;


        const confirmed =
            confirm(
                `Delete "${activity.name}"?`
            );


        if (!confirmed) return;


        activities =
            activities.filter(
                item => item.id !== id
            );


        saveActivities();

        updateDashboardStats();

        renderRecentActivities();

        showSuccessMessage(
            "Activity deleted."
        );
    }


    /* =====================================================
       ESCAPE HTML
       ===================================================== */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       NAVIGATION
       ===================================================== */

    const navItems =
        document.querySelectorAll(".nav-item");


    navItems.forEach((item, index) => {

        item.style.cursor = "pointer";


        item.addEventListener("click", () => {

            navItems.forEach(nav => {
                nav.classList.remove("active");
            });

            item.classList.add("active");


            switch (index) {

                case 0:
                    showDashboard();
                    break;

                case 1:
                    showActivitiesView();
                    break;

                case 2:
                    showAnalyticsView();
                    break;

                case 3:
                    showGoalsView();
                    break;

                case 4:
                    showFocusMode();
                    break;
            }
        });
    });


    /* =====================================================
       DASHBOARD VIEW
       ===================================================== */

    function showDashboard() {

        const dashboard =
            document.querySelector(".main");

        if (!dashboard) return;


        document
            .querySelector(".welcome")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
    }


    /* =====================================================
       ACTIVITIES VIEW
       ===================================================== */

    function showActivitiesView() {

        renderRecentActivities();

        const section =
            document.getElementById(
                "lifeosRecentActivities"
            );

        if (section) {

            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }


    /* =====================================================
       ANALYTICS VIEW
       ===================================================== */

    function showAnalyticsView() {

        const productivity =
            calculateProductivity();

        const focus =
            calculateFocusMinutes();


        let message = `

            <div class="lifeos-panel">

                <div class="lifeos-panel-header">

                    <div>
                        <h2>Analytics</h2>
                        <p>Your productivity summary</p>
                    </div>

                    <button
                        type="button"
                        class="lifeos-panel-close">
                        ×
                    </button>

                </div>

                <div class="lifeos-analytics-grid">

                    <div>
                        <span>Productivity</span>
                        <strong>${productivity}%</strong>
                    </div>

                    <div>
                        <span>Focus Time</span>
                        <strong>
                            ${formatFocusTime(focus)}
                        </strong>
                    </div>

                    <div>
                        <span>Activities</span>
                        <strong>
                            ${activities.length || 88}
                        </strong>
                    </div>

                    <div>
                        <span>Goal Progress</span>
                        <strong>
                            ${goalsProgress}%
                        </strong>
                    </div>

                </div>

            </div>
        `;


        openPanel(message);
    }


    /* =====================================================
       GOALS VIEW
       ===================================================== */

    function showGoalsView() {

        const message = `

            <div class="lifeos-panel">

                <div class="lifeos-panel-header">

                    <div>
                        <h2>Goals</h2>
                        <p>Track your weekly progress</p>
                    </div>

                    <button
                        type="button"
                        class="lifeos-panel-close">
                        ×
                    </button>

                </div>


                <div class="lifeos-goal">

                    <div class="lifeos-goal-top">

                        <strong>
                            Weekly Productivity Goal
                        </strong>

                        <span>
                            ${goalsProgress}%
                        </span>

                    </div>

                    <div class="lifeos-progress">

                        <div
                            style="width:${goalsProgress}%">
                        </div>

                    </div>

                </div>


                <div class="lifeos-goal-actions">

                    <button
                        type="button"
                        data-goal="5">
                        +5%
                    </button>

                    <button
                        type="button"
                        data-goal="10">
                        +10%
                    </button>

                    <button
                        type="button"
                        data-goal="-5">
                        -5%
                    </button>

                </div>

            </div>
        `;


        openPanel(message);


        document
            .querySelectorAll("[data-goal]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        goalsProgress =
                            Math.max(
                                0,
                                Math.min(
                                    100,
                                    goalsProgress +
                                    Number(
                                        button.dataset.goal
                                    )
                                )
                            );


                        localStorage.setItem(
                            "lifeos_goals",
                            goalsProgress
                        );


                        updateDashboardStats();

                        showGoalsView();

                    }
                );
            });
    }


    /* =====================================================
       GENERIC PANEL
       ===================================================== */

    function openPanel(content) {

        let panel =
            document.getElementById(
                "lifeosPanelOverlay"
            );


        if (!panel) {

            panel =
                document.createElement("div");

            panel.id =
                "lifeosPanelOverlay";

            document.body.appendChild(panel);
        }


        panel.innerHTML = content;

        panel.classList.add("show");

        document.body.style.overflow = "hidden";


        const close =
            panel.querySelector(
                ".lifeos-panel-close"
            );


        if (close) {

            close.addEventListener(
                "click",
                closePanel
            );
        }


        panel.addEventListener(
            "click",
            event => {

                if (
                    event.target === panel
                ) {
                    closePanel();
                }
            }
        );
    }


    function closePanel() {

        const panel =
            document.getElementById(
                "lifeosPanelOverlay"
            );

        if (panel) {
            panel.classList.remove("show");
        }

        document.body.style.overflow = "";
    }


    /* =====================================================
       FOCUS MODE
       ===================================================== */

    function showFocusMode() {

        let focus =
            document.getElementById(
                "lifeosFocusMode"
            );


        if (!focus) {

            focus =
                document.createElement("div");

            focus.id =
                "lifeosFocusMode";

            focus.innerHTML = `

                <div class="focus-inner">

                    <button
                        type="button"
                        class="focus-close"
                        id="focusClose">
                        ×
                    </button>

                    <div class="focus-label">
                        FOCUS MODE
                    </div>

                    <div
                        class="focus-timer"
                        id="focusTimer">
                        25:00
                    </div>

                    <div class="focus-task">
                        Deep work session
                    </div>

                    <button
                        type="button"
                        class="focus-start"
                        id="focusStart">
                        Start Focus
                    </button>

                </div>
            `;

            document.body.appendChild(focus);


            let seconds = 25 * 60;

            let interval = null;

            const timer =
                focus.querySelector(
                    "#focusTimer"
                );

            const start =
                focus.querySelector(
                    "#focusStart"
                );


            start.addEventListener(
                "click",
                () => {

                    if (interval) {

                        clearInterval(interval);

                        interval = null;

                        start.textContent =
                            "Start Focus";

                        return;
                    }


                    start.textContent =
                        "Pause Focus";


                    interval =
                        setInterval(() => {

                            if (seconds <= 0) {

                                clearInterval(interval);

                                interval = null;

                                start.textContent =
                                    "Start Focus";

                                alert(
                                    "Focus session complete!"
                                );

                                return;
                            }


                            seconds--;


                            const mins =
                                Math.floor(
                                    seconds / 60
                                );

                            const secs =
                                seconds % 60;


                            timer.textContent =
                                String(mins).padStart(
                                    2,
                                    "0"
                                )
                                + ":" +
                                String(secs).padStart(
                                    2,
                                    "0"
                                );

                        }, 1000);
                }
            );


            focus.querySelector(
                "#focusClose"
            ).addEventListener(
                "click",
                () => {

                    if (interval) {
                        clearInterval(interval);
                    }

                    focus.classList.remove("show");

                    document.body.style.overflow =
                        "";

                }
            );
        }


        focus.classList.add("show");

        document.body.style.overflow =
            "hidden";
    }


    /* =====================================================
       DARK MODE
       ===================================================== */

    const darkModeButton =
        document.querySelector(".dark-mode");


    if (darkModeButton) {

        darkModeButton.style.cursor =
            "pointer";


        darkModeButton.addEventListener(
            "click",
            () => {

                darkMode =
                    !darkMode;

                localStorage.setItem(
                    "lifeos_dark",
                    darkMode
                );

                applyDarkMode();
            }
        );
    }


    function applyDarkMode() {

        document.body.classList.toggle(
            "lifeos-dark",
            darkMode
        );
    }


    applyDarkMode();


    /* =====================================================
       ADD REQUIRED DYNAMIC STYLES
       No style.css changes required.
       ===================================================== */

    const dynamicStyle =
        document.createElement("style");


    dynamicStyle.textContent = `

        /* MODAL */

        #lifeosActivityModal,
        #lifeosPanelOverlay,
        #lifeosFocusMode {

            position: fixed;
            inset: 0;
            z-index: 9999;
            display: none;
            align-items: center;
            justify-content: center;
        }


        #lifeosActivityModal.show,
        #lifeosPanelOverlay.show,
        #lifeosFocusMode.show {

            display: flex;
        }


        .lifeos-modal-backdrop {

            position: absolute;
            inset: 0;
            background: rgba(10,15,30,.55);
            backdrop-filter: blur(4px);
        }


        .lifeos-modal {

            position: relative;
            width: min(520px, calc(100% - 32px));
            background: white;
            border-radius: 18px;
            padding: 28px;
            box-shadow: 0 25px 70px rgba(0,0,0,.2);
            z-index: 2;
            animation: lifeosModalIn .2s ease;
        }


        @keyframes lifeosModalIn {

            from {
                opacity: 0;
                transform: translateY(12px) scale(.98);
            }

            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }


        .lifeos-modal-header {

            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 24px;
        }


        .lifeos-modal-header h2 {

            margin: 0;
            font-size: 22px;
            color: #171b2e;
        }


        .lifeos-modal-header p {

            margin-top: 5px;
            font-size: 14px;
            color: #737b8d;
        }


        .lifeos-close {

            border: 0;
            background: #f2f3f7;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            font-size: 22px;
            cursor: pointer;
            color: #555d70;
        }


        .lifeos-field {

            margin-bottom: 18px;
        }


        .lifeos-field label {

            display: block;
            margin-bottom: 7px;
            font-size: 13px;
            font-weight: 600;
            color: #4e5669;
        }


        .lifeos-field input,
        .lifeos-field select {

            width: 100%;
            height: 45px;
            border: 1px solid #dfe2e9;
            border-radius: 9px;
            padding: 0 13px;
            font-size: 14px;
            outline: none;
            background: white;
        }


        .lifeos-field input:focus,
        .lifeos-field select:focus {

            border-color: #7659ed;
            box-shadow: 0 0 0 3px rgba(118,89,237,.1);
        }


        .lifeos-row {

            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
        }


        .lifeos-field input[type="range"] {

            height: auto;
            padding: 0;
            border: 0;
            accent-color: #7659ed;
        }


        .lifeos-range-value {

            text-align: right;
            font-size: 13px;
            color: #7659ed;
            font-weight: 600;
        }


        .lifeos-modal-actions {

            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 25px;
        }


        .lifeos-cancel,
        .lifeos-save {

            height: 43px;
            padding: 0 18px;
            border-radius: 9px;
            border: 0;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
        }


        .lifeos-cancel {

            background: #f0f1f5;
            color: #555d70;
        }


        .lifeos-save {

            background: #7659ed;
            color: white;
        }


        /* TOAST */

        .lifeos-toast {

            position: fixed;
            right: 25px;
            bottom: 25px;
            z-index: 10001;
            background: #171b2e;
            color: white;
            padding: 13px 18px;
            border-radius: 10px;
            font-size: 14px;
            box-shadow: 0 10px 30px rgba(0,0,0,.18);
            animation: toastIn .25s ease;
        }


        .lifeos-toast.hide {

            opacity: 0;
            transform: translateY(10px);
            transition: .3s;
        }


        @keyframes toastIn {

            from {
                opacity: 0;
                transform: translateY(10px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }


        /* RECENT ACTIVITIES */

        .lifeos-recent {

            margin-top: 24px;
            background: white;
            border: 1px solid #e1e3e9;
            border-radius: 16px;
            padding: 25px 27px;
        }


        .lifeos-recent-header {

            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 18px;
        }


        .lifeos-recent-header h2 {

            margin: 0;
            font-size: 20px;
            color: #171b2e;
        }


        .lifeos-recent-header p {

            margin-top: 4px;
            color: #737b8d;
            font-size: 14px;
        }


        .lifeos-recent-header > span {

            color: #7659ed;
            background: #eee9ff;
            padding: 7px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }


        .lifeos-activity-list {

            display: flex;
            flex-direction: column;
        }


        .lifeos-activity {

            min-height: 67px;
            display: flex;
            align-items: center;
            gap: 13px;
            border-top: 1px solid #edf0f4;
        }


        .lifeos-activity-icon {

            width: 38px;
            height: 38px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #dcf8e8;
            color: #19b85a;
            font-weight: 700;
        }


        .lifeos-activity-info {

            flex: 1;
            min-width: 0;
        }


        .lifeos-activity-info strong {

            display: block;
            font-size: 14px;
            color: #171b2e;
            margin-bottom: 4px;
        }


        .lifeos-activity-info span {

            display: block;
            font-size: 12px;
            color: #7b8292;
        }


        .lifeos-activity-score {

            font-size: 13px;
            font-weight: 700;
            color: #7659ed;
        }


        .lifeos-delete {

            border: 0;
            background: transparent;
            color: #9aa1b0;
            font-size: 22px;
            cursor: pointer;
            padding: 5px;
        }


        .lifeos-delete:hover {

            color: #e34d59;
        }


        .lifeos-empty {

            padding: 25px 0;
            color: #7b8292;
            font-size: 14px;
        }


        /* PANELS */

        #lifeosPanelOverlay {

            background: rgba(10,15,30,.55);
            backdrop-filter: blur(4px);
            padding: 20px;
        }


        .lifeos-panel {

            width: min(600px, 100%);
            background: white;
            border-radius: 18px;
            padding: 28px;
            box-shadow: 0 25px 70px rgba(0,0,0,.2);
        }


        .lifeos-panel-header {

            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 25px;
        }


        .lifeos-panel-header h2 {

            margin: 0;
            font-size: 23px;
        }


        .lifeos-panel-header p {

            margin-top: 5px;
            color: #737b8d;
            font-size: 14px;
        }


        .lifeos-panel-close {

            border: 0;
            background: #f1f2f6;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            font-size: 21px;
            cursor: pointer;
        }


        .lifeos-analytics-grid {

            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 13px;
        }


        .lifeos-analytics-grid > div {

            background: #f7f7fb;
            border-radius: 12px;
            padding: 18px;
        }


        .lifeos-analytics-grid span {

            display: block;
            color: #737b8d;
            font-size: 13px;
            margin-bottom: 7px;
        }


        .lifeos-analytics-grid strong {

            font-size: 23px;
        }


        .lifeos-goal-top {

            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 14px;
        }


        .lifeos-goal-top span {

            color: #7659ed;
            font-weight: 700;
        }


        .lifeos-progress {

            width: 100%;
            height: 10px;
            background: #eeeef4;
            border-radius: 10px;
            overflow: hidden;
        }


        .lifeos-progress div {

            height: 100%;
            background: #7659ed;
            border-radius: 10px;
            transition: width .3s;
        }


        .lifeos-goal-actions {

            display: flex;
            gap: 8px;
            margin-top: 20px;
        }


        .lifeos-goal-actions button {

            border: 0;
            background: #eee9ff;
            color: #7659ed;
            padding: 8px 14px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
        }


        /* FOCUS MODE */

        #lifeosFocusMode {

            background: #101827;
            color: white;
        }


        .focus-inner {

            text-align: center;
            position: relative;
        }


        .focus-close {

            position: fixed;
            top: 30px;
            right: 35px;
            border: 0;
            background: rgba(255,255,255,.1);
            color: white;
            width: 42px;
            height: 42px;
            border-radius: 50%;
            font-size: 25px;
            cursor: pointer;
        }


        .focus-label {

            color: #9b88ff;
            font-size: 13px;
            letter-spacing: 2px;
            font-weight: 700;
        }


        .focus-timer {

            font-size: clamp(70px, 13vw, 150px);
            font-weight: 600;
            margin: 25px 0;
            letter-spacing: -5px;
        }


        .focus-task {

            color: #aeb5c5;
            font-size: 17px;
            margin-bottom: 30px;
        }


        .focus-start {

            border: 0;
            background: #7659ed;
            color: white;
            border-radius: 10px;
            padding: 14px 25px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
        }


        /* DARK MODE */

        body.lifeos-dark {

            background: #0d1220;
            color: #f5f6fb;
        }


        body.lifeos-dark .main {

            background: #0d1220;
        }


        body.lifeos-dark .topbar {

            border-color: #252b3b;
        }


        body.lifeos-dark .welcome h1,
        body.lifeos-dark .stat-value,
        body.lifeos-dark .productivity-title,
        body.lifeos-dark .lifeos-recent-header h2 {

            color: #f5f6fb;
        }


        body.lifeos-dark .stat-card,
        body.lifeos-dark .productivity-card,
        body.lifeos-dark .lifeos-recent {

            background: #151b2b;
            border-color: #252b3b;
        }


        body.lifeos-dark .insight-card {

            border: 0;
        }


        body.lifeos-dark .subtitle,
        body.lifeos-dark .productivity-subtitle,
        body.lifeos-dark .stat-label,
        body.lifeos-dark .stat-bottom,
        body.lifeos-dark .lifeos-recent-header p {

            color: #929bad;
        }


        body.lifeos-dark .notification {

            background: #151b2b;
            border-color: #252b3b;
        }


        body.lifeos-dark .lifeos-modal,
        body.lifeos-dark .lifeos-panel {

            background: #151b2b;
            color: white;
        }


        body.lifeos-dark .lifeos-modal-header h2 {

            color: white;
        }


        body.lifeos-dark .lifeos-field input,
        body.lifeos-dark .lifeos-field select {

            background: #0f1523;
            border-color: #303749;
            color: white;
        }


        body.lifeos-dark .lifeos-activity {

            border-color: #292f3e;
        }


        body.lifeos-dark .lifeos-activity-info strong {

            color: white;
        }


        body.lifeos-dark .lifeos-analytics-grid > div {

            background: #0f1523;
        }


        @media (max-width: 600px) {

            .lifeos-row,
            .lifeos-analytics-grid {

                grid-template-columns: 1fr;
            }

            .lifeos-modal {

                padding: 22px;
            }

            .lifeos-activity-score {

                display: none;
            }

        }

    `;


    document.head.appendChild(dynamicStyle);


    /* =====================================================
       INITIALIZE
       ===================================================== */

    updateDashboardStats();

    renderRecentActivities();


    /* =====================================================
       UPDATE DATE AT MIDNIGHT
       ===================================================== */

    setInterval(() => {

        updateDate();

    }, 60000);


});