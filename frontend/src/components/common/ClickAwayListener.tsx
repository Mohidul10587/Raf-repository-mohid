import React, { DOMElement, RefObject, useEffect } from "react";

export const ClickAwayListener = (props: {
	onClickAway: () => void,
	children: DOMElement<Element, Element>
}) => {
	const { onClickAway, children } = props;

	useEffect(() => {
		const clickAwayListener = (e: MouseEvent) => {
			const el: Node | null = e.target as Node;
			if (!(children?.ref as RefObject<Node>).current?.contains(el))
				onClickAway();
		}

		window.addEventListener("click", clickAwayListener);
		return () => {
			window.removeEventListener("click", clickAwayListener);
		}
	})

	return (
		<React.Fragment>
			{children}
		</React.Fragment>
	)
}
