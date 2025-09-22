import { Logo } from "~/libs/components/components";

const Header: React.FC = () => {
	return (
		<header className="bg-red-50">
			<Logo />
			<h1>SmartSprouts header</h1>
		</header>
	);
};

export { Header };
