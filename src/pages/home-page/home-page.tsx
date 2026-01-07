import { Button, Link } from "~/libs/components/components";
import { getValidClassNames } from "~/libs/helpers/helpers";

import { images } from "./libs/constants/images.constants";
import styles from "./styles.module.css";

const HomePage: React.FC = () => {
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
					<h1 className={styles["hero-section__title"]}>
						Aprende Jugando,
						<br /> Crece Brillando
					</h1>
					<p className={styles["hero-section__description"]}>
						Descubre un mundo de juegos interactivos diseñados para estimular la mente de tus
						pequeños exploradores. ¡Matemáticas, lectura y lógica en un solo lugar!
					</p>
					<div className={styles["hero-section__actions"]}>
						<Link to="/games">
							<Button iconLeft="arrowRight" size="lg">
								Jugar Ahora
							</Button>
						</Link>

						<p className={styles["hero-section__auth-prompt"]}>
							¿Ya tienes cuenta?
							<br />
							<Link className={styles["hero-section__auth-link"]} to="/login">
								Inicia sesión
							</Link>{" "}
							o{" "}
							<Link className={styles["hero-section__auth-link"]} to="/register">
								regístrate gratis
							</Link>{" "}
							en segundos.
						</p>
					</div>
				</div>

				<div className={styles["hero-section__visual"]}>
					<span
						className={getValidClassNames(
							styles["hero-section__floating-card"],
							styles["hero-section__floating-card--top"]
						)}
					>
						🎉 Diversión educativa para todos
					</span>
					<img
						alt="Niños jugando y aprendiendo"
						className={getValidClassNames(
							styles["hero-section__image"],
							styles["hero-section__image--tilt-right"]
						)}
						src={images.landing1}
					/>
					<img
						alt="Juegos coloridos de bloques"
						className={getValidClassNames(
							styles["hero-section__image"],
							styles["hero-section__image--tilt-left"]
						)}
						src={images.landing2}
					/>
					<img
						alt="Niña sonriendo con tablet"
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
						<div className={styles["hero-section__floating-card-icon"]}>🚀</div>
						<div className={styles["hero-section__floating-card-content"]}>
							<span className={styles["hero-section__floating-card-label"]}>Juegos de</span>
							<span className={styles["hero-section__floating-card-title"]}>
								Matemáticas, Lectura y Lógica
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
					<h2 className={styles["categories-section__title"]}>Explora por Categoría</h2>
					<p className={styles["categories-section__description"]}>
						Encuentra el desafío perfecto para cada etapa de crecimiento
					</p>
				</div>

				<div className={styles["categories-section__grid"]}>
					<Link className={styles["category-card"]} to="/games?category=math">
						<div className={styles["category-card__icon-wrapper"]}>🧮</div>
						<h3 className={styles["category-card__title"]}>Matemáticas</h3>
						<p className={styles["category-card__description"]}>
							Números, formas y lógica divertida.
						</p>
					</Link>
					<Link className={styles["category-card"]} to="/games?category=reading">
						<div className={styles["category-card__icon-wrapper"]}>📚</div>
						<h3 className={styles["category-card__title"]}>Lectura</h3>
						<p className={styles["category-card__description"]}>
							Cuentos, letras y vocabulario nuevo.
						</p>
					</Link>
					<Link className={styles["category-card"]} to="/games?category=logic">
						<div className={styles["category-card__icon-wrapper"]}>🧩</div>
						<h3 className={styles["category-card__title"]}>Lógica</h3>
						<p className={styles["category-card__description"]}>
							Puzzles, secuencias y retos mentales.
						</p>
					</Link>
				</div>
			</section>

			{/* CTA Section */}
			<section className={getValidClassNames(styles["cta-section"], styles["section--overlap"])}>
				<div className={styles["cta-section__container"]}>
					<h2 className={styles["cta-section__title"]}>¿Listo para comenzar?</h2>
					<p className={styles["cta-section__description"]}>
						Únete a miles de familias que ya están aprendiendo con SmartSprouts.
					</p>
					<Link to="/register">
						<Button size="lg">Regístrate Gratis</Button>
					</Link>
				</div>
			</section>
		</div>
	);
};

export { HomePage };
