import React, { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";

import { Icon } from "../components";

const Navigation: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);

	const handleBurgerClick = useCallback((): void => {
		setIsOpen(!isOpen);
	}, [isOpen]);

	return (
		<nav>
			<div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between">
					<button
						aria-label="Toggle menu"
						className="sm:hidden text-gray-700 focus:outline-none"
						onClick={handleBurgerClick}
					>
						className?: string | undefined; color?: string | undefined; name: IconName;
						{isOpen ? (
							<Icon color="white" name="closeIcon" />
						) : (
							<Icon color="white" name="burgerMenu" />
						)}
					</button>

					<ul className="hidden sm:flex gap-6 text-sm">
						<li>
							<NavLink className="hover:text-blue-600" to="/">
								Home
							</NavLink>
						</li>
						<li>
							<NavLink className="hover:text-blue-600" to="/games">
								Games
							</NavLink>
						</li>
						<li>
							<NavLink className="hover:text-blue-600" to="/profile">
								Profile
							</NavLink>
						</li>
					</ul>
				</div>

				{isOpen && (
					<ul className="mt-4 flex flex-col gap-4 sm:hidden text-sm">
						<li>
							<NavLink onClick={handleBurgerClick} to="/">
								Home
							</NavLink>
						</li>
						<li>
							<NavLink onClick={handleBurgerClick} to="/games">
								Games
							</NavLink>
						</li>
						<li>
							<NavLink onClick={handleBurgerClick} to="/profile">
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
