<script setup>
import { ref } from "vue";

const props = defineProps({
    imagePosition: {
        type: String,
        default: "left",
        validator: (value) => ["left", "right"].includes(value),
    },
    imageSrc: {
        type: String,
        default: "/contact-image.jpg",
    },
    imageAlt: {
        type: String,
        default: "Contact us",
    },
    apiEndpoint: {
        type: String,
        default: "/api/contact",
    },
    purposes: {
        type: Array,
        default: () => [
            "General Inquiry",
            "Technical Support",
            "Partnership Opportunity",
            "Feedback",
            "Bug Report",
            "Other",
        ],
    },
});

const formData = ref({
    name: "",
    purpose: "",
    message: "",
});

const submitting = ref(false);
const submitted = ref(false);
const error = ref(null);

async function handleSubmit() {
    if (
        !formData.value.name ||
        !formData.value.purpose ||
        !formData.value.message
    ) {
        error.value = "Please fill in all fields";
        return;
    }

    submitting.value = true;
    error.value = null;

    try {
        const response = await fetch(props.apiEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: formData.value.name,
                purpose: formData.value.purpose,
                message: formData.value.message,
                timestamp: new Date().toISOString(),
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        submitted.value = true;

        setTimeout(() => {
            formData.value = { name: "", purpose: "", message: "" };
            submitted.value = false;
        }, 3000);
    } catch (err) {
        console.error("Form submission error:", err);
        error.value = "Failed to send message. Please try again.";
    } finally {
        submitting.value = false;
    }
}
</script>

<template>
    <div class="contact-section" :class="`image-${imagePosition}`">
        <div class="contact-image">
            <img :src="imageSrc" :alt="imageAlt" />
        </div>

        <div class="contact-form-wrapper">
            <div class="contact-form">
                <h3>Get in Touch</h3>
                <p class="contact-description">
                    Have a question or want to work together? Drop me a message!
                </p>

                <form @submit.prevent="handleSubmit" v-if="!submitted">
                    <div class="form-group">
                        <label for="name">Your Name</label>
                        <input
                            id="name"
                            v-model="formData.name"
                            type="text"
                            placeholder="John Doe"
                            required
                            :disabled="submitting"
                        />
                    </div>

                    <div class="form-group">
                        <label for="purpose">Purpose</label>
                        <select
                            id="purpose"
                            v-model="formData.purpose"
                            required
                            :disabled="submitting"
                        >
                            <option value="" disabled>
                                Select a purpose...
                            </option>
                            <option
                                v-for="purpose in purposes"
                                :key="purpose"
                                :value="purpose"
                            >
                                {{ purpose }}
                            </option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="message">Message</label>
                        <textarea
                            id="message"
                            v-model="formData.message"
                            placeholder="Tell me more about your inquiry..."
                            rows="4"
                            required
                            :disabled="submitting"
                        ></textarea>
                    </div>

                    <div v-if="error" class="error-message">
                        {{ error }}
                    </div>

                    <button
                        type="submit"
                        class="submit-btn"
                        :disabled="submitting"
                    >
                        <span v-if="!submitting">Send Message</span>
                        <span v-else>Sending...</span>
                    </button>
                </form>

                <div v-else class="success-message">
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="9 12 11 14 15 10"></polyline>
                    </svg>
                    <h4>Message Sent!</h4>
                    <p>
                        Thank you for reaching out. I'll get back to you soon.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.contact-section {
    display: grid;
    grid-template-columns: 45% 1fr;
    gap: 3rem;
    max-width: 1100px;
    margin: 0 auto;
    align-items: center;
}

.contact-section.image-right {
    grid-template-columns: 1fr 45%;
}

.contact-section.image-right .contact-image {
    order: 2;
}

.contact-section.image-right .contact-form-wrapper {
    order: 1;
}

.contact-image {
    position: relative;
}

.contact-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    aspect-ratio: 4/3;
}

.contact-form-wrapper {
    padding: 1rem;
}

.contact-form h3 {
    font-size: 1.5rem;
    margin: 0 0 0.5rem 0;
    color: var(--vp-c-text-1);
    font-weight: 600;
}

.contact-description {
    color: var(--vp-c-text-2);
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
    line-height: 1.5;
}

.form-group {
    margin-bottom: 1.25rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.4rem;
    font-weight: 500;
    color: var(--vp-c-text-1);
    font-size: 0.875rem;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 0.625rem 0.875rem;
    border: 1px solid var(--vp-c-divider);
    border-radius: 6px;
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-1);
    font-size: 0.9375rem;
    font-family: inherit;
    transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--vp-c-brand-1);
    background: var(--vp-c-bg);
}

.form-group input:disabled,
.form-group select:disabled,
.form-group textarea:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.form-group textarea {
    resize: vertical;
    min-height: 100px;
    line-height: 1.5;
}

.form-group select {
    cursor: pointer;
}

.submit-btn {
    width: 100%;
    padding: 0.75rem 1.5rem;
    background: var(--vp-c-brand-1);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
    background: var(--vp-c-brand-2);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.submit-btn:active:not(:disabled) {
    transform: translateY(0);
}

.submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.error-message {
    padding: 0.625rem 0.875rem;
    background: var(--vp-c-danger-soft);
    color: var(--vp-c-danger-1);
    border-radius: 6px;
    margin-bottom: 1rem;
    font-size: 0.875rem;
}

.success-message {
    text-align: center;
    padding: 2rem 1rem;
}

.success-message svg {
    color: var(--vp-c-brand-1);
    margin: 0 auto 0.75rem;
}

.success-message h4 {
    font-size: 1.25rem;
    margin: 0 0 0.5rem 0;
    color: var(--vp-c-text-1);
    font-weight: 600;
}

.success-message p {
    color: var(--vp-c-text-2);
    font-size: 0.9375rem;
    margin: 0;
}

/* Responsive */
@media (max-width: 960px) {
    .contact-section,
    .contact-section.image-right {
        grid-template-columns: 1fr;
        gap: 2rem;
        max-width: 600px;
    }

    .contact-section.image-right .contact-image,
    .contact-section.image-right .contact-form-wrapper {
        order: initial;
    }

    .contact-image img {
        aspect-ratio: 16/9;
    }

    .contact-form-wrapper {
        padding: 0;
    }

    .contact-form h3 {
        font-size: 1.375rem;
    }
}

@media (max-width: 640px) {
    .contact-form h3 {
        font-size: 1.25rem;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
        font-size: 16px; /* Prevent zoom on iOS */
    }
}
</style>
