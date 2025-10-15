import { useEffect, useState } from "react";

const Callcon = () => {
    const [form, setForm] = useState({ fullname: "", phone: "", time: "", comment: "", consent: false });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showNotice, setShowNotice] = useState(false);

    const validate = () => {
        const e = {};
        if (!form.fullname.trim()) e.fullname = "Укажите ваше имя";
        // Простая проверка телефона: +7 и 10 цифр
        const phoneDigits = form.phone.replace(/\D/g, "");
        if (!(phoneDigits.length === 11 && phoneDigits.startsWith("7"))) e.phone = "Укажите телефон в формате +7XXXXXXXXXX";
        if (!form.consent) e.consent = "Требуется согласие";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSubmitting) return; // защита от повторных кликов
        if (!validate()) return;
        setIsSubmitting(true);
        // Имитация сетевого запроса
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
            setShowNotice(true);
        }, 1200);
    };

    // Автоскрытие уведомления через 3 сек
    useEffect(() => {
        if (!showNotice) return;
        const t = setTimeout(() => setShowNotice(false), 3000);
        return () => clearTimeout(t);
    }, [showNotice]);

    const resetForm = () => {
        setForm({ fullname: "", phone: "", time: "", comment: "", consent: false });
        setErrors({});
    };

    if (submitted) {
        return (
            <main className="call-page">
                {showNotice && (
                    <div className="toast toast-success" role="status" aria-live="polite">
                        Звонок сохранен
                    </div>
                )}
                <div className="call-card success">
                    <h2 className="call-title">Заявка отправлена</h2>
                    <p className="call-subtitle">Спасибо! Мы свяжемся с вами в ближайшее время.</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => { resetForm(); setSubmitted(false); }}
                    >
                        Отправить еще одну
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="call-page">
            {showNotice && (
                <div className="toast toast-success" role="status" aria-live="polite">
                    Звонок сохранен
                </div>
            )}
            <div className={`call-card ${isSubmitting ? 'is-submitting' : ''}`} aria-busy={isSubmitting}>
                <h2 className="call-title">Заказать звонок</h2>
                <p className="call-subtitle">Оставьте контакты, и мы перезвоним вам для уточнения деталей.</p>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="fullname">ФИО</label>
                        <input
                            id="fullname"
                            name="fullname"
                            type="text"
                            className={`form-input ${errors.fullname ? 'has-error' : ''}`}
                            placeholder="Иванов Иван"
                            value={form.fullname}
                            onChange={handleChange}
                            autoComplete="name"
                            disabled={isSubmitting}
                        />
                        {errors.fullname && <div className="field-error">{errors.fullname}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Телефон</label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            className={`form-input ${errors.phone ? 'has-error' : ''}`}
                            placeholder="+7XXXXXXXXXX"
                            value={form.phone}
                            onChange={handleChange}
                            autoComplete="tel"
                            disabled={isSubmitting}
                        />
                        {errors.phone && <div className="field-error">{errors.phone}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="time">Удобное время для звонка (необязательно)</label>
                        <input
                            id="time"
                            name="time"
                            type="text"
                            className="form-input"
                            placeholder="Например: будни 10:00–18:00"
                            value={form.time}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="comment">Комментарий (необязательно)</label>
                        <textarea
                            id="comment"
                            name="comment"
                            className="form-input"
                            rows="4"
                            placeholder="Кратко опишите вопрос"
                            value={form.comment}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group checkbox">
                        <input
                            id="consent"
                            name="consent"
                            type="checkbox"
                            checked={form.consent}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                        <label htmlFor="consent">
                            Нажимая «Отправить», я соглашаюсь с обработкой персональных данных в соответствии с 152‑ФЗ «О персональных данных».
                        </label>
                    </div>
                    {errors.consent && <div className="field-error" style={{ marginTop: -8 }}>{errors.consent}</div>}

                    <div className="actions">
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? (<><span className="spinner" aria-hidden="true" /> Отправка…</>) : 'Отправить'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Callcon;