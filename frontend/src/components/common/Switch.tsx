import React, { ComponentProps } from "react";
import clsx from "clsx";

export type ISwitchProps = {
	defaultChecked?: boolean,
	checked?: boolean,
	onChange?: () => void
} & ComponentProps<"input">

export const Switch: React.FC<ISwitchProps> = (
	{
		defaultChecked = false,
		checked = false,
		onChange,
	}) => {
	return (
		<div
			className="checkbox relative inline-block cursor-pointer"
			onClick={onChange}
		>
			<span
				className={clsx(
					"absolute top-[2px] left-[2px] inline-block w-3 h-3",
					"bg-white rounded-full transition-all duration-300",
					(checked || defaultChecked) ? "transform translate-x-[16px]" : ""
				)}
			/>
			<div className={clsx(
				"checkbox-track w-[32px] h-[16px] rounded-[24px]",
				(checked || defaultChecked) ? "bg-green-600" : "bg-gray-400"
			)} />
		</div>
	)
}
