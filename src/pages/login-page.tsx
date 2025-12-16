import { Button } from "~/libs/components/components";

const LoginPage: React.FC = () => {
	return (
		<div style={{ padding: "2rem" }}>
			<h1>Login Page - Button Component Demo</h1>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "1rem",
					marginTop: "2rem",
					maxWidth: "400px",
				}}
			>
				<h2>Button Variants</h2>
				<Button variant="primary">Primary Button</Button>
				<Button variant="secondary">Secondary Button</Button>
				<Button variant="danger">Danger Button</Button>
				<Button variant="ghost">Ghost Button</Button>

				<h2>Button Sizes</h2>
				<Button size="sm">Small Button</Button>
				<Button size="md">Medium Button</Button>
				<Button size="lg">Large Button</Button>

				<h2>Button States</h2>
				<Button disabled>Disabled Button</Button>
				<Button isLoading>Loading Button</Button>

				<h2>Buttons with Icons (Login Theme)</h2>
				<Button iconLeft="login" variant="primary">
					Login
				</Button>
				<Button iconRight="arrowRight" variant="primary">
					Continue
				</Button>
				<Button iconLeft="lock" variant="secondary">
					Secure Login
				</Button>
				<Button iconRight="logout" variant="danger">
					Logout
				</Button>
				<Button iconLeft="check" variant="primary">
					Confirm
				</Button>
				<Button iconLeft="login" iconRight="arrowRight" variant="primary">
					Sign In Now
				</Button>

				<h2>Icons with Different Sizes</h2>
				<Button iconLeft="login" size="sm" variant="primary">
					Small Login
				</Button>
				<Button iconLeft="login" size="md" variant="primary">
					Medium Login
				</Button>
				<Button iconLeft="login" size="lg" variant="primary">
					Large Login
				</Button>

				<h2>Full Width with Icons</h2>
				<Button fullWidth iconLeft="login" variant="primary">
					Full Width Login
				</Button>
				<Button fullWidth iconLeft="lock" isLoading variant="primary">
					Authenticating...
				</Button>
			</div>
		</div>
	);
};

export { LoginPage };
