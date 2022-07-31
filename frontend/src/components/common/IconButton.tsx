import React from "react";
import clsx from "clsx";

export type IIconButtonProps = {
	icon?: React.ReactNode,
	variant?: "rounded" | "circle"
} & React.ComponentPropsWithRef<'button'>;

export const IconButton: React.FC<IIconButtonProps> = (
		{
			icon,
			variant= "rounded",
			className,
			...rest
		},
	) => {

	return (
		<button
			className={clsx(
				"w-12 h-12 inline-flex justify-center items-center p-2",
				" border border-primary-500",
				"transition-all duration-200 hover:bg-gray-100",
				variant === "rounded" && "rounded-xl",
				variant === "rounded" && "rounded-full",
				className
			)}
			{...rest}
		>
			{icon}
		</button>
	)
}

export default IconButton;
