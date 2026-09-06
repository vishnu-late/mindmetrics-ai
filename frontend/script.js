/**
 * MindMetrics AI - Student Mental Health Frontend Logic
 * Interacts with FastAPI backend endpoint: POST http://127.0.0.1:8000/predict
 */

document.addEventListener('DOMContentLoaded', () => {
    // API Configuration
    const API_BASE_URL = 'https://mindmetrics-ai-b07k.onrender.com';
    const PREDICT_ENDPOINT = `${API_BASE_URL}/predict`;

    // DOM Element References
    const form = document.getElementById('predictionForm');
    const submitBtn = document.getElementById('submitBtn');
    const resetFormBtn = document.getElementById('resetFormBtn');
    const loadingCard = document.getElementById('loadingCard');
    const resultCard = document.getElementById('resultCard');
    const reassessBtn = document.getElementById('reassessBtn');
    const apiErrorBanner = document.getElementById('apiErrorBanner');
    const apiErrorMessage = document.getElementById('apiErrorMessage');
    const closeErrorBtn = document.getElementById('closeErrorBtn');
    const formCard = document.getElementById('formCard');

    // Result Card References
    const scoreValueEl = document.getElementById('scoreValue');
    const gaugeCircle = document.getElementById('gaugeCircle');
    const scoreDescription = document.getElementById('scoreDescription');
    const summaryGrid = document.getElementById('summaryGrid');
    const sleepInsight = document.getElementById('sleepInsight');
    const activityInsight = document.getElementById('activityInsight');
    const screenInsight = document.getElementById('screenInsight');

    // Circle Circumference for SVG Gauge (2 * PI * 60)
    const GAUGE_CIRCUMFERENCE = 376.99;

    // Real-time input validation on input & change events
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', () => validateField(input));
        input.addEventListener('change', () => validateField(input));
    });

    /**
     * Validate an individual field based on dataset & Pydantic rules
     * @param {HTMLElement} input 
     * @returns {boolean}
     */
    function validateField(input) {
        const inputGroup = input.closest('.input-group');
        if (!inputGroup) return true;

        let isValid = true;
        const val = input.value.trim();

        if (input.hasAttribute('required') && !val) {
            isValid = false;
        } else if (input.type === 'number') {
            const numVal = parseFloat(val);
            const min = input.hasAttribute('min') ? parseFloat(input.min) : null;
            const max = input.hasAttribute('max') ? parseFloat(input.max) : null;

            if (isNaN(numVal)) {
                isValid = false;
            } else if (min !== null && numVal < min) {
                isValid = false;
            } else if (max !== null && numVal > max) {
                isValid = false;
            }
        }

        if (isValid) {
            inputGroup.classList.remove('invalid');
        } else {
            inputGroup.classList.add('invalid');
        }

        return isValid;
    }

    /**
     * Validate all form fields prior to submission
     * @returns {boolean}
     */
    function validateForm() {
        let isFormValid = true;
        let firstInvalidField = null;

        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = input;
                }
            }
        });

        if (!isFormValid && firstInvalidField) {
            const container = firstInvalidField.closest('.input-group');
            if (container) {
                container.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        return isFormValid;
    }

    /**
     * Collect and cast form values matching StudentData Pydantic Schema
     * @returns {Object}
     */
    function getFormData() {
        return {
            age: parseInt(document.getElementById('age').value, 10),
            gender: document.getElementById('gender').value,
            country: document.getElementById('country').value,
            academic_level: document.getElementById('academic_level').value,
            most_used_platform: document.getElementById('most_used_platform').value,
            purpose_of_use: document.getElementById('purpose_of_use').value,
            avg_daily_usage_hours: parseFloat(document.getElementById('avg_daily_usage_hours').value),
            daily_unlocks: parseInt(document.getElementById('daily_unlocks').value, 10),
            study_hours: parseFloat(document.getElementById('study_hours').value),
            physical_activity_hours: parseFloat(document.getElementById('physical_activity_hours').value),
            sleep_hours_per_night: parseFloat(document.getElementById('sleep_hours_per_night').value),
            stress_level: document.getElementById('stress_level').value
        };
    }

    /**
     * Form Submission Handler
     */
    form.addEventListener('submit', async(e) => {
        e.preventDefault();
        hideErrorBanner();

        if (!validateForm()) {
            return;
        }

        const payload = getFormData();
        showLoadingState();

        try {
            const response = await fetch(PREDICT_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                let errorDetails = `HTTP Error ${response.status}: ${response.statusText}`;
                try {
                    const errData = await response.json();
                    if (errData.detail) {
                        if (Array.isArray(errData.detail)) {
                            errorDetails = errData.detail.map(d => `${d.loc.join('.')}: ${d.msg}`).join(', ');
                        } else {
                            errorDetails = errData.detail;
                        }
                    }
                } catch (_) {}
                throw new Error(errorDetails);
            }

            const data = await response.json();

            if (typeof data.predicted_mental_health_score !== 'number') {
                throw new Error("Invalid response format: 'predicted_mental_health_score' missing.");
            }

            hideLoadingState();
            renderResults(data.predicted_mental_health_score, payload);

        } catch (error) {
            console.error("FastAPI Backend Error:", error);
            hideLoadingState();

            let userFriendlyMsg = "Unable to connect to the prediction server. Please make sure the FastAPI backend is running on http://127.0.0.1:8000 and try again.";
            if (error.message && !error.message.includes('Failed to fetch') && !error.message.includes('NetworkError')) {
                userFriendlyMsg = `Server error encountered: ${error.message}`;
            }

            showErrorBanner(userFriendlyMsg);
        }
    });

    /**
     * Render Prediction Score, Gauge, Summary & Insights
     * @param {number} score - Exact prediction float returned by backend
     * @param {Object} payload - Submitted student payload
     */
    function renderResults(score, payload) {
        resultCard.classList.remove('hidden');
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Animate counter from 0 to exact score
        animateCounter(score);

        // Update Circular SVG Gauge (Score normalized on 0-10 scale)
        const normalizedRatio = Math.min(Math.max(score / 10, 0), 1);
        const dashoffset = GAUGE_CIRCUMFERENCE * (1 - normalizedRatio);

        // Set gauge color stroke based on score scale
        let strokeColor = 'var(--accent-indigo)';
        if (score < 5.0) {
            strokeColor = 'var(--accent-pink)';
        } else if (score > 7.5) {
            strokeColor = 'var(--accent-emerald)';
        }

        gaugeCircle.style.stroke = strokeColor;
        gaugeCircle.style.strokeDashoffset = dashoffset;

        scoreDescription.textContent = `Continuous ML regression prediction: ${score.toFixed(2)} out of 10.`;

        // Render Submitted Input Summary Grid
        renderSummaryGrid(payload);

        // Render Prediction Insights based on payload inputs
        if (payload.sleep_hours_per_night < 6) {
            sleepInsight.textContent = `${payload.sleep_hours_per_night} hrs/night - Below recommended 7-9 hours per night.`;
        } else {
            sleepInsight.textContent = `${payload.sleep_hours_per_night} hrs/night - Within healthy sleep recovery range.`;
        }

        if (payload.physical_activity_hours < 0.5) {
            activityInsight.textContent = `${payload.physical_activity_hours} hrs/day - Low daily physical activity reported.`;
        } else {
            activityInsight.textContent = `${payload.physical_activity_hours} hrs/day - Healthy active daily routine.`;
        }

        if (payload.avg_daily_usage_hours > 6) {
            screenInsight.textContent = `${payload.avg_daily_usage_hours} hrs screen time (${payload.daily_unlocks} unlocks/day).`;
        } else {
            screenInsight.textContent = `${payload.avg_daily_usage_hours} hrs screen time - Moderate digital exposure.`;
        }
    }

    /**
     * Render Input Summary Grid
     * @param {Object} payload 
     */
    function renderSummaryGrid(payload) {
        const items = [
            { label: 'Age', value: `${payload.age} yrs` },
            { label: 'Gender', value: payload.gender },
            { label: 'Country', value: payload.country },
            { label: 'Academic Level', value: payload.academic_level },
            { label: 'Most Used Platform', value: payload.most_used_platform },
            { label: 'Primary Purpose', value: payload.purpose_of_use },
            { label: 'Daily Screen Time', value: `${payload.avg_daily_usage_hours} hrs` },
            { label: 'Daily Phone Unlocks', value: `${payload.daily_unlocks}` },
            { label: 'Daily Study Hours', value: `${payload.study_hours} hrs` },
            { label: 'Physical Activity', value: `${payload.physical_activity_hours} hrs` },
            { label: 'Sleep Hours', value: `${payload.sleep_hours_per_night} hrs` },
            { label: 'Stress Level', value: payload.stress_level }
        ];

        summaryGrid.innerHTML = items.map(item => `
            <div class="summary-item">
                <span class="summary-label">${item.label}</span>
                <span class="summary-val">${item.value}</span>
            </div>
        `).join('');
    }

    /**
     * Animate score counter smoothly from 0 to exact target score
     * @param {number} targetScore 
     */
    function animateCounter(targetScore) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            scoreValueEl.textContent = targetScore.toFixed(2);
            return;
        }

        let current = 0;
        const duration = 1200; // ms
        const steps = 40;
        const increment = targetScore / steps;
        const stepTime = duration / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= targetScore) {
                current = targetScore;
                clearInterval(timer);
            }
            scoreValueEl.textContent = current.toFixed(2);
        }, stepTime);
    }

    /**
     * Reset form and clear UI states
     */
    function resetFormState() {
        form.reset();
        inputs.forEach(input => input.closest('.input-group') ? .classList.remove('invalid'));
        hideLoadingState();
        hideErrorBanner();
        resultCard.classList.add('hidden');
        gaugeCircle.style.strokeDashoffset = GAUGE_CIRCUMFERENCE;
        scoreValueEl.textContent = "0.00";
        formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    resetFormBtn.addEventListener('click', resetFormState);
    reassessBtn.addEventListener('click', resetFormState);

    if (closeErrorBtn) {
        closeErrorBtn.addEventListener('click', hideErrorBanner);
    }

    // UI Helper Functions
    function showLoadingState() {
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'Analyzing Student Data...';
        loadingCard.classList.remove('hidden');
        resultCard.classList.add('hidden');
        loadingCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function hideLoadingState() {
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = 'Predict Mental Health Score';
        loadingCard.classList.add('hidden');
    }

    function showErrorBanner(msg) {
        apiErrorMessage.textContent = msg;
        apiErrorBanner.classList.remove('hidden');
        apiErrorBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function hideErrorBanner() {
        apiErrorBanner.classList.add('hidden');
    }
});