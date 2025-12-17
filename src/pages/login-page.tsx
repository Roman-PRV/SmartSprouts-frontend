import { Button, Input } from "~/libs/components/components";
import { useCallback, useState } from "~/libs/hooks/hooks";

const LoginPage: React.FC = () => {
	// State for Input demos
	const [textValue, setTextValue] = useState("");
	const [emailValue, setEmailValue] = useState("");
	const [passwordValue, setPasswordValue] = useState("");
	const [searchValue, setSearchValue] = useState("");
	const [numberValue, setNumberValue] = useState("");
	const [errorValue, setErrorValue] = useState("");

	// Handler for disabled input (no-op)
	const handleDisabledChange = useCallback(() => {
		// Disabled input doesn't need to handle changes
	}, []);

	return (
		<div style={{ padding: "2rem" }}>
			<h1>Component Demo Page</h1>

			{/* Input Component Demo */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "1.5rem",
					marginBottom: "3rem",
					marginTop: "2rem",
					maxWidth: "500px",
				}}
			>
				<h2>Input Component Demo</h2>

				<h3>Input Types</h3>
				<Input
					label="Text Input"
					onChange={setTextValue}
					placeholder="Enter text..."
					value={textValue}
				/>

				<Input
					label="Email Input"
					onChange={setEmailValue}
					placeholder="your@email.com"
					required
					type="email"
					value={emailValue}
				/>

				<Input
					label="Password Input"
					onChange={setPasswordValue}
					placeholder="Enter password"
					required
					type="password"
					value={passwordValue}
				/>

				<Input
					label="Number Input"
					onChange={setNumberValue}
					placeholder="Enter number"
					type="number"
					value={numberValue}
				/>

				<Input
					label="Search Input"
					onChange={setSearchValue}
					placeholder="Search..."
					type="search"
					value={searchValue}
				/>

				<h3>Input with Icons</h3>
				<Input
					iconLeft="login"
					label="Email with Icon"
					onChange={setEmailValue}
					placeholder="your@email.com"
					value={emailValue}
				/>

				<Input
					iconLeft="lock"
					label="Password with Icon"
					onChange={setPasswordValue}
					placeholder="Enter password"
					type="password"
					value={passwordValue}
				/>

				<Input
					iconRight="arrowRight"
					onChange={setSearchValue}
					placeholder="Search with icon..."
					type="search"
					value={searchValue}
				/>

				<h3>Input States</h3>
				<Input
					error="This field is required"
					label="Input with Error"
					onChange={setErrorValue}
					placeholder="Enter valid email"
					required
					value={errorValue}
				/>

				<Input
					disabled
					label="Disabled Input"
					onChange={handleDisabledChange}
					placeholder="Cannot edit"
					value="Disabled value"
				/>

				<Input
					label="Required Input"
					onChange={setTextValue}
					placeholder="This is required"
					required
					value={textValue}
				/>

				<h3>Complex Example</h3>
				<Input
					error={emailValue && !emailValue.includes("@") ? "Please enter a valid email" : null}
					iconLeft="login"
					label="Email Address"
					onChange={setEmailValue}
					placeholder="Enter your email"
					required
					type="email"
					value={emailValue}
				/>
			</div>

			{/* Button Component Demo */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "1rem",
					marginTop: "2rem",
					maxWidth: "400px",
				}}
			>
				<h2>Button Component Demo</h2>

				<h3>Button Variants</h3>
				<Button variant="primary">Primary Button</Button>
				<Button variant="secondary">Secondary Button</Button>
				<Button variant="danger">Danger Button</Button>
				<Button variant="ghost">Ghost Button</Button>

				<h3>Button Sizes</h3>
				<Button size="sm">Small Button</Button>
				<Button size="md">Medium Button</Button>
				<Button size="lg">Large Button</Button>

				<h3>Button States</h3>
				<Button disabled>Disabled Button</Button>
				<Button isLoading>Loading Button</Button>

				<h3>Buttons with Icons</h3>
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

				<h3>Full Width</h3>
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
