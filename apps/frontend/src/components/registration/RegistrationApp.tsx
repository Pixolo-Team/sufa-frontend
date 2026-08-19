// REACT //
import { useCallback, useMemo, useState } from "react";

// STYLES //
import styles from "./registration-page.module.scss";

// CONSTANTS //
import { VENUE_OPTIONS } from "@/constants/venues";

// ENUMS //
import { ToastTypes } from "@/neevo/enums/toast.enum";

// HOOKS //
import { useLeadSubmit } from "@/hooks/use-lead-submit";

// SERVICES //
import { showToast } from "@/neevo/services/toast.service";

// ICONS //
import {
	ArrowDownIcon,
	CheckCircleIcon,
	GlobeIcon,
	InstagramIcon,
	PhoneIcon,
	WhatsappIcon,
	YoutubeIcon,
} from "./RegistrationIcons";

// Same values as the shared VENUE_OPTIONS (staff Add Lead + public Enquiry
// forms) so a venue reads identically no matter which form it came through -
// only the emoji prefix here is form-specific decoration.
const VENUES = VENUE_OPTIONS.map((option) => ({
	value: option.value,
	label: `📍 ${option.label}`,
}));

const GENDERS = [
	{ value: "male", label: "🧒 Boy" },
	{ value: "female", label: "👧 Girl" },
	{ value: "other", label: "Other" },
];

const CONNECT_LINKS = [
	{
		href: "https://academy.skorostunited.com/",
		label: "Website",
		icon: GlobeIcon,
		iconClass: styles.iconWebsite,
	},
	{
		href: "https://www.instagram.com/skorostunitedyouthacademy",
		label: "Instagram",
		icon: InstagramIcon,
		iconClass: styles.iconInstagram,
	},
	{
		href: "https://www.youtube.com/channel/UCSwfNlrAUhCnMd4j5S6XXCA",
		label: "YouTube",
		icon: YoutubeIcon,
		iconClass: styles.iconYoutube,
	},
	{
		href: "https://wa.me/919004453226?text=Hi%2C%20I%20want%20to%20enroll%20my%20child%20in%20the%20Skorost%20United%20Football%20Academy",
		label: "WhatsApp",
		icon: WhatsappIcon,
		iconClass: styles.iconWhatsapp,
	},
];

type FormState = {
	playerName: string;
	dateOfBirth: string;
	gender: string;
	mobileNumber: string;
	trainingVenue: string;
	consent: boolean;
};

const FORM_INIT: FormState = {
	playerName: "",
	dateOfBirth: "",
	gender: "",
	mobileNumber: "",
	trainingVenue: "",
	consent: false,
};

/**
 * Registration landing page, ported from registration.skorostunited.com.
 * Submits into the same `leads` table as the staff Add Lead and public
 * Enquiry forms, via the shared useLeadSubmit hook.
 */
