let currentSection = 1;
const totalSections = 3;
let isSubmitting = false;

/* -------------------- PROGRESS BAR -------------------- */

function updateProgress(section) {
    const pct = Math.round((section / totalSections) * 100);
    const bar = document.getElementById("progress-fill");
    if (bar) bar.style.width = pct + "%";
}

/* -------------------- OPTION SELECTION STYLE -------------------- */

document.addEventListener("change", function (e) {

    const input = e.target;

    if (input.type === "radio") {

        const all = document.querySelectorAll(`input[name="${input.name}"]`);

        all.forEach(opt => {
            const item = opt.closest(".option-item");
            if (item) item.classList.remove("selected");
        });

        const selected = input.closest(".option-item");
        if (selected) selected.classList.add("selected");

    }

});

/* -------------------- VALIDATION -------------------- */

function validateSection(n) {

    let valid = true;

    function req(group, id) {

        const g = document.getElementById(group);
        const value = document.getElementById(id).value;

        if (!value || value.trim() === "") {
            g.classList.add("has-error");
            valid = false;
        } else {
            g.classList.remove("has-error");
        }

    }

    function email(group, id) {

        const g = document.getElementById(group);
        const val = document.getElementById(id).value;

        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!re.test(val)) {
            g.classList.add("has-error");
            valid = false;
        } else {
            g.classList.remove("has-error");
        }

    }

    function phone(group, id) {

        const g = document.getElementById(group);
        const val = document.getElementById(id).value;

        const re = /^[6-9]\d{9}$/;

        if (!re.test(val)) {
            g.classList.add("has-error");
            valid = false;
        } else {
            g.classList.remove("has-error");
        }

    }

    function radio(group, name) {

        const g = document.getElementById(group);
        const checked = document.querySelector(`input[name="${name}"]:checked`);

        if (!checked) {
            g.classList.add("has-error");
            valid = false;
        } else {
            g.classList.remove("has-error");
        }

    }

    if (n === 1) {

        req("q-name", "name");
        email("q-email", "email");
        phone("q-phone", "phone");
        radio("q-age", "age");
        radio("q-status", "status");

    }

    if (n === 3) {

        radio("q-showup", "showup");

    }

    return valid;

}

/* -------------------- NAVIGATION -------------------- */

function nextSection(from) {

    if (!validateSection(from)) {
        const err = document.querySelector(`#section-${from} .has-error`);
        if (err) err.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
    }

    document.getElementById(`section-${from}`).classList.remove("active");

    currentSection = from + 1;

    document.getElementById(`section-${currentSection}`).classList.add("active");

    updateProgress(currentSection);

    window.scrollTo({ top: 0, behavior: "smooth" });

}

function prevSection(from) {

    document.getElementById(`section-${from}`).classList.remove("active");

    currentSection = from - 1;

    document.getElementById(`section-${currentSection}`).classList.add("active");

    updateProgress(currentSection);

    window.scrollTo({ top: 0, behavior: "smooth" });

}

/* -------------------- GOOGLE FORM SUBMISSION -------------------- */

function submitForm() {

    if (isSubmitting) return;

    if (!validateSection(3)) {
        const err = document.querySelector("#section-3 .has-error");
        if (err) err.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
    }

    /* Honeypot spam trap */

    const honey = document.getElementById("company");
    if (honey && honey.value !== "") {
        console.warn("Bot submission blocked");
        return;
    }

    isSubmitting = true;

    const btn = document.getElementById("submit-btn");

    if (btn) {
        btn.disabled = true;
        btn.innerText = "Submitting...";
    }

    const formData = new FormData();

    /* -------- BASIC INFO -------- */

    formData.append("entry.1625147059", document.getElementById("name").value);
    formData.append("entry.348015786", document.getElementById("email").value);
    formData.append("entry.2075682983", document.getElementById("phone").value);

    const age = document.querySelector('input[name="age"]:checked');
    if (age) formData.append("entry.317138815", age.value);

    const status = document.querySelector('input[name="status"]:checked');
    if (status) formData.append("entry.1954529745", status.value);

    /* -------- SECTION 2 -------- */

    const time = document.querySelector('input[name="time"]:checked');
    if (time) formData.append("entry.469191227", time.value);

    const doubt = document.getElementById("doubt").value;
    if (doubt) formData.append("entry.1388942439", doubt);

    /* -------- SECTION 3 -------- */

    const showup = document.querySelector('input[name="showup"]:checked');
    if (showup) formData.append("entry.179729991", showup.value);

    const extra = document.getElementById("extra").value;
    if (extra) formData.append("entry.2131221797", extra);

    /* -------- SUBMIT TO GOOGLE FORM -------- */

    fetch(
        "https://docs.google.com/forms/d/e/1FAIpQLScGhUO0472l_2p5261rsUwt6QpsyDUM8AU794ZxRzsxIUxltg/formResponse",
        {
            method: "POST",
            mode: "no-cors",
            body: formData
        }
    ).then(() => {

        /* Hide sections */

        for (let i = 1; i <= 3; i++) {
            const sec = document.getElementById(`section-${i}`);
            if (sec) sec.classList.remove("active");
        }

        /* Show confirmation */

        document.getElementById("confirm-screen").style.display = "block";

        updateProgress(3);

        window.scrollTo({ top: 0, behavior: "smooth" });

    }).catch(() => {

        alert("Something went wrong. Please try again.");

        if (btn) {
            btn.disabled = false;
            btn.innerText = "Submit Application →";
        }

        isSubmitting = false;

    });

}

/* -------------------- INIT -------------------- */

document.addEventListener("DOMContentLoaded", function () {
    updateProgress(1);
});