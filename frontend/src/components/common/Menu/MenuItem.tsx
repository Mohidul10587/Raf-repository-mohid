import React, { ComponentProps } from "react";
import clsx from "clsx";

export const MenuItem: React.FC<ComponentProps<"div">> = ({ children, ...rest }) => (
	<div
		className={clsx(
			"p-3 flex items-center space-x-2 border-b font-[500] bg-white",
			"hover:bg-gray-100",
			rest.className
		)}
	>
		{children}
	</div>
)