const RegistrationApp: React.FC = () => {
	const [form, setForm] = useState<FormState>(FORM_INIT);
	const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
	const [submitted, setSubmitted] = useState(false);

	const updateField = useCallback(
		<K extends keyof FormState>(key: K, value: FormState[K]) => {
			setForm((prev) => ({ ...prev, [key]: value }));
			// Clear that field's error as soon as the user acts on it, instead of
			// leaving a stale message up until the next full submit attempt.
			setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
		},
		[]
	);

	const handleMobileChange = useCallback(
		(value: string) => {
			let digits = value.replace(/\D/g, "");
			// A pasted number often carries the +91 country code shown right next
			// to the input - strip it so it isn't mistaken for the start of a
			// (wrong) 10-digit number, e.g. "+919004453226" -> "9004453226" and
			// not a truncated "9190044532".
			if (digits.length === 12 && digits.startsWith("91")) {
				digits = digits.slice(2);
			}
			updateField("mobileNumber", digits.slice(0, 10));
		},
		[updateField]
	);

	const validate = useCallback(() => {
		const newErrors: Partial<Record<keyof FormState, string>> = {};

		if (!form.playerName.trim()) newErrors.playerName = "Player's name is required";
		if (!form.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
		if (!form.gender) newErrors.gender = "Please select a gender";
		if (form.mobileNumber.length !== 10)
			newErrors.mobileNumber = "Enter a valid 10-digit mobile number";
		if (!form.trainingVenue) newErrors.trainingVenue = "Please select a training venue";
		if (!form.consent) newErrors.consent = "Please agree to be contacted";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [form]);

	const { submitLead, isSubmitting } = useLeadSubmit({
		onSuccess: () => setSubmitted(true),
		successMessage: "Registration submitted",
		errorMessage: "Could not submit your registration. Please try again.",
	});

	const handleSubmit = useCallback(
		(event: React.FormEvent) => {
			event.preventDefault();
			if (!validate()) {
				showToast("Please fix the highlighted fields", ToastTypes.WARNING);
				return;
			}

			const otherInfo = [
				"Subject: Free Trial (Registration Form)",
			]
				.filter(Boolean)
				.join("\n");

			submitLead({
				source: "registration_page",
				name: null,
				phone: form.mobileNumber,
				studentName: form.playerName,
				studentDob: form.dateOfBirth,
				centerName: form.trainingVenue,
				gender: form.gender as "male" | "female" | "other",
				otherInfo,
				consent: form.consent,
			});
		},
		[form, validate, submitLead]
	);

	const scrollToForm = useCallback(() => {
		document
			.getElementById("registration-form")
			?.scrollIntoView({ behavior: "smooth" });
	}, []);

	const resetForm = useCallback(() => {
		setForm(FORM_INIT);
		setErrors({});
		setSubmitted(false);
	}, []);

	const decorBalls = useMemo(
		() => [
			{ top: "10%", left: "5%", size: "3.75rem", opacity: 0.2, anim: styles.animFloat },
			{
				top: "20%",
				right: "10%",
				size: "2.25rem",
				opacity: 0.15,
				anim: styles.animBounceSlow,
				delay: "0.5s",
			},
			{
				bottom: "30%",
				left: "8%",
				size: "1.875rem",
				opacity: 0.1,
				anim: styles.animWiggle,
			},
			{
				bottom: "15%",
				right: "5%",
				size: "3rem",
				opacity: 0.15,
				anim: styles.animFloat,
				delay: "1s",
			},
		],
		[]
	);

	return (
		<div className={styles.root}>
			{/* Hero */}
			<section className={styles.hero}>
				<div className={styles.heroDecor}>
					{decorBalls.map((ball, index) => (
						<i
							key={index}
							className={`${styles.decorBall} ${ball.anim}`}
							style={{
								top: ball.top,
								left: ball.left,
								right: ball.right,
								bottom: ball.bottom,
								fontSize: ball.size,
								opacity: ball.opacity,
								animationDelay: ball.delay,
							}}
						>
							⚽
						</i>
					))}
					<span
						className={`${styles.decorDot} ${styles.animBounceSlow}`}
						style={{
							top: "15%",
							right: "20%",
							width: "4rem",
							height: "4rem",
							background: "hsl(var(--reg-accent-purple) / 20%)",
						}}
					/>
					<span
						className={`${styles.decorDot} ${styles.animFloat}`}
						style={{
							bottom: "25%",
							left: "15%",
							width: "3rem",
							height: "3rem",
							background: "hsl(var(--reg-accent-orange) / 20%)",
							animationDelay: "0.7s",
						}}
					/>
					<span
						className={`${styles.decorDot} ${styles.animWiggle}`}
						style={{
							top: "40%",
							left: "3%",
							width: "2rem",
							height: "2rem",
							background: "hsl(var(--reg-cta) / 15%)",
						}}
					/>
				</div>

				<div className={styles.heroInner}>
					<div className={styles.logo}>
						<img src="/images/skorost-school-color.svg" alt="Skorost United Football School" />
					</div>

					<div className={styles.badge}>
						<span>🏆</span>
						<span>Mumbai&apos;s Trusted Football Club</span>
					</div>

					<h1 className={styles.heading}>
						Since 2003 - Shaping{" "}
						<span className={styles.headingAccent}>
							Young Footballers
							<svg viewBox="0 0 200 12" fill="none">
								<path
									d="M2 8C50 2 150 2 198 8"
									stroke="hsl(var(--reg-cta))"
									strokeWidth="4"
									strokeLinecap="round"
								/>
							</svg>
						</span>{" "}
						in Mumbai
					</h1>

					<p className={styles.subLead}>
						A fun, structured football academy for kids aged 4-16 - built on
						discipline, confidence, and love for the game.
					</p>
					<p className={styles.subFine}>
						From first kicks to competitive matches, Skorost United has supported
						the football journey of young players for over two decades.
					</p>

					<div className={styles.ctaRow}>
						<button type="button" className={styles.btnCta} onClick={scrollToForm}>
							<span>Apply for Free Trial</span>
							<ArrowDownIcon className={styles.animArrowBounce} />
						</button>
					</div>

					<div className={styles.statsRow}>
						<div className={styles.statItem}>
							<span>🧒</span>
							<span>Ages 4–16</span>
						</div>
						<div className={styles.statItem}>
							<span>📍</span>
							<span>Thane &amp; Ghatkopar</span>
						</div>
						<div className={styles.statItem}>
							<span>⭐</span>
							<span>2000+ Alumni</span>
						</div>
					</div>
				</div>
			</section>

			{/* Registration form */}
			<section id="registration-form" className={styles.formSection}>
				<div
					className={`${styles.formContainer} ${
						submitted ? styles.successContainer : ""
					}`}
				>
					<div className={`${styles.card} ${submitted ? styles.successCard : ""}`}>
						{!submitted && (
							<div className={styles.cardHeader}>
								<div className={styles.cardHeaderIcons}>
									<span>📋</span>
									<span>⚽</span>
								</div>
								<h2 className={styles.cardTitle}>Academy Registration Form</h2>
								<p className={styles.cardSubtitle}>
									Fill in the details below and our team will contact you with
									batch availability and next steps.
								</p>
							</div>
						)}

						{submitted ? (
							<div className={styles.successState} role="status">
								<div className={styles.successIconWrap}>
									<CheckCircleIcon />
								</div>
								<h3 className={styles.successTitle}>Thank You! 🎉</h3>
								<p className={styles.successText}>
									Our team will contact you within 48 hours with batch
									availability and next steps.
								</p>
								<button
									type="button"
									className={`${styles.btnCta} ${styles.successButton}`}
									onClick={resetForm}
								>
									<span>Apply for Another Child</span>
									<span>⚽</span>
								</button>
							</div>
						) : (
							<form className={styles.form} onSubmit={handleSubmit} noValidate>
								<div>
									<label className={styles.label} htmlFor="player-name">
										Player Full Name
									</label>
									<input
										id="player-name"
										type="text"
										className={styles.input}
										placeholder="Enter player's full name"
										value={form.playerName}
										onChange={(event) =>
											updateField("playerName", event.target.value)
										}
									/>
									{errors.playerName && (
										<p className={styles.fieldError}>{errors.playerName}</p>
									)}
								</div>

								<div>
									<label className={styles.label} htmlFor="date-of-birth">
										Date of Birth
									</label>
									<input
										id="date-of-birth"
										type="date"
										className={styles.input}
										value={form.dateOfBirth}
										onChange={(event) =>
											updateField("dateOfBirth", event.target.value)
										}
									/>
									{errors.dateOfBirth && (
										<p className={styles.fieldError}>{errors.dateOfBirth}</p>
									)}
								</div>

								<div>
									<span className={styles.label}>Gender</span>
									<div className={styles.genderGrid}>
										{GENDERS.map((gender) => (
											<label key={gender.value} className={styles.genderOption}>
												<input
													type="radio"
													name="gender"
													value={gender.value}
													checked={form.gender === gender.value}
													onChange={() => updateField("gender", gender.value)}
												/>
												<span>{gender.label}</span>
											</label>
										))}
									</div>
									{errors.gender && (
										<p className={styles.fieldError}>{errors.gender}</p>
									)}
								</div>

								<div>
									<label className={styles.label} htmlFor="mobile-number">
										Mobile Number
									</label>
									<div className={styles.mobileRow}>
										<span className={styles.mobilePrefix}>+91</span>
										<input
											id="mobile-number"
											type="tel"
											inputMode="numeric"
											className={`${styles.input} ${styles.mobileInput}`}
											placeholder="9876543210"
											// No maxLength: the browser truncates a *pasted* value to
											// maxLength before onChange ever runs, which cut off pasted
											// "+91XXXXXXXXXX" numbers before handleMobileChange could
											// strip the country code. It already caps at 10 digits itself.
											value={form.mobileNumber}
											onChange={(event) =>
												handleMobileChange(event.target.value)
											}
										/>
									</div>
									{errors.mobileNumber && (
										<p className={styles.fieldError}>{errors.mobileNumber}</p>
									)}
								</div>

								<div>
									<label className={styles.label} htmlFor="training-venue">
										Training Venue
									</label>
									<select
										id="training-venue"
										className={`${styles.input} ${styles.selectInput}`}
										value={form.trainingVenue}
										onChange={(event) =>
											updateField("trainingVenue", event.target.value)
										}
									>
										<option value="">Select training venue</option>
										{VENUES.map((venue) => (
											<option key={venue.value} value={venue.value}>
												{venue.label}
											</option>
										))}
									</select>
									{errors.trainingVenue && (
										<p className={styles.fieldError}>{errors.trainingVenue}</p>
									)}
								</div>

								<div className={styles.consentBox}>
									<label className={styles.consentLabel}>
										<input
											type="checkbox"
											checked={form.consent}
											onChange={(event) =>
												updateField("consent", event.target.checked)
											}
										/>
										<span>
											I agree to be contacted by Skorost United Youth Academy
											regarding admissions and batches.
										</span>
									</label>
									{errors.consent && (
										<p className={styles.fieldError}>{errors.consent}</p>
									)}
								</div>

								<button
									type="submit"
									className={`${styles.btnCta} ${styles.btnCtaFull}`}
									disabled={isSubmitting}
								>
									<span>{isSubmitting ? "Submitting..." : "Apply for Free Trial"}</span>
									{!isSubmitting && <span>⚽</span>}
								</button>
							</form>
						)}
					</div>
				</div>
			</section>

			{/* Connect / footer */}
			<footer className={styles.footer}>
				<div className={styles.footerInner}>
					<div className={styles.footerIcons}>
						<span>🤝</span>
						<span>⚽</span>
					</div>
					<h2 className={styles.footerTitle}>Connect With Skorost United</h2>
					<p className={styles.footerLead}>
						Follow us to see training sessions, match highlights, and academy
						updates.
					</p>

					<div className={styles.connectRow}>
						{CONNECT_LINKS.map((link) => {
							const Icon = link.icon;
							return (
								<a
									key={link.label}
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
									className={styles.connectTile}
								>
									<span className={`${styles.connectIconWrap} ${link.iconClass}`}>
										<Icon />
									</span>
									<span>{link.label}</span>
								</a>
							);
						})}
					</div>

					<div className={styles.footerBottom}>
						<p className={styles.footerBrand}>Skorost United Youth Academy</p>
						<p className={styles.footerTagline}>Nurturing Champions Since 2003 ⚽</p>
					</div>
				</div>
			</footer>

			<a href="tel:+919004453226" className={styles.callButton} aria-label="Call us">
				<PhoneIcon />
				<span className={styles.callRing} />
			</a>
		</div>
	);
};

export default RegistrationApp;
