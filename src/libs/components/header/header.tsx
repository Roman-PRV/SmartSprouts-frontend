import { Logo, Navigation } from "~/libs/components/components";

const Header: React.FC = () => {
	return (
		<header className="flex bg-red-50">
			<Logo />
			<Navigation />
		</header>
	);
};

export { Header };
