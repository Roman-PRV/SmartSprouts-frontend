import { Button, Link, Trans } from "~/libs/components/components";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useAppSelector, useTranslation } from "~/libs/hooks/hooks";

import { images } from "./libs/constants/images.constants";
import styles from "./styles.module.css";

const HomePage: React.FC = () => {
	const { t } = useTranslation();
	const { isAuthenticated } = useAppSelector(({ auth }) => auth);

	return (
		<div className={styles["home-page"]}>
			{/* Hero Section */}
			<section className={styles["hero-section"]}>
				<div
					className={getValidClassNames(
						styles["hero-section__blob"],
						styles["hero-section__blob--top"]
					)}
				/>
				<div
					className={getValidClassNames(
						styles["hero-section__blob"],
						styles["hero-section__blob--bottom"]
					)}
				/>

				<div className={styles["hero-section__content"]}>
					<h1 className={styles["hero-section__title"]}>{t("home.hero.title")}</h1>
					<p className={styles["hero-section__description"]}>{t("home.hero.description")}</p>
					<div className={styles["hero-section__actions"]}>
						<Link to="/games">
							<Button iconLeft="arrowRight" size="lg">
								{t("common.button.playNow")}
							</Button>
						</Link>

						{!isAuthenticated && (
							<p className={styles["hero-section__auth-prompt"]}>
								<Trans
									components={[
										<br key="0" />,
										<Link className={styles["hero-section__auth-link"]} key="1" to="/login" />,
										<Link className={styles["hero-section__auth-link"]} key="2" to="/register" />,
									]}
									i18nKey="home.hero.actions.authPrompt"
								>
									Already have an account?
									<br />
									<Link className={styles["hero-section__auth-link"]} to="/login">
										Log in
									</Link>{" "}
									or{" "}
									<Link className={styles["hero-section__auth-link"]} to="/register">
										sign up for free
									</Link>{" "}
									in seconds.
								</Trans>
							</p>
						)}
					</div>
				</div>

				<div className={styles["hero-section__visual"]}>
					<span
						className={getValidClassNames(
							styles["hero-section__floating-card"],
							styles["hero-section__floating-card--top"]
						)}
					>
						<span aria-label={t("home.hero.floatingCards.top.iconAriaLabel")} role="img">
							🎉
						</span>{" "}
						{t("home.hero.floatingCards.top.title")}
					</span>
					<img
						alt={t("home.hero.images.landing1")}
						className={getValidClassNames(
							styles["hero-section__image"],
							styles["hero-section__image--tilt-right"]
						)}
						src={images.landing1}
					/>
					<img
						alt={t("home.hero.images.landing2")}
						className={getValidClassNames(
							styles["hero-section__image"],
							styles["hero-section__image--tilt-left"]
						)}
						src={images.landing2}
					/>
					<img
						alt={t("home.hero.images.landing3")}
						className={getValidClassNames(
							styles["hero-section__image"],
							styles["hero-section__image--wide"]
						)}
						src={images.landing3}
					/>
					<div
						className={getValidClassNames(
							styles["hero-section__floating-card"],
							styles["hero-section__floating-card--bottom"]
						)}
					>
						<div className={styles["hero-section__floating-card-icon"]}>
							<span aria-label={t("home.hero.floatingCards.bottom.iconAriaLabel")} role="img">
								🚀
							</span>
						</div>
						<div className={styles["hero-section__floating-card-content"]}>
							<span className={styles["hero-section__floating-card-label"]}>
								{t("home.hero.floatingCards.bottom.label")}
							</span>
							<span className={styles["hero-section__floating-card-title"]}>
								{t("home.hero.floatingCards.bottom.title")}
							</span>
						</div>
					</div>
				</div>
			</section>

			{/* Categories Section */}
			<section
				className={getValidClassNames(styles["categories-section"], styles["section--overlap"])}
			>
				<div className={styles["categories-section__header"]}>
					<h2 className={styles["categories-section__title"]}>{t("home.categories.title")}</h2>
					<p className={styles["categories-section__description"]}>
						{t("home.categories.description")}
					</p>
				</div>

				<div className={styles["categories-section__grid"]}>
					<Link className={styles["category-card"]} to="/games?category=math">
						<div className={styles["category-card__icon-wrapper"]}>
							<span aria-label={t("home.categories.math.iconAriaLabel")} role="img">
								🧮
							</span>
						</div>
						<h3 className={styles["category-card__title"]}>{t("home.categories.math.title")}</h3>
						<p className={styles["category-card__description"]}>
							{t("home.categories.math.description")}
						</p>
					</Link>
					<Link className={styles["category-card"]} to="/games?category=reading">
						<div className={styles["category-card__icon-wrapper"]}>
							<span aria-label={t("home.categories.reading.iconAriaLabel")} role="img">
								📚
							</span>
						</div>
						<h3 className={styles["category-card__title"]}>{t("home.categories.reading.title")}</h3>
						<p className={styles["category-card__description"]}>
							{t("home.categories.reading.description")}
						</p>
					</Link>
					<Link className={styles["category-card"]} to="/games?category=logic">
						<div className={styles["category-card__icon-wrapper"]}>
							<span aria-label={t("home.categories.logic.iconAriaLabel")} role="img">
								🧩
							</span>
						</div>
						<h3 className={styles["category-card__title"]}>{t("home.categories.logic.title")}</h3>
						<p className={styles["category-card__description"]}>
							{t("home.categories.logic.description")}
						</p>
					</Link>
				</div>
			</section>

			{/* CTA Section */}
			<section className={getValidClassNames(styles["cta-section"], styles["section--overlap"])}>
				<div className={styles["cta-section__container"]}>
					<h2 className={styles["cta-section__title"]}>{t("home.cta.title")}</h2>
					<p className={styles["cta-section__description"]}>{t("home.cta.description")}</p>
					{!isAuthenticated && (
						<Link to="/register">
							<Button size="lg">{t("common.button.register")}</Button>
						</Link>
					)}
				</div>
			</section>
		</div>
	);
};

export { HomePage };
