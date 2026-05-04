import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	children: ReactNode;
	variant?: ButtonVariant;
};

const variantClassName: Record<ButtonVariant, string> = {
	primary: "tsf-button tsf-button-primary",
	secondary: "tsf-button tsf-button-secondary",
};

export function Button({
	children,
	variant = "primary",
	className,
	...props
}: ButtonProps) {
	const classes = [variantClassName[variant], className]
		.filter(Boolean)
		.join(" ");

	return (
		<button className={classes} type="button" {...props}>
			{children}
		</button>
	);
}
