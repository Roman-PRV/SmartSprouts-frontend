import React, { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";

import { getValidClassNames } from "~/libs/helpers/helpers";

import { Icon } from "../components";
import styles from "./styles.module.css";

const Navigation: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);

	const handleBurgerClick = useCallback((): void => {
		setIsOpen((previous) => !previous);
	}, []);

	const handleKeyDownToggle = useCallback(
		(event: React.KeyboardEvent): void => {
			if (event.key === "Enter" || event.key === " ") {
				handleBurgerClick();
			}
		},
		[handleBurgerClick]
	);

	return (
		<nav>
			<div className="px-2 py-4 sm:px-4 lg:px-6">
				<div className="flex items-center justify-between">
					<button
						aria-label="Toggle menu"
						className={getValidClassNames(styles["burger-button"], "sm:hidden")}
						onClick={handleBurgerClick}
					>
						{isOpen ? <Icon name="closeIcon" /> : <Icon name="burgerMenu" />}
					</button>
					<ul className={getValidClassNames(styles["nav"], "hidden sm:flex")}>
						<li>
							<NavLink className={getValidClassNames(styles["nav__item"])} to="/">
								Home
							</NavLink>
						</li>
						<li>
							<NavLink className={getValidClassNames(styles["nav__item"])} to="/games">
								Games
							</NavLink>
						</li>
						<li>
							<NavLink className={getValidClassNames(styles["nav__item"])} to="/profile">
								Profile
							</NavLink>
						</li>
					</ul>
				</div>

				{isOpen && (
					<ul
						className={getValidClassNames(
							styles["menu"],
							"sm:hidden",
							"text-sm",
							"flex",
							"flex-col",
							"items-end",
							"gap-y-4"
						)}
					>
						<li>
							<NavLink
								className={getValidClassNames(styles["menu__item"])}
								onClick={handleBurgerClick}
								onKeyDown={handleKeyDownToggle}
								to="/"
							>
								Home
							</NavLink>
						</li>
						<li>
							<NavLink
								className={getValidClassNames(styles["menu__item"])}
								onClick={handleBurgerClick}
								to="/games"
							>
								Games
							</NavLink>
						</li>
						<li>
							<NavLink
								className={getValidClassNames(styles["menu__item"])}
								onClick={handleBurgerClick}
								to="/profile"
							>
								Profile
							</NavLink>
						</li>
					</ul>
				)}
			</div>
		</nav>
	);
};

export { Navigation };
